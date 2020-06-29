class AnimatedTexturedMesh{
    constructor(){
        this.position = new Vector3();
        this.scale = new Vector3(1, 1, 1);
        this.color = new Vector4(1, 1, 1, 1);
        this.orientation = new Quaternion();
        this.totalIndices = 0;
        this.indexOffset = 0;
        this.textureID = 0;
        this.animations = {};
        this.currentAnimation;
    }
};

class Bone{
    constructor(os = new Vector3(), or = new Quaternion()){
        this.offset = os;
        this.orientation = or;
        this.children = [];
    }
};

class Animation{
    constructor(){
        this.poses = [];
        this.invBT = [];
        this.frameDurations = [];
        this.divTime = 0;
        this.currentFrame = 0;
        this.nextFrame = 1;
        this.fps = 24;
        this.currentPoseDuration = 0;
        this.currentPoseTime = 0;
    }
};

var atmShader;
var atmVao;
var atmVbo;
var atmIbo;

var atmPositionID;
var atmNormalID;
var atmWeightsID;
var atmBonesID;
var atmUvID;
var atmBoneMatricesID;

var atmCameraViewMatrixID;
var atmModelViewMatrixID;
var atmLightPositionID;
var atmColorMultID;

var atmIndexBufferSize;
var atmVertexBufferSize;

var atmDefaultTexture = 0;
var atmMatrixIndexCounter = 0;

function initAnimatedTexturedMeshRenderer(){
    let atmVertShader = "#version 300 es\n\
    in vec3 position;\n\
    in vec3 normal;\n\
    in vec3 weights;\n\
    in vec3 bones;\n\
    in vec2 uvCoordinate;\n\
    uniform mat4 cameraViewMatrix;\n\
    uniform mat4 boneMatrices[32];\n\
    out vec3 fragPos;\n\
    out vec3 norm;\n\
    out vec2 uv;\n\
    void main(){\
        vec4 np = vec4(position, 1.0);\
        vec4 nf = vec4(normal, 0.0);\
        vec4 nv = (boneMatrices[int(bones.x)] * np) * weights.x;\
        nv += (boneMatrices[int(bones.y)] * np) * weights.y;\
        nv += (boneMatrices[int(bones.z)] * np) * weights.z;\
        vec4 nn = (boneMatrices[int(bones.x)] * nf) * weights.x;\
        nn += (boneMatrices[int(bones.y)] * nf) * weights.y;\
        nn += (boneMatrices[int(bones.z)] * nf) * weights.z;\
        fragPos = vec3(nv);\
        norm = vec3(nn);\
        uv = uvCoordinate;\
        gl_Position = cameraViewMatrix * vec4(fragPos, 1.0);\
    }";

    let atmFragShader = "#version 300 es\n\
    precision mediump float;\n\
    in vec2 uv;\n\
    in vec3 norm;\n\
    in vec3 fragPos;\n\
    uniform vec3 lightPosition;\n\
    uniform sampler2D tex;\n\
    uniform vec4 colorMult;\n\
    out vec4 finalColor;\n\
    void main(){\
        float ambient = 0.2;\
        vec3 lightDir = normalize(lightPosition - fragPos);\
        float diff = max(dot(norm, lightDir), ambient);\
        vec4 texCol = texture(tex, uv);\
        vec4 finCol = texCol * vec4(diff, diff, diff, 1);\
        finalColor = colorMult * finCol;\
    }";

    atmShader = compileGLShader(gl, atmVertShader, atmFragShader);
    gl.useProgram(atmShader);

    atmPositionID = gl.getAttribLocation(atmShader, "position");
    atmNormalID = gl.getAttribLocation(atmShader, "normal");
    atmWeightsID = gl.getAttribLocation(atmShader, "weights");
    atmBonesID = gl.getAttribLocation(atmShader, "bones");
    atmUvID = gl.getAttribLocation(atmShader, "uvCoordinate");

    atmCameraViewMatrixID = gl.getUniformLocation(atmShader, "cameraViewMatrix");
    atmLightPositionID = gl.getUniformLocation(atmShader, "lightPosition");
    atmBoneMatricesID = gl.getUniformLocation(atmShader, "boneMatrices");
    atmColorMultID = gl.getUniformLocation(atmShader, "colorMult");

    atmVao = gl.createVertexArray();
    gl.bindVertexArray(atmVao);

    atmVertexBufferSize = 0;
    atmIndexBufferSize = 0;

    atmVbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, atmVbo);
    gl.bufferData(gl.ARRAY_BUFFER, 0, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(atmPositionID);
    gl.enableVertexAttribArray(atmNormalID);
    gl.enableVertexAttribArray(atmWeightsID);
    gl.enableVertexAttribArray(atmBonesID);
    gl.enableVertexAttribArray(atmUvID);
    gl.vertexAttribPointer(atmPositionID, 3, gl.FLOAT, gl.FALSE, 56, 0);
    gl.vertexAttribPointer(atmNormalID, 3, gl.FLOAT, gl.FALSE, 56, 12);
    gl.vertexAttribPointer(atmWeightsID, 3, gl.FLOAT, gl.FALSE, 56, 24);
    gl.vertexAttribPointer(atmBonesID, 3, gl.FLOAT, gl.FALSE, 56, 36);
    gl.vertexAttribPointer(atmUvID, 2, gl.FLOAT, gl.FALSE, 56, 48);
    
    atmIbo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, atmIbo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, 0, gl.STATIC_DRAW);

    let pix = [
        100, 100, 100, 255, 200, 200, 200, 255,
        200, 200, 200, 255, 100, 100, 100, 255
    ];

    atmDefaultTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, atmDefaultTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 2, 2, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(pix));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
}

