class ParticleEmitter{
    constructor(){
        this.position = new Vector3();
        this.positions = [];
        this.scales = [];
        this.orientations = [];
        this.velocities = [];
        this.durrations = [];
        this.startDelays = []
        this.textureID = paDefaultTexture;
        this.totalTime = 0;
        this.updateFunction;
        this.repeat = false;
        this.discard = false;
        this.color = new Vector4(1, 1, 1, 1);
    }
}

var paShader;
var paVao;
var paVbo;
var paInstanceBuffer;

var paPositionID;
var paNormalID;
var paUvID;
var paInstanceMatrixID;
var paColorMultID;

var paCameraViewMatrixID;

var paDefaultTexture = 0;

function initParticleRenderer(){
    let paVertShader = "#version 300 es\n\
    in vec3 position;\n\
    in vec3 normal;\n\
    in vec2 uvCoordinate;\n\
    in mat4 instanceMatrix;\n\
    uniform mat4 cameraViewMatrix;\n\
    out vec3 fragPos;\n\
    out vec3 norm;\n\
    out vec2 uv;\n\
    void main(){\n\
        vec3 particleCenter = vec3(instanceMatrix[3][0], instanceMatrix[3][1], instanceMatrix[3][2]);\n\
        vec2 particleSize = vec2(instanceMatrix[0][0], instanceMatrix[1][1] * 0.5);\n\
        vec3 cameraRight = vec3(cameraViewMatrix[0][0], cameraViewMatrix[1][0], cameraViewMatrix[2][0]);\n\
        vec3 cameraUp = vec3(cameraViewMatrix[0][1], cameraViewMatrix[1][1], cameraViewMatrix[2][1]);\n\
        vec3 newPos = particleCenter + cameraRight * position.x * particleSize.x + \
                                       cameraUp * position.y * (particleSize.y);\n\
        uv = uvCoordinate;\n\
        norm = normal;\n\
        gl_Position = cameraViewMatrix * vec4(newPos, 1.0);\n\
    }";

    let paFragShader = "#version 300 es\n\
    precision mediump float;\n\
    in vec2 uv;\n\
    in vec3 norm;\n\
    in vec3 fragPos;\n\
    uniform sampler2D tex;\n\
    uniform vec3 lightPosition;\n\
    uniform vec4 colorMult;\n\
    out vec4 finalColor;\n\
    void main(){\
        finalColor = colorMult * texture(tex, uv);\
    }";

    paShader = compileGLShader(gl, paVertShader, paFragShader);
    gl.useProgram(paShader);

    paPositionID = gl.getAttribLocation(paShader, "position");
    paNormalID = gl.getAttribLocation(paShader, "normal");
    paUvID = gl.getAttribLocation(paShader, "uvCoordinate");
    paInstanceMatrixID = gl.getAttribLocation(paShader, "instanceMatrix");

    paCameraViewMatrixID = gl.getUniformLocation(paShader, "cameraViewMatrix");
    paColorMultID = gl.getUniformLocation(paShader, "colorMult");

    paVao = gl.createVertexArray();
    gl.bindVertexArray(paVao);

    let verts = [
        -0.5, -0.5, 0.0,    0.0, 0.0, 1.0,      0.0, 1.0,  
        0.5, -0.5, 0.0,     0.0, 0.0, 1.0,      1.0, 1.0,    
        0.5, 0.5, 0.0,      0.0, 0.0, 1.0,      1.0, 0.0,     
        0.5, 0.5, 0.0,      0.0, 0.0, 1.0,      1.0, 0.0,
        -0.5, 0.5, 0.0,     0.0, 0.0, 1.0,      0.0, 0.0,    
        -0.5, -0.5, 0.0,    0.0, 0.0, 1.0,      0.0, 1.0 
    ];

    paVbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, paVbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(paPositionID);
    gl.enableVertexAttribArray(paNormalID);
    gl.enableVertexAttribArray(paUvID);
    gl.vertexAttribPointer(paPositionID, 3, gl.FLOAT, gl.FALSE, 32, 0);
    gl.vertexAttribPointer(paNormalID, 3, gl.FLOAT, gl.FALSE, 32, 12);
    gl.vertexAttribPointer(paUvID, 2, gl.FLOAT, gl.FALSE, 32, 24);

    paInstanceBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, paInstanceBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 0, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(paInstanceMatrixID + 0);
    gl.enableVertexAttribArray(paInstanceMatrixID + 1);
    gl.enableVertexAttribArray(paInstanceMatrixID + 2);
    gl.enableVertexAttribArray(paInstanceMatrixID + 3);
    gl.vertexAttribPointer(paInstanceMatrixID + 0, 4, gl.FLOAT, gl.FALSE, 64, 0);
    gl.vertexAttribPointer(paInstanceMatrixID + 1, 4, gl.FLOAT, gl.FALSE, 64, 16);
    gl.vertexAttribPointer(paInstanceMatrixID + 2, 4, gl.FLOAT, gl.FALSE, 64, 32);
    gl.vertexAttribPointer(paInstanceMatrixID + 3, 4, gl.FLOAT, gl.FALSE, 64, 48);
    gl.vertexAttribDivisor(paInstanceMatrixID + 0, 1);
    gl.vertexAttribDivisor(paInstanceMatrixID + 1, 1);
    gl.vertexAttribDivisor(paInstanceMatrixID + 2, 1);
    gl.vertexAttribDivisor(paInstanceMatrixID + 3, 1);

    let pix = [
        0, 0, 0, 0, 255, 255, 255, 255, 0, 0, 0, 0,
        255, 255, 255, 255, 255, 255, 255, 255,255, 255, 255, 255,
        0, 0, 0, 0, 255, 255, 255, 255, 0, 0, 0, 0
    ];

    paDefaultTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, paDefaultTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 3, 3, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(pix));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
}

function renderParticles(partEmtrs, camera, deltaTime){
    gl.useProgram(paShader);
    gl.bindVertexArray(paVao);
    for(let i = 0; i < partEmtrs.length; i++){
        let part = partEmtrs[i];
        
        gl.bindTexture(gl.TEXTURE_2D, part.textureID);
        let instMats = [];
  
        for(let j = 0; j < part.positions.length; j++){
            let m = Matrix4.buildModelMatrix4(part.positions[j], part.scales[j], part.orientations[j]);
            for(let k = 0; k < 16; k++){
                instMats.push(m.m[k]);
            }
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, paInstanceBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(instMats), gl.DYNAMIC_DRAW);
        gl.uniform4fv(paColorMultID, part.color.toArray());
        gl.uniformMatrix4fv(paCameraViewMatrixID, gl.FALSE, camera.viewMatrix.m);
        gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, part.positions.length);
    }
}

function updateParticles(partEmtrs, deltaTime){
    for(let i = 0; i < partEmtrs.length; i++){
        let part = partEmtrs[i];
        if(part.discard){
            part.discard = false;
            part.totalTime = 0;
            partEmtrs.splice(i, 1);
            continue;
        }
        part.totalTime += deltaTime;
        part.updateFunction(part, deltaTime);
    }
}