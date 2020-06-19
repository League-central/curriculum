var canvasShader;
var canvasVAO;
var canvasVBO;

var canvasPositionID;
var canvasUVID;
var canvasProjectionMatrixID;
var canvasColorUID;

var canvasDefaultTexture;

function initCanvasRenderer(width, height){
    let canVertShad = "#version 300 es\n\
    in vec2 position;\n\
    in vec2 uvCoordinate;\n\
    uniform mat4 projectionMatrix;\n\
    out vec2 uv;\n\
    void main(){\
    uv = uvCoordinate;\
    gl_Position = projectionMatrix * vec4(position, 0.0, 1.0);\
    }\
    ";
    let canFragShad = "#version 300 es\n\
    precision mediump float;\n\
    in vec2 uv;\n\
    uniform vec4 color;\n\
    uniform sampler2D tex;\n\
    out vec4 finalColor;\n\
    void main(){\
    vec4 texCol = texture(tex, uv);\
    finalColor = color * texCol;\
    }";

    canvasShader = compileGLShader(gl, canVertShad, canFragShad);
    gl.useProgram(canvasShader);

    canvasPositionID = gl.getAttribLocation(canvasShader, "position");
    canvasUVID = gl.getAttribLocation(canvasShader, "uvCoordinate");
    canvasProjectionMatrixID = gl.getUniformLocation(canvasShader, "projectionMatrix");
    canvasColorUID = gl.getUniformLocation(canvasShader, "color");

    let cam = new Camera();
    cam.setOrthographicProjection(0, width, 0, height, -1, 1);
    gl.uniformMatrix4fv(canvasProjectionMatrixID, gl.FALSE, cam.projectionMatrix.m);

    canvasVAO = gl.createVertexArray();
    gl.bindVertexArray(canvasVAO);
    canvasVBO = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, canvasVBO);

    gl.bufferData(gl.ARRAY_BUFFER, 16 * 16, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(canvasPositionID);
    gl.enableVertexAttribArray(canvasUVID);
    gl.vertexAttribPointer(canvasPositionID, 2, gl.FLOAT, gl.FALSE, 16, 0);
    gl.vertexAttribPointer(canvasUVID, 2, gl.FLOAT, gl.FALSE, 16, 8);

    let pix = [
        255, 255, 255, 255,
    ];

    canvasDefaultTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, canvasDefaultTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(pix));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
}

function renderQuad(position, scale, color = new Vector4(1, 1, 1, 1), texture = canvasDefaultTexture){
    gl.useProgram(canvasShader);
    gl.bindVertexArray(canvasVAO);
    gl.disable(gl.CULL_FACE);
    gl.bindBuffer(gl.ARRAY_BUFFER, canvasVBO);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform4fv(canvasColorUID, color.toArray());

    let verts = [
        position.x, position.y, 0, 0, 
        position.x, position.y + scale.y, 0, 1,  
        position.x + scale.x, position.y + scale.y, 1, 1,
        position.x + scale.x, position.y + scale.y, 1, 1,
        position.x + scale.x, position.y, 1, 0,
        position.x, position.y, 0, 0,
    ];

    gl.bindBuffer(gl.ARRAY_BUFFER, canvasVBO);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(verts));
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}