function renderAnimatedTexturedMeshes(meshes, camera, lightPosition, deltaTime){
    gl.useProgram(atmShader);
    gl.bindVertexArray(atmVao);
    gl.uniform3fv(atmLightPositionID, lightPosition.toArray());
    gl.enable(gl.CULL_FACE);

    for(let i = 0; i < meshes.length; i++){
        let mats = [];
        atmMatrixIndexCounter = 0;
        //updateAnimation(meshes[i].currentAnimation, deltaTime);
        let modMat = Matrix4.buildModelMatrix4(meshes[i].position, meshes[i].scale, meshes[i].orientation);
        buildAnimationMatrixArray(meshes[i].currentAnimation, 
                                  modMat, mats, 
                                  meshes[i].currentAnimation.poses[meshes[i].currentAnimation.currentFrame], 
                                  meshes[i].currentAnimation.poses[meshes[i].currentAnimation.nextFrame], 
                                  meshes[i].currentAnimation.divTime);

        let matz = [];
        for(let i = 0; i < mats.length; i++){
            for(let j = 0; j < 16; j++){
                matz.push(mats[i][j]);
            }
        }
        gl.uniformMatrix4fv(atmBoneMatricesID, gl.TRUE, new Float32Array(matz));
        
        let mesh = meshes[i];
        gl.uniform4fv(atmColorMultID, mesh.color.toArray());
        gl.bindTexture(gl.TEXTURE_2D, mesh.textureID);
        gl.uniformMatrix4fv(atmCameraViewMatrixID, gl.FALSE, camera.viewMatrix.m);
        gl.drawElements(gl.TRIANGLES, mesh.totalIndices, gl.UNSIGNED_INT, mesh.indexOffset);
    }
}

function createAnimatedTexturedMesh(vertices, indices, textureId = atmDefaultTexture){
    gl.bindVertexArray(atmVao);
    verticesSize = vertices.length * 4;
    indicesSize = indices.length * 4;
    let nvbo = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, nvbo);
    gl.bufferData(gl.ARRAY_BUFFER, atmVertexBufferSize + verticesSize, gl.STATIC_DRAW);
    gl.bindBuffer(gl.COPY_READ_BUFFER, atmVbo);
    gl.copyBufferSubData(gl.COPY_READ_BUFFER, gl.ARRAY_BUFFER, 0, 0, atmVertexBufferSize);
    gl.bufferSubData(gl.ARRAY_BUFFER, atmVertexBufferSize, new Float32Array(vertices));
    gl.deleteBuffer(atmVbo);
    atmVbo = nvbo;

    let startIndex = atmVertexBufferSize / 56;
    for(let i = 0; i < indices.length; i++){
        indices[i] += startIndex;
    }

    let nibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, nibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indicesSize + atmIndexBufferSize, gl.STATIC_DRAW);
    gl.bindBuffer(gl.COPY_READ_BUFFER, atmIbo);
    gl.copyBufferSubData(gl.COPY_READ_BUFFER, gl.ELEMENT_ARRAY_BUFFER, 0, 0, atmIndexBufferSize);
    gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, atmIndexBufferSize, new Uint32Array(indices));
    gl.deleteBuffer(atmIbo);
    atmIbo = nibo;

    gl.enableVertexAttribArray(atmPositionID);
    gl.enableVertexAttribArray(atmNormalID);
    gl.enableVertexAttribArray(atmWeightsID);
    gl.enableVertexAttribArray(atmBonesID);
    gl.enableVertexAttribArray(atmUvID);
    gl.vertexAttribPointer(atmPositionID, 3, gl.FLOAT, gl.FALSE, 56, 0);
    gl.vertexAttribPointer(atmNormalID, 3, gl.FLOAT, gl.FALSE, 56, 12);
    gl.vertexAttribPointer(atmWeightsID, 3, gl.FLOAT, gl.FALSE, 56, 24);
    gl.vertexAttribPointer(atmBonesID, 3, gl.FLOAT, gl.FALSE, 56, 36);
    gl.vertexAttribPointer(atmUvID, 2, gl.FLOAT, gl.FALSE, 56, 48);

    let atm = new AnimatedTexturedMesh();
    atm.totalIndices = indices.length;
    atm.indexOffset = atmIndexBufferSize;
    atm.textureID = textureId;
    atmVertexBufferSize += verticesSize;
    atmIndexBufferSize += indicesSize;
    
    return atm;
}

