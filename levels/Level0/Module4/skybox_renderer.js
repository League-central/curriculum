var sbShader;
var sbVao;
var sbVbo;

var sbPositionID;
var sbProjectionViewMatrixID;

var sbCubeMap;

function initSkyboxRenderer(){
    let sbVertexShader = "#version 300 es\n\
    in vec3 position;\n\
    out vec3 uvCoords;\n\
    uniform mat4 projectionViewMatrix;\n\
    void  main(){\
    mat4 pvm = projectionViewMatrix;\
    uvCoords = position;\
    vec4 pos = projectionViewMatrix * vec4(position, 1.0);\
    gl_Position = pos.xyww;\
    }";
    let sbFragmentShader = "#version 300 es\n\
    precision mediump float;\n\
    out vec4 finalColor;\n\
    in vec3 uvCoords;\n\
    uniform samplerCube skybox;\n\
    void main(){\
    finalColor = texture(skybox, uvCoords);\
    }";

    let skyboxVertices = [        
        -1.0,  1.0, -1.0,   -1.0, -1.0, -1.0,   1.0, -1.0, -1.0,    1.0, -1.0, -1.0,
        1.0,  1.0, -1.0,    -1.0,  1.0, -1.0,   -1.0, -1.0,  1.0,   -1.0, -1.0, -1.0,
        -1.0,  1.0, -1.0,   -1.0,  1.0, -1.0,   -1.0,  1.0,  1.0,   -1.0, -1.0,  1.0,
        1.0, -1.0, -1.0,    1.0, -1.0,  1.0,    1.0,  1.0,  1.0,    1.0,  1.0,  1.0,
        1.0,  1.0, -1.0,    1.0, -1.0, -1.0,    -1.0, -1.0,  1.0,   -1.0,  1.0,  1.0,
        1.0,  1.0,  1.0,    1.0,  1.0,  1.0,    1.0, -1.0,  1.0,    -1.0, -1.0,  1.0,   
        -1.0,  1.0, -1.0,   1.0,  1.0, -1.0,    1.0,  1.0,  1.0,    1.0,  1.0,  1.0,
        -1.0,  1.0,  1.0,   -1.0,  1.0, -1.0,   -1.0, -1.0, -1.0,   -1.0, -1.0,  1.0,
        1.0, -1.0, -1.0,    1.0, -1.0, -1.0,    -1.0, -1.0,  1.0,   1.0, -1.0,  1.0
    ];

    sbShader = compileGLShader(gl, sbVertexShader, sbFragmentShader);

    sbCubeMap = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, sbCubeMap);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);

    sbPositionID = gl.getAttribLocation(sbShader, "position");
    sbProjectionViewMatrixID = gl.getUniformLocation(sbShader, "projectionViewMatrix");

    sbVao = gl.createVertexArray();
    gl.bindVertexArray(sbVao);
    sbVbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sbVbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(skyboxVertices), gl.STATIC_DRAW);

    gl.enableVertexAttribArray(sbPositionID);
    gl.vertexAttribPointer(sbPositionID, 3, gl.FLOAT, gl.FALSE, 0, 0);
}

function renderSkybox(projection, orientation){
    gl.depthFunc(gl.LEQUAL);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, sbCubeMap);
    gl.useProgram(sbShader);
    let mat = Matrix4.multiply(projection, orientation.toMatrix4());
    gl.uniformMatrix4fv(sbProjectionViewMatrixID, gl.FALSE, mat.m);
    gl.bindVertexArray(sbVao);
    gl.drawArrays(gl.TRIANGLES, 0, 36);
    gl.depthFunc(gl.LESS);
}

function loadSkyboxFaceImage(imageData, width, height, face){
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, sbCubeMap);
    switch(face){
        case "-x":{
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(imageData));
            break;
        }
        case "+x":{
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(imageData));
            break;
        }
        case "-y":{
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(imageData));
            break;
        }
        case "+y":{
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(imageData));
            break;
        }
        case "-z":{
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(imageData));
            break;
        }
        case "+z":{
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(imageData));
            break;
        }
        default:{
            alert("INVALID FACE TYPE. OPTIONS: -x, +x, -y, +y, -z, +z");
        }
    }
}