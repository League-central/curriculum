class Vector2 {
    constructor(x = 0, y = 0){
        this.x = x;
        this.y = y;
    }

    static add(v1, v2){
        return new Vector2(v1.x + v2.x, v1.y + v2.y);
    }

    static sub(v1, v2){
        return new Vector2(v1.x - v2.x, v1.y - v2.y);
    }

    static scale(v, amt){
        return new Vector3(v.x * amt, v.y * amt);
    }

    static length(v){
        return Math.sqrt(v.x * v.x + v.y * v.y);
    }

    length(){
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    add(v1){
        this.x += v1.x;
        this.y += v1.y;
    }

    normalize(){
        let l = this.length();
        if(l != 0){
            this.x /= l;
            this.y /= l;
        }else{
            this.x = 0;
            this.y = 0;
        }
    }

    scale(v){
        this.x *= v;
        this.y *= v;
    }

    toArray(){
        return [this.x, this.y];
    }
}

class Vector3 {
    constructor(x = 0, y = 0, z = 0){
        this.x = x;
        this.y = y;
        this.z = z;
    }

    static add(v1, v2){
        return new Vector3(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
    }

    static sub(v1, v2){
        return new Vector3(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
    }

    static mul(v1, v2){
        return new Vector3(v1.x * v2.x, v1.y * v2.y, v1.z * v2.z);
    }

    static div(v1, v2){
        return new Vector3(v1.x / v2.x, v1.y / v2.y, v1.z / v2.z);
    }

    static scale(v, amt){
        return new Vector3(v.x * amt, v.y * amt, v.z * amt);
    }

    static cross(v1, v2){
       return new Vector3((v1.y * v2.z) - (v1.z * v2.y), 
                          (v1.z * v2.x) - (v1.x * v2.z),
                          (v1.x * v2.y) - (v1.y * v2.x));
    }

    static dot(v1, v2){
        return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
    }

    static length(v){
        return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    }

    static normal(v){
        let l = Vector3.length(v);
        if(l != 0){
            return new Vector3(v.x / l, v.y / l, v.z / l);
        }else{
            return new Vector3(0, 0, 0);
        }
    }

    static copy(v){
        return new Vector3(v.x, v.y, v.z);
    }

    static negative(v){
        return new Vector3(-v.x, -v.y, -v.z);
    }

    static slerp(v1, v2, t){
        let dot = Vector3.dot(v1, v2);
        if(dot > 0.9995){
            let rs = Vector3.add(v1, Vector3.scale(Vector3.sub(v2, v1), t));
            rs.normalize();
            return rs;
        }

        if(dot < -1) dot = -1;
        else if(dot > 1) dot = 1;

        let theta = Math.acos(dot) * t;
        let v3 = Vector3.sub(v2, Vector3.scale(v1, dot));
        v3.normalize();
        return Vector3.add(Vector3.scale(v1, Math.cos(theta)), Vector3.scale(v3, Math.sin(theta)));
    }

    static linearInterpolate(v1, v2, t){
		return new Vector3(v1.x + (v2.x - v1.x) * t, v1.y + (v2.y - v1.y) * t, v1.z + (v2.z - v1.z) * t);
    }

    add(v){
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
    }

    sub(v){
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
    }

    div(v){
        this.x /= v.x;
        this.y /= v.y;
        this.z /= v.z;
    }

    length(){
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    normalize(){
        let l = this.length();
        if(l != 0){
            this.x /= l;
            this.y /= l;
            this.z /= l;
        }else{
            this.x = 0;
            this.y = 0;
            this.z = 0;
        }
    }

    scale(v){
        this.x *= v;
        this.y *= v;
        this.z *= v;
    }

    toArray(){
        return [this.x, this.y, this.z];
    }
}

class Vector4 {
    constructor(x = 0, y = 0, z = 0, w = 0){
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    static add(v1, v2, vres){
        vres.x = v1.x + v2.x;
        vres.y = v1.y + v2.y;
        vres.z = v1.z + v2.z;
        vres.w = v2.w + v2.w;
    }

    static dot(v1, v2){
        return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z + v1.w * v2.w;
    }

    length(){
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    }

    normalize(){
        let l = this.length();
        if(l != 0){
            this.x /= l;
            this.y /= l;
            this.z /= l;
            this.w /= l;
        }else{
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.w = 0;
        }
    }

    scale(v){
        this.x *= v;
        this.y *= v;
        this.z *= v;
        this.w *= v;
    }

    toArray(){
        return [this.x, this.y, this.z, this.w];
    }
}

class Quaternion {
    constructor(x = 0, y = 0, z = 0, w = 1){
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    static rotationToQuaternion(axis, angle){
        let hang = angle * 0.5;
        let sinHang = Math.sin(hang);
        let q = new Quaternion(axis.x * sinHang, axis.y * sinHang, axis.z * sinHang, Math.cos(hang));
        q.normalize();
        return q;
    }

    static copy(q){
        return new Quaternion(q.x, q.y, q.z, q.w);
    }

    static inverse(q){
        let den = q.w * q.w + q.x * q.x + q.y * q.y + q.z * q.z;
        if(den != 0){
            return new Quaternion(-q.x / den, -q.y / den, -q.z / den, q.w / den)
        }else{
            return new Quaternion(0, 0, 0, 0);
        }
    }

    static slerp(q1, q2, t){
        let dot = Quaternion.dot(q1, q2);

        if(dot > 0.9995){
            let rs = Quaternion.add(q1, Quaternion.scale(Quaternion.sub(q2, q1), t));
            rs.normalize();
            return rs;
        }

        if(dot < -1) dot = -1;
        else if(dot > 1) dot = 1;
        
        if(dot < 0){
            q1.rotate(new Vector3(1, 1, 1), 2 * Math.PI);
        }

        let theta0 = Math.acos(dot);
        let theta = theta0 * t;

        let q3 = Quaternion.sub(q2, Quaternion.scale(q1, dot));
        q3.normalize();

        let qf = Quaternion.add(Quaternion.scale(q1, Math.cos(theta)), Quaternion.scale(q3, Math.sin(theta)));

        return qf;         
    }

    static dot(q1, q2){
        return q1.x * q2.x + q1.y * q2.y + q1.z * q2.z + q1.w * q2.w;
    }

    static scale(q, s){
        return new Quaternion(q.x * s, q.y * s, q.z * s, q.w * s)
    }

    static add(q1, q2){
        return new Quaternion(q1.x + q2.x, q1.y + q2.y, q1.z + q2.z, q1.w + q2.w)
    }

    static sub(q1, q2){
        return new Quaternion(q1.x - q2.x, q1.y - q2.y, q1.z - q2.z, q1.w - q2.w)
    }

    static multiply(q1, q2){
        let q = new Quaternion(q1.x, q1.y, q1.z, q1.w);
        q.multiply(q2);
        return q;
    }

    length(){
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    }

    normalize(){
        let l = this.length();
        if(l != 0){
            this.x /= l;
            this.y /= l;
            this.z /= l;
            this.w /= l;
        }else{
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.w = 0;
        }
    }

    multiply(q2){
        let x =   this.x * q2.w + this.y * q2.z - this.z * q2.y + this.w * q2.x;
        let y =  -this.x * q2.z + this.y * q2.w + this.z * q2.x + this.w * q2.y;
        let z =   this.x * q2.y - this.y * q2.x + this.z * q2.w + this.w * q2.z;
        let w =  -this.x * q2.x - this.y * q2.y - this.z * q2.z + this.w * q2.w;
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    toMatrix4(){
        this.normalize();
        let m = new Matrix4();
        m.m[0] = (1 - (2 * (this.y * this.y)) - (2 * (this.z * this.z)));
        m.m[1] = ((2 * this.x * this.y) + (2 * this.z * this.w));
        m.m[2] = ((2 * this.x * this.z) - (2 * this.y * this.w));
        m.m[3] = 0;
        m.m[4] = ((2 * this.x * this.y) - (2 * this.z * this.w));
        m.m[5] = (1 - (2 * this.x * this.x) - (2 * (this.z *  this.z)));
        m.m[6] = (2 * (this.y * this.z) + 2 * (this.x * this.w));
        m.m[7] = 0;
        m.m[8] = ((2 * this.x * this.z) + (2 * this.y * this.w));
        m.m[9] = ((2 * this.y  * this.z) - (2 * this.x * this.w));
        m.m[10] = (1 - (2 * this.x * this.x) - (2 * (this.y  *  this.y)));
        m.m[11] = 0; m.m[12] = 0; m.m[13] = 0; m.m[14] = 0; m.m[15] = 1;
        return m;
    }

    rotate(angle, degrees){
        let q = Quaternion.rotationToQuaternion(angle, degrees);
        this.multiply(q);
    }
}

class Matrix4 {
    constructor(v = 1){
        this.m = [
            v, 0, 0, 0,
            0, v, 0, 0,
            0, 0, v, 0,
            0, 0, 0, v,
        ];
    }

    static multiply(m1, m2){
        let mres = new Matrix4();
        mres.m[0] =  ((m1.m[0] * m2.m[0]) +  (m1.m[4] * m2.m[1]) +  (m1.m[8] *  m2.m[2]) +  (m1.m[12] * m2.m[3]));
        mres.m[1] =  ((m1.m[1] * m2.m[0]) +  (m1.m[5] * m2.m[1]) +  (m1.m[9] *  m2.m[2]) +  (m1.m[13] * m2.m[3]));
        mres.m[2] =  ((m1.m[2] * m2.m[0]) +  (m1.m[6] * m2.m[1]) +  (m1.m[10] * m2.m[2]) +  (m1.m[14] * m2.m[3]));
        mres.m[3] =  ((m1.m[3] * m2.m[0]) +  (m1.m[7] * m2.m[1]) +  (m1.m[11] * m2.m[2]) +  (m1.m[15] * m2.m[3]));
        mres.m[4] =  ((m1.m[0] * m2.m[4]) +  (m1.m[4] * m2.m[5]) +  (m1.m[8] *  m2.m[6]) +  (m1.m[12] * m2.m[7]));
        mres.m[5] =  ((m1.m[1] * m2.m[4]) +  (m1.m[5] * m2.m[5]) +  (m1.m[9] *  m2.m[6]) +  (m1.m[13] * m2.m[7]));
        mres.m[6] =  ((m1.m[2] * m2.m[4]) +  (m1.m[6] * m2.m[5]) +  (m1.m[10] * m2.m[6]) +  (m1.m[14] * m2.m[7]));
        mres.m[7] =  ((m1.m[3] * m2.m[4]) +  (m1.m[7] * m2.m[5]) +  (m1.m[11] * m2.m[6]) +  (m1.m[15] * m2.m[7]));
        mres.m[8] =  ((m1.m[0] * m2.m[8]) +  (m1.m[4] * m2.m[9]) +  (m1.m[8] *  m2.m[10]) + (m1.m[12] * m2.m[11]));
        mres.m[9] =  ((m1.m[1] * m2.m[8]) +  (m1.m[5] * m2.m[9]) +  (m1.m[9] *  m2.m[10]) + (m1.m[13] * m2.m[11]));
        mres.m[10] = ((m1.m[2] * m2.m[8]) +  (m1.m[6] * m2.m[9]) +  (m1.m[10] * m2.m[10]) + (m1.m[14] * m2.m[11])); 
        mres.m[11] = ((m1.m[3] * m2.m[8]) +  (m1.m[7] * m2.m[9]) +  (m1.m[11] * m2.m[10]) + (m1.m[15] * m2.m[11])); 
        mres.m[12] = ((m1.m[0] * m2.m[12]) + (m1.m[4] * m2.m[13]) + (m1.m[8] *  m2.m[14]) + (m1.m[12] * m2.m[15])); 
        mres.m[13] = ((m1.m[1] * m2.m[12]) + (m1.m[5] * m2.m[13]) + (m1.m[9] *  m2.m[14]) + (m1.m[13] * m2.m[15])); 
        mres.m[14] = ((m1.m[2] * m2.m[12]) + (m1.m[6] * m2.m[13]) + (m1.m[10] * m2.m[14]) + (m1.m[14] * m2.m[15])); 
        mres.m[15] = ((m1.m[3] * m2.m[12]) + (m1.m[7] * m2.m[13]) + (m1.m[11] * m2.m[14]) + (m1.m[15] * m2.m[15])); 
        return mres;
    }

    static buildModelMatrix4(position, scale, orientation){
        let m = orientation.toMatrix4();
        let m2 = new Matrix4(1);
        m2.translate(position);
        m2.scale(scale);
        
        return Matrix4.multiply(m2, m);
    }

    static fromArray(arr){
        if(arr.length > 15){
            let m = new Matrix4();
            m.setMatrixArray(arr);
            return m;
        }
    }

    setIdentity(){
        for(let i = 0; i < 16; i++){
            if(i % 5 != 0){
                this.m[i] = 0;
            }else{
                this.m[i] = 1;
            }
        }
    }

    setMatrixArray(arr){
        for(let i = 0; i < 16; i++){
            this.m[i] = arr[i];
        }
    }

    scale(v){
        this.m[0] *= v.x;
        this.m[5] *= v.y;
        this.m[10] *= v.z;
    }

    translate(v){
        this.m[12] += v.x;
        this.m[13] += v.y;
        this.m[14] += v.z;
    }

    getUpVector(v){
        v.x = this.m[1];
        v.y = this.m[5];
        v.z = this.m[9];
    }

    getRightVector(v){
        v.x = this.m[0];
        v.y = this.m[4];
        v.z = this.m[8];
    }

    getForwardVector(v){
        v.x = -this.m[2];
        v.y = -this.m[6];
        v.z = -this.m[10];
    }

    toQuaternion(){
        let ww = Math.sqrt(1 + this.m[0] + this.m[5] + this.m[10]) / 2;
        let xx = (this.m[6] - this.m[9]) / (4 * ww);
        let yy = (this.m[8] - this.m[2]) / (4 * ww);
        let zz = (this.m[1] - this.m[4]) / (4 * ww);
        return new Quaternion(xx, yy, zz, ww);
    }
}

class Camera {
    constructor(){
        this.projectionMatrix = new Matrix4();
        this.viewMatrix = new Matrix4();
        this.orientation = new Quaternion();
        this.position = new Vector3();
        this.forward = new Vector3(0, 0, 1);
        this.up = new Vector3(0, 1, 0);
        this.right = new Vector3(1, 0, 0);
        
        this.moveForward = false;
        this.moveBack = false;
        this.moveLeft = false;
        this.moveRight = false;
        this.moveUp = false;
        this.moveDown = false;
        this.pitchUp = false;
        this.pitchDown = false;
        this.rollLeft = false;
        this.rollRight = false;
        this.yawLeft = false;
        this.yawRight = false;

        this.moveSpeed = 1;
        this.rotateSpeed = 1;
        this.mouseSensitivity = 0.5;
    }

    setOrthographicProjection(left, right, bottom, top, near, far){
        this.projectionMatrix.m = [
            (2 / (right - left)), 0, 0, 0,
            0, (2 / (top - bottom)), 0, 0,
            0, 0, (-2/(far - near)), 0, 
            -(right + left) / (right - left),
            -(top + bottom) / (top - bottom),
            -(far + near) / (far - near), 1
        ];
    }

    setPerspectiveProjection(fov, aspect, near, far){
        let tfovdiv2 = Math.tan(fov / 2);
        this.projectionMatrix.m[0] = (1 / (aspect * tfovdiv2));
        this.projectionMatrix.m[1] = 0;
        this.projectionMatrix.m[2] = 0;
        this.projectionMatrix.m[3] = 0;
        this.projectionMatrix.m[4] = 0;
        this.projectionMatrix.m[5] = (1 / (tfovdiv2));
        this.projectionMatrix.m[6] = 0;
        this.projectionMatrix.m[7] = 0;
        this.projectionMatrix.m[8] = 0;
        this.projectionMatrix.m[9] = 0;
        this.projectionMatrix.m[10] = -((far + near) / (far - near));
        this.projectionMatrix.m[11] = -1;
        this.projectionMatrix.m[12] = 0;
        this.projectionMatrix.m[13] = 0;
        this.projectionMatrix.m[14] = -((2 * far * near) / (far - near));
        this.projectionMatrix.m[15] = 0;
    }

    updateView(delta){
        this.viewMatrix.setIdentity();
        this.viewMatrix.translate(new Vector3(-this.position.x, -this.position.y, -this.position.z));
        this.viewMatrix = Matrix4.multiply(this.orientation.toMatrix4(), this.viewMatrix);
        this.viewMatrix.getForwardVector(this.forward);
        this.viewMatrix.getUpVector(this.up);
        this.viewMatrix.getRightVector(this.right);
        this.viewMatrix = Matrix4.multiply(this.projectionMatrix, this.viewMatrix);
        this.forward.normalize();
        this.up.normalize();
        this.right.normalize();
    }

    lookAt(center, target, up){
        let fwd = Vector3.sub(target, center);
        fwd.normalize();
        up.normalize();
        let right = Vector3.cross(fwd, up);
        right.normalize();
        up = Vector3.cross(right, fwd);
        up.normalize();

        let x = -Vector3.dot(right, center);
        let y = -Vector3.dot(up, center);
        let z = Vector3.dot(fwd, center);

        this.viewMatrix.m = [
            right.x, up.x, -fwd.x, 0,
            right.y, up.y, -fwd.y, 0,
            right.z, up.z, -fwd.z, 0,
            x, y, z, 1
        ];
        
        this.position = new Vector3(x, -z, -y);
        this.viewMatrix.getForwardVector(this.forward);
        this.viewMatrix.getUpVector(this.up);
        this.viewMatrix.getRightVector(this.right);
        this.viewMatrix = Matrix4.multiply(this.projectionMatrix, this.viewMatrix);
    }
}

class DirectionalLight {
    constructor(dir = new Vector3(-1, -1, -1), col = new Vector3(1, 1, 1), amb = new Vector3(0.2, 0.2, 0.2)){
        this.direction = dir;
        this.color = col;
        this.ambient = amb;
    }

    toArray(){
        return [
            this.direction.x, this.direction.y, this.direction.z, 
            this.color.x, this.color.y, this.color.z, 
            this.ambient.x, this.ambient.y, this.ambient.z
        ];
    }
}

class PointLight {
    constructor(p, a, d, s){
        this.postion = p;
        this.ambient = a;
        this.diffuse = d;
        this.specular = s;
    }
}

function compileGLShader(gl, vsCode, fsCode){
    let vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, vsCode);
    gl.compileShader(vertShader);
    var compiled = gl.getShaderParameter(vertShader, gl.COMPILE_STATUS);
    if(!compiled){
        console.log(gl.getShaderInfoLog(vertShader));
    }
    let fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, fsCode); 
    gl.compileShader(fragShader);
    compiled = gl.getShaderParameter(fragShader, gl.COMPILE_STATUS);
    if(!compiled){
        console.log(gl.getShaderInfoLog(fragShader));
    }
    let shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertShader);
    gl.attachShader(shaderProgram, fragShader);
    gl.linkProgram(shaderProgram);
    return shaderProgram;
}

function generateGLTexture2D(pixelData, width, height, filterType = "nearest"){
    let tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(pixelData));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    setGLTextureFilterType(tex, filterType);
    return tex;
}

function setGLTextureFilterType(texture, type){
    gl.bindTexture(gl.TEXTURE_2D, texture);
    switch(type){
        case "linear":{
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            break;
        }
        case "nearest":{
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            break;
        }
    }
}

function getSurfaceNormal(v1, v2, v3){
    let va = Vector3.sub(v2, v1);
    let vb = Vector3.sub(v3, v1);
    let vc = Vector3.cross(vb, va);
    vc.normalize();
    return vc;
}

function generateUnitCubeVerticesIndexedWithNormals(verts, inds){
    verts.push(-0.5); verts.push(-0.5); verts.push(-0.5);
    verts.push(0); verts.push(0); verts.push(-1);
    verts.push(-0.5); verts.push(0.5); verts.push(-0.5);
    verts.push(0); verts.push(0); verts.push(-1);
    verts.push(0.5); verts.push(0.5); verts.push(-0.5);
    verts.push(0); verts.push(0); verts.push(-1);
    verts.push(0.5); verts.push(-0.5); verts.push(-0.5);
    verts.push(0); verts.push(0); verts.push(-1);

    verts.push(0.5); verts.push(-0.5); verts.push(0.5);
    verts.push(0); verts.push(0); verts.push(1);
    verts.push(0.5); verts.push(0.5); verts.push(0.5);
    verts.push(0); verts.push(0); verts.push(1);
    verts.push(-0.5); verts.push(0.5); verts.push(0.5);
    verts.push(0); verts.push(0); verts.push(1);
    verts.push(-0.5); verts.push(-0.5); verts.push(0.5);
    verts.push(0); verts.push(0); verts.push(1);

    verts.push(-0.5); verts.push(-0.5); verts.push(0.5);
    verts.push(-1); verts.push(0); verts.push(0);
    verts.push(-0.5); verts.push(0.5); verts.push(0.5);
    verts.push(-1); verts.push(0); verts.push(0);
    verts.push(-0.5); verts.push(0.5); verts.push(-0.5);
    verts.push(-1); verts.push(0); verts.push(0);
    verts.push(-0.5); verts.push(-0.5); verts.push(-0.5);
    verts.push(-1); verts.push(0); verts.push(0);
    
    verts.push(0.5); verts.push(-0.5); verts.push(-0.5);
    verts.push(1); verts.push(0); verts.push(0);
    verts.push(0.5); verts.push(0.5); verts.push(-0.5);
    verts.push(1); verts.push(0); verts.push(0);
    verts.push(0.5); verts.push(0.5); verts.push(0.5);
    verts.push(1); verts.push(0); verts.push(0);
    verts.push(0.5); verts.push(-0.5); verts.push(0.5);
    verts.push(1); verts.push(0); verts.push(0);

    verts.push(-0.5); verts.push(0.5); verts.push(-0.5);
    verts.push(0); verts.push(1); verts.push(0);
    verts.push(-0.5); verts.push(0.5); verts.push(0.5);
    verts.push(0); verts.push(1); verts.push(0);
    verts.push(0.5); verts.push(0.5); verts.push(0.5);
    verts.push(0); verts.push(1); verts.push(0);
    verts.push(0.5); verts.push(0.5); verts.push(-0.5);
    verts.push(0); verts.push(1); verts.push(0);

    verts.push(-0.5); verts.push(-0.5); verts.push(0.5);
    verts.push(0); verts.push(-1); verts.push(0);
    verts.push(-0.5); verts.push(-0.5); verts.push(-0.5);
    verts.push(0); verts.push(-1); verts.push(0);
    verts.push(0.5); verts.push(-0.5); verts.push(-0.5);
    verts.push(0); verts.push(-1); verts.push(0);
    verts.push(0.5); verts.push(-0.5); verts.push(0.5);
    verts.push(0); verts.push(-1); verts.push(0);

    inds.push(0); inds.push(1); inds.push(2); inds.push(2); inds.push(3); inds.push(0);
    inds.push(4); inds.push(5); inds.push(6); inds.push(6); inds.push(7); inds.push(4);
    inds.push(8); inds.push(9); inds.push(10); inds.push(10); inds.push(11); inds.push(8);
    inds.push(12); inds.push(13); inds.push(14); inds.push(14); inds.push(15); inds.push(12);
    inds.push(16); inds.push(17); inds.push(18); inds.push(18); inds.push(19); inds.push(16);
    inds.push(20); inds.push(21); inds.push(22); inds.push(22); inds.push(23); inds.push(20);
}

function generateUnitCubeVerticesIndexedWithNormalsTexCoords(verts, inds){
    verts.push(-0.5); verts.push(-0.5); verts.push(-0.5);
    verts.push(0); verts.push(0); verts.push(-1);
    verts.push(0); verts.push(1);
    verts.push(-0.5); verts.push(0.5); verts.push(-0.5);
    verts.push(0); verts.push(0); verts.push(-1);
    verts.push(0); verts.push(0);
    verts.push(0.5); verts.push(0.5); verts.push(-0.5);
    verts.push(0); verts.push(0); verts.push(-1);
    verts.push(1); verts.push(0);
    verts.push(0.5); verts.push(-0.5); verts.push(-0.5);
    verts.push(0); verts.push(0); verts.push(-1);
    verts.push(1); verts.push(1);

    verts.push(0.5); verts.push(-0.5); verts.push(0.5);
    verts.push(0); verts.push(0); verts.push(1);
    verts.push(0); verts.push(1);
    verts.push(0.5); verts.push(0.5); verts.push(0.5);
    verts.push(0); verts.push(0); verts.push(1);
    verts.push(0); verts.push(0);
    verts.push(-0.5); verts.push(0.5); verts.push(0.5);
    verts.push(0); verts.push(0); verts.push(1);
    verts.push(1); verts.push(0);
    verts.push(-0.5); verts.push(-0.5); verts.push(0.5);
    verts.push(0); verts.push(0); verts.push(1);
    verts.push(1); verts.push(1);

    verts.push(-0.5); verts.push(-0.5); verts.push(0.5);
    verts.push(-1); verts.push(0); verts.push(0);
    verts.push(0); verts.push(1);
    verts.push(-0.5); verts.push(0.5); verts.push(0.5);
    verts.push(-1); verts.push(0); verts.push(0);
    verts.push(0); verts.push(0);
    verts.push(-0.5); verts.push(0.5); verts.push(-0.5);
    verts.push(-1); verts.push(0); verts.push(0);
    verts.push(1); verts.push(0);
    verts.push(-0.5); verts.push(-0.5); verts.push(-0.5);
    verts.push(-1); verts.push(0); verts.push(0);
    verts.push(1); verts.push(1);
    
    verts.push(0.5); verts.push(-0.5); verts.push(-0.5);
    verts.push(1); verts.push(0); verts.push(0);
    verts.push(0); verts.push(1);
    verts.push(0.5); verts.push(0.5); verts.push(-0.5);
    verts.push(1); verts.push(0); verts.push(0);
    verts.push(0); verts.push(0);
    verts.push(0.5); verts.push(0.5); verts.push(0.5);
    verts.push(1); verts.push(0); verts.push(0);
    verts.push(1); verts.push(0);
    verts.push(0.5); verts.push(-0.5); verts.push(0.5);
    verts.push(1); verts.push(0); verts.push(0);
    verts.push(1); verts.push(1);

    verts.push(-0.5); verts.push(0.5); verts.push(-0.5);
    verts.push(0); verts.push(1); verts.push(0);
    verts.push(0); verts.push(1);
    verts.push(-0.5); verts.push(0.5); verts.push(0.5);
    verts.push(0); verts.push(1); verts.push(0);
    verts.push(0); verts.push(0);
    verts.push(0.5); verts.push(0.5); verts.push(0.5);
    verts.push(0); verts.push(1); verts.push(0);
    verts.push(1); verts.push(0);
    verts.push(0.5); verts.push(0.5); verts.push(-0.5);
    verts.push(0); verts.push(1); verts.push(0);
    verts.push(1); verts.push(1);

    verts.push(-0.5); verts.push(-0.5); verts.push(0.5);
    verts.push(0); verts.push(-1); verts.push(0);
    verts.push(0); verts.push(1);
    verts.push(-0.5); verts.push(-0.5); verts.push(-0.5);
    verts.push(0); verts.push(-1); verts.push(0);
    verts.push(0); verts.push(0);
    verts.push(0.5); verts.push(-0.5); verts.push(-0.5);
    verts.push(0); verts.push(-1); verts.push(0);
    verts.push(1); verts.push(0);
    verts.push(0.5); verts.push(-0.5); verts.push(0.5);
    verts.push(0); verts.push(-1); verts.push(0);
    verts.push(1); verts.push(1);

    inds.push(0); inds.push(1); inds.push(2); inds.push(2); inds.push(3); inds.push(0);
    inds.push(4); inds.push(5); inds.push(6); inds.push(6); inds.push(7); inds.push(4);
    inds.push(8); inds.push(9); inds.push(10); inds.push(10); inds.push(11); inds.push(8);
    inds.push(12); inds.push(13); inds.push(14); inds.push(14); inds.push(15); inds.push(12);
    inds.push(16); inds.push(17); inds.push(18); inds.push(18); inds.push(19); inds.push(16);
    inds.push(20); inds.push(21); inds.push(22); inds.push(22); inds.push(23); inds.push(20);
}

function generateIcoSphereVerticesIndexedWithNormals(verts, inds, divisions = 0){
    if(divisions > 5){
        divisions = 5;
    }
    
    let vtxs = [];
    let r = (1 + Math.sqrt(5)) / 2;
    vtxs.push(new Vector3(0, 1, r));  
    vtxs.push(new Vector3(0, -1, r)); 
    vtxs.push(new Vector3(0, 1, -r)); 
    vtxs.push(new Vector3(0, -1, -r));
    vtxs.push(new Vector3(1, r, 0));  
    vtxs.push(new Vector3(-1, r, 0)); 
    vtxs.push(new Vector3(1, -r, 0)); 
    vtxs.push(new Vector3(-1,-r, 0)); 
    vtxs.push(new Vector3(r, 0, 1));  
    vtxs.push(new Vector3(r, 0, -1)); 
    vtxs.push(new Vector3(-r, 0, 1)); 
    vtxs.push(new Vector3(-r, 0, -1));
    for(let i = 0; i < 12; i++){
        vtxs[i].normalize();
        vtxs[i].div(new Vector3(2, 2, 2));
        addVertex(verts, vtxs[i]);
    }

    function addVertex(vs, vtx){
        if(typeof addVertex.counter == 'undefined') {
            addVertex.counter = 0;
        }
        vs.push(vtx.x); vs.push(vtx.y); vs.push(vtx.z);
        let n = Vector3.normal(vtx);
        vs.push(n.x); vs.push(n.y); vs.push(n.z);
        return addVertex.counter++;
    }

    function addTri(vs, is, v1, v2, v3, div){
        if(div > 0){
            let v2Denom = new Vector3(2, 2, 2);
            let va = vtxs[v1];
            let vb = vtxs[v2];
            let vc = vtxs[v3];
            let vab = Vector3.div(Vector3.add(vb, va), v2Denom);
            let vbc = Vector3.div(Vector3.add(vb, vc), v2Denom);
            let vca = Vector3.div(Vector3.add(va, vc), v2Denom);
            vab.normalize(); vab.div(v2Denom);
            vbc.normalize(); vbc.div(v2Denom);
            vca.normalize(); vca.div(v2Denom);
            vtxs.push(vab);
            vtxs.push(vbc);
            vtxs.push(vca);
            let n1 = addVertex(vs, vab);
            let n2 = addVertex(vs, vbc);
            let n3 = addVertex(vs, vca);
            addTri(vs, is, n1, v2, n2, div - 1);
            addTri(vs, is, n2, v3, n3, div - 1);
            addTri(vs, is, n3, v1, n1, div - 1);
            addTri(vs, is, n1, n2, n3, div - 1);
        }else{
            is.push(v1); is.push(v2); is.push(v3);
        }
    }

    addTri(verts, inds, 4, 0, 8, divisions);
    addTri(verts, inds, 8, 0, 1, divisions);
    addTri(verts, inds, 1, 0, 10, divisions);
    addTri(verts, inds, 10, 0, 5, divisions);
    addTri(verts, inds, 5, 0, 4, divisions);
    addTri(verts, inds, 3, 6, 7, divisions);
    addTri(verts, inds, 3, 7, 11, divisions);
    addTri(verts, inds, 2, 3, 11, divisions);
    addTri(verts, inds, 3, 2, 9, divisions);
    addTri(verts, inds, 6, 3, 9, divisions);
    addTri(verts, inds, 4, 8, 9, divisions);
    addTri(verts, inds, 2, 4, 9, divisions);
    addTri(verts, inds, 4, 2, 5, divisions);
    addTri(verts, inds, 5, 2, 11, divisions);
    addTri(verts, inds, 10, 5, 11, divisions);
    addTri(verts, inds, 7, 10, 11, divisions);
    addTri(verts, inds, 10, 7, 1, divisions);
    addTri(verts, inds, 1, 7, 6, divisions);
    addTri(verts, inds, 8, 1, 6, divisions);
    addTri(verts, inds, 9, 8, 6, divisions);
}

function generateIcoSphereVerticesIndexedWithNormalsTexCoords(verts, inds, divisions = 0){
    if(divisions > 5){
        divisions = 5;
    }
    
    let vtxs = [];
    let r = (1 + Math.sqrt(5)) / 2;
    vtxs.push(new Vector3(0, 1, r));  
    vtxs.push(new Vector3(0, -1, r)); 
    vtxs.push(new Vector3(0, 1, -r)); 
    vtxs.push(new Vector3(0, -1, -r));
    vtxs.push(new Vector3(1, r, 0));  
    vtxs.push(new Vector3(-1, r, 0)); 
    vtxs.push(new Vector3(1, -r, 0)); 
    vtxs.push(new Vector3(-1,-r, 0)); 
    vtxs.push(new Vector3(r, 0, 1));  
    vtxs.push(new Vector3(r, 0, -1)); 
    vtxs.push(new Vector3(-r, 0, 1)); 
    vtxs.push(new Vector3(-r, 0, -1));
    for(let i = 0; i < 12; i++){
        vtxs[i].normalize();
        vtxs[i].div(new Vector3(2, 2, 2));
        addVertex(verts, vtxs[i]);
    }

    function addVertex(vs, vtx){
        if(typeof addVertex.counter == 'undefined') {
            addVertex.counter = 0;
        }
        vs.push(vtx.x); vs.push(vtx.y); vs.push(vtx.z);
        let n = Vector3.normal(vtx);
        vs.push(n.x); vs.push(n.y); vs.push(n.z);
        vs.push(0); vs.push(0);
        return addVertex.counter++;
    }

    function addTri(vs, is, v1, v2, v3, div){
        if(div > 0){
            let v2Denom = new Vector3(2, 2, 2);
            let va = vtxs[v1];
            let vb = vtxs[v2];
            let vc = vtxs[v3];
            let vab = Vector3.div(Vector3.add(vb, va), v2Denom);
            let vbc = Vector3.div(Vector3.add(vb, vc), v2Denom);
            let vca = Vector3.div(Vector3.add(va, vc), v2Denom);
            vab.normalize(); vab.div(v2Denom);
            vbc.normalize(); vbc.div(v2Denom);
            vca.normalize(); vca.div(v2Denom);
            vtxs.push(vab);
            vtxs.push(vbc);
            vtxs.push(vca);
            let n1 = addVertex(vs, vab);
            let n2 = addVertex(vs, vbc);
            let n3 = addVertex(vs, vca);
            addTri(vs, is, n1, v2, n2, div - 1);
            addTri(vs, is, n2, v3, n3, div - 1);
            addTri(vs, is, n3, v1, n1, div - 1);
            addTri(vs, is, n1, n2, n3, div - 1);
        }else{
            is.push(v1); is.push(v2); is.push(v3);
        }
    }

    addTri(verts, inds, 4, 0, 8, divisions);
    addTri(verts, inds, 8, 0, 1, divisions);
    addTri(verts, inds, 1, 0, 10, divisions);
    addTri(verts, inds, 10, 0, 5, divisions);
    addTri(verts, inds, 5, 0, 4, divisions);
    addTri(verts, inds, 3, 6, 7, divisions);
    addTri(verts, inds, 3, 7, 11, divisions);
    addTri(verts, inds, 2, 3, 11, divisions);
    addTri(verts, inds, 3, 2, 9, divisions);
    addTri(verts, inds, 6, 3, 9, divisions);
    addTri(verts, inds, 4, 8, 9, divisions);
    addTri(verts, inds, 2, 4, 9, divisions);
    addTri(verts, inds, 4, 2, 5, divisions);
    addTri(verts, inds, 5, 2, 11, divisions);
    addTri(verts, inds, 10, 5, 11, divisions);
    addTri(verts, inds, 7, 10, 11, divisions);
    addTri(verts, inds, 10, 7, 1, divisions);
    addTri(verts, inds, 1, 7, 6, divisions);
    addTri(verts, inds, 8, 1, 6, divisions);
    addTri(verts, inds, 9, 8, 6, divisions);
}

function generateUnitCylinderIndexedWithNormalsTexCoords(verts, inds, divisions = 16){
    if(divisions < 3) divisions = 3;
    function addVertex(v, n, t){
        if(typeof addVertex.counter == 'undefined'){
            addVertex.counter = 0;
        }
        verts.push(v.x); verts.push(v.y); verts.push(v.z);
        verts.push(n.x); verts.push(n.y); verts.push(n.z);
        verts.push(t.x); verts.push(t.y);
        return addVertex.counter++;
    }

    function addTri(v1, v2, v3){
        inds.push(v1); inds.push(v2); inds.push(v3);
    }
    let v1 = new Vector3(0, 0.5, 0);
    let norm = new Vector3(0, 1, 0);
    let tex = new Vector2(0.5, 0.5);
    let cen = addVertex(v1, norm, tex);

    let incAmt = 1.0 / divisions;
    let texY = 1.0;
    let ang = 0;   
    let addAmt = (Math.PI * 2) / divisions;
    let xpos = Math.sin(ang);
    let ypos = Math.cos(ang);
    v1 = new Vector3(xpos / 2, 0.5, ypos / 2);
    tex = new Vector2((xpos + 1) / 2, (ypos + 1) / 2);
    addVertex(v1, norm, tex);
    ang += addAmt;
    let lastVertex = 0;
    for(let i = 1; i < divisions; i++){
        xpos = Math.sin(ang);
        let ypos = Math.cos(ang);
        v1 = new Vector3(xpos / 2, 0.5, ypos / 2);
        tex = new Vector2((xpos + 1) / 2, (ypos + 1) / 2);
        lastVertex = addVertex(v1, norm, tex);
        ang += addAmt;
        addTri(cen, cen + i, cen + i + 1);
    }
    addTri(cen, lastVertex, cen + 1);

    v1 = new Vector3(0, -0.5, 0);
    norm = new Vector3(0, -1, 0);
    tex = new Vector2(0.5, 0.5);
    cen = addVertex(v1, norm, tex);
    ang = 0;   
    addAmt = (Math.PI * 2) / divisions;
    xpos = Math.sin(ang);
    ypos = Math.cos(ang);
    v1 = new Vector3(xpos / 2, -0.5, ypos / 2);
    tex = new Vector2((xpos + 1) / 2, (ypos + 1) / 2);
    addVertex(v1, norm, tex);
    ang -= addAmt;
    for(let i = 1; i < divisions; i++){
        xpos = Math.sin(ang);
        let ypos = Math.cos(ang);
        v1 = new Vector3(xpos / 2, -0.5, ypos / 2);
        tex = new Vector2((xpos + 1) / 2, (ypos + 1) / 2);
        lastVertex = addVertex(v1, norm, tex);
        ang -= addAmt;
        addTri(cen, cen + i, cen + i + 1);
    }
    addTri(cen, lastVertex, cen + 1);
    ang = 0;
    xpos = Math.sin(ang);
    ypos = Math.cos(ang);
    v1 = new Vector3(xpos / 2, 0.5, ypos / 2);
    let v2 = new Vector3(xpos / 2, -0.5, ypos / 2);
    tex = new Vector2(0, texY);
    norm = new Vector3(xpos, 0, ypos);
    norm.normalize();
    cen = addVertex(v1, norm, tex);
    tex = new Vector2(1, texY);
    addVertex(v2, norm, tex);
    ang += addAmt;
    texY -= incAmt;
    for(let i = 0; i < divisions; i++){
        xpos = Math.sin(ang);
        ypos = Math.cos(ang);
        v1 = new Vector3(xpos / 2, 0.5, ypos / 2);
        v2 = new Vector3(xpos / 2, -0.5, ypos / 2);
        tex = new Vector2(0, texY);
        norm = new Vector3(xpos, 0, ypos);
        norm.normalize();
        let nc = addVertex(v1, norm, tex);
        tex = new Vector2(1, texY);
        addVertex(v2, norm, tex);
        ang += addAmt;
        texY -= incAmt;
        addTri(cen, cen + 1, cen + 2);
        addTri(cen + 1, cen + 3, cen + 2);
        cen = nc;
    }
}

function generateUnitPlaneIndexedWithNormalsTexCoords(verts, inds){
    verts.push(-0.5); verts.push(0); verts.push(-0.5);
    verts.push(0.0); verts.push(1.0); verts.push(0.0);
    verts.push(0); verts.push(1);

    verts.push(-0.5); verts.push(0.0); verts.push(0.5);
    verts.push(0.0); verts.push(1.0); verts.push(0.0);
    verts.push(0); verts.push(0);

    verts.push(0.5); verts.push(0.0); verts.push(0.5);
    verts.push(0.0); verts.push(1.0); verts.push(0.0);
    verts.push(1); verts.push(0);

    verts.push(0.5); verts.push(0); verts.push(-0.5);
    verts.push(0.0); verts.push(1.0); verts.push(0.0);
    verts.push(1); verts.push(1);

    inds.push(0); inds.push(1); inds.push(2); inds.push(2); inds.push(3); inds.push(0);
}

function generateUVSphereIndexedWithNormalsTexCoords(verts, inds, divisions = 16){
    if(divisions < 4) divisions = 4;
    let indCt = 0;
    function addTri(v1, v2, v3, t1, t2, t3){
        let n = getSurfaceNormal(v1, v2, v3);
        verts.push(v1.x); verts.push(v1.y); verts.push(v1.z);
        verts.push(n.x); verts.push(n.y); verts.push(n.z);
        verts.push(t1.x); verts.push(t1.y);
        verts.push(v2.x); verts.push(v2.y); verts.push(v2.z);
        verts.push(n.x); verts.push(n.y); verts.push(n.z);
        verts.push(t2.x); verts.push(t2.y);
        verts.push(v3.x); verts.push(v3.y); verts.push(v3.z);
        verts.push(n.x); verts.push(n.y); verts.push(n.z);
        verts.push(t3.x); verts.push(t3.y);
        inds.push(indCt++); inds.push(indCt++); inds.push(indCt++);
    }

    let theta = 0;
    let phi = 0;
    let incAmt = (Math.PI * 2.0) / divisions;
    let tInc = 1.0 / divisions;
    let htPtr = 0;
    let vtPtr = 0;

    for(let j = 0; j < divisions; j++){    
        for(let i = 0; i < divisions / 2; i++){
            let v1 = new Vector3(Math.sin(theta) * Math.cos(phi) * 0.5, Math.cos(theta)  * 0.5, Math.sin(theta) * Math.sin(phi) * 0.5);
            let v2 = new Vector3(Math.sin(theta) * Math.cos(phi + incAmt) * 0.5, Math.cos(theta) * 0.5, Math.sin(theta) * Math.sin(phi + incAmt) * 0.5);
            let v3 = new Vector3(Math.sin(theta + incAmt) * Math.cos(phi) * 0.5, Math.cos(theta + incAmt) * 0.5, Math.sin(theta + incAmt) * Math.sin(phi) * 0.5);
            let v4 = new Vector3(Math.sin(theta + incAmt) * Math.cos(phi + incAmt) * 0.5, Math.cos(theta + incAmt) * 0.5, Math.sin(theta + incAmt) * Math.sin(phi + incAmt) * 0.5);
            
            let t1 = new Vector2(htPtr, vtPtr);
            let t2 = new Vector2(htPtr + tInc, vtPtr);
            let t3 = new Vector2(htPtr, vtPtr + tInc * 2);
            let t4 = new Vector2(htPtr + tInc, vtPtr + tInc * 2);

            if(i == 0){
                t1.x += tInc * 0.5;
                addTri(v1, v4, v3, t1, t4, t3);
            }else if(i == (divisions / 2) - 1){
                t3.x += tInc * 0.5;
                addTri(v1, v2, v3, t1, t2, t3);
            }else{
                addTri(v1, v2, v3, t1, t2, t3);
                addTri(v3, v2, v4, t3, t2, t4);
            }
            theta += incAmt;
            vtPtr += tInc * 2;   
        }
        theta = 0;
        vtPtr = 0;
        phi += incAmt;
        htPtr += tInc;
    }
}

function generateBoneVerticesWithNormals(verts, inds){
    function addFace(p1, p2, p3){
        norm = getSurfaceNormal(p1, p2, p3);
        verts.push(p1.x); verts.push(p1.y); verts.push(p1.z);
        verts.push(norm.x); verts.push(norm.y); verts.push(norm.z);
        verts.push(p2.x); verts.push(p2.y); verts.push(p2.z);
        verts.push(norm.x); verts.push(norm.y); verts.push(norm.z);
        verts.push(p3.x); verts.push(p3.y); verts.push(p3.z);
        verts.push(norm.x); verts.push(norm.y); verts.push(norm.z);
    }

    let topPoint = new Vector3(0, 1, 0);
    let bottomPoint = new Vector3(0, 0, 0);
    addFace(new Vector3(-0.25, 0.25,  0.25), topPoint, new Vector3( 0.25, 0.25,  0.25));
    addFace(new Vector3( 0.25,  0.25, 0.25), topPoint, new Vector3( 0.25, 0.25, -0.25));
    addFace(new Vector3( 0.25,  0.25,-0.25), topPoint, new Vector3(-0.25, 0.25,   -0.25));
    addFace(new Vector3(-0.25, 0.25, -0.25), topPoint, new Vector3(-0.25, 0.25,    0.25));

    addFace(new Vector3(-0.25, 0.25,  0.25), new Vector3(  0.25,   0.25,  0.25), bottomPoint);
    addFace(new Vector3( 0.25,  0.25,  0.25), new Vector3(  0.25,   0.25, -0.25), bottomPoint);
    addFace(new Vector3( 0.25,  0.25, -0.25), new Vector3(-0.25, 0.25, -0.25), bottomPoint);
    addFace(new Vector3(-0.25, 0.25, -0.25), new Vector3(-0.25, 0.25,  0.25), bottomPoint);

    for(let i = 0; i < verts.length / 6; i++){
        inds.push(i);
    }
}

const IDENTITY_MATRIX = new Matrix4();
const UNIT_SCALE_VECTOR = new Vector3(1, 1, 1);