function buildAnimationMatrixArray(animation, parent, aniMat, start, end, t){
    let lo = Vector3.linearInterpolate(start.offset, end.offset, t);
    let ro = Quaternion.slerp(start.orientation, end.orientation, t);
    let m2 = Matrix4.buildModelMatrix4(lo, UNIT_SCALE_VECTOR, ro);
    m2 = Matrix4.multiply(parent, m2);
    let m3 = Matrix4.multiply(m2, animation.invBT[atmMatrixIndexCounter++]);
    

    aniMat.push(m3.m);
    for(let i = 0; i < start.children.length; i++){
        buildAnimationMatrixArray(animation, m2, aniMat, start.children[i], end.children[i], t);
    }
}

function updateAnimation(animation, deltaTime){
    animation.currentPoseTime += deltaTime;
        if(animation.currentPoseTime >= animation.currentPoseDuration){ 
            animation.currentPoseTime -= animation.currentPoseDuration;
            animation.currentFrame++;
            animation.nextFrame++;
            if(animation.currentFrame >= animation.poses.length - 1) {
                animation.currentFrame = 0;
                animation.nextFrame = 1;
            }

            animation.currentPoseDuration = animation.frameDurations[animation.currentFrame] / animation.fps;
        }
    animation.divTime = animation.currentPoseTime / animation.currentPoseDuration;
}

function updateAnimations(animations, deltaTime){
    for(let i = 0; i < animations.length; i++){
        updateAnimation(animations[i].currentAnimation, deltaTime);
    }
}

function interpolateMatrices(m1, m2, t){
    let q1 = m1.toQuaternion();
    let q2 = m2.toQuaternion();
    let l1 = new Vector3(m1.m[12], m1.m[13], m1.m[14]);
    let l2 = new Vector3(m2.m[12], m2.m[13], m2.m[14]);

    let qi = Quaternion.slerp(q1, q2, t);
    let li = Vector3.slerp(l1, l2, t);
    return Matrix4.buildModelMatrix4(li, new Vector3(1, 1, 1), qi);
}

function parseBone(bn){
    let loc = new Vector3(bn[0][0], bn[0][1], bn[0][2]);
    let rot = new Quaternion(bn[1][0], bn[1][1], bn[1][2], bn[1][3]);
    let b = new Bone(loc, rot);
    
    for(let i = 0; i < bn[2].length; i++){
        b.children.push(parseBone(bn[2][i]));
    }
    
    return b;
}

function buildAnimation(anim, fps = 24){
    let fAnim = new Animation();
    for(let i = 0; i < anim[0].length; i++){
        fAnim.poses.push(parseBone(anim[0][i]));
    }
    for(let i = 0; i < anim[1].length; i++){
        let m = new Matrix4();
        for(let j = 0; j < 16; j++){
            m.m[j] = anim[1][i][j];
        }
        fAnim.invBT.push(m);
    }
    for(let i = 0; i < anim[2].length; i++){
        fAnim.frameDurations.push(anim[2][i]);
    }
    fAnim.fps = fps;
    fAnim.currentPoseDuration = fAnim.frameDurations[0] / fAnim.fps;
    return fAnim;
}