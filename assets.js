//Model Container

class Model{
    constructor(verticesAndCoords, SmoothLighting, GLPrimitive, ){
        this.vertices = verticesAndCoords[0];
        this.texCoords = verticesAndCoords[1];
        this.SmoothLighting = SmoothLighting;
        this.GLPrimitive = GLPrimitive;
        this.normals = [];
        let i,j;
        if(this.SmoothLighting){
            for(i=0; i<this.vertices.length/3; i++){
                let p1 = [this.vertices[i*3], this.vertices[i*3+1], this.vertices[i*3+2]];
                let normal = v3.sub([0,0,0], p1);
                normal = v3.unit(normal);
                this.normals.push(normal[0]);
                this.normals.push(normal[1]);
                this.normals.push(normal[2]);
            }
        } else {
            for(i=0; i<this.vertices.length/18; i++){
                let p1 = [this.vertices[i*18], this.vertices[i*18+1], this.vertices[i*18+2]];
                let p2 = [this.vertices[i*18+3], this.vertices[i*18+4], this.vertices[i*18+5]];
                let p3 = [this.vertices[i*18+6], this.vertices[i*18+7], this.vertices[i*18+8]];
                let v1 = v3.sub(p2, p1);
                let v2 = v3.sub(p3, p1);
                let normal = v3.crossProduct(v1, v2);
                normal = v3.unit(normal);
                for(j=0; j<6; j++){
                    this.normals.push(normal[0]);
                    this.normals.push(normal[1]);
                    this.normals.push(normal[2]);
                }   
            }
        }
        console.log(this.normals)
        this.vertices = new Float32Array(this.vertices);
        this.normals = new Float32Array(this.normals);
        this.vertBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);
        this.normBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);
    }
}

//Asset Generation

function generateSphere(delRads){
    let model = [];
    let coords = [];
    for(i=-Math.PI/2; i<Math.PI/2; i+=delRads){
        let ringRadius = Math.cos(i);
        let ringRadius2 = Math.cos(i+delRads);
        let Y = Math.sin(i);
        let Y2 = Math.sin(i+delRads);
        for(j=0; j<(Math.PI*2); j+=delRads){
            let X = Math.cos(j);
            let X2 = Math.cos(j+delRads);
            let Z = Math.sin(j);
            let Z2 = Math.sin(j+delRads);
            model.push(ringRadius*X2); model.push(Y); model.push(ringRadius*Z2);
            model.push(ringRadius*X); model.push(Y); model.push(ringRadius*Z);
            model.push(ringRadius2*X); model.push(Y2); model.push(ringRadius2*Z);

            model.push(ringRadius2*X); model.push(Y2); model.push(ringRadius2*Z);
            model.push(ringRadius2*X2); model.push(Y2); model.push(ringRadius2*Z2);
            model.push(ringRadius*X2); model.push(Y); model.push(ringRadius*Z2);
            
            coords.push(0); coords.push(1);
            coords.push(1); coords.push(1);
            coords.push(1); coords.push(0);
            coords.push(1); coords.push(0);
            coords.push(0); coords.push(0);
            coords.push(0); coords.push(1);


        }
    }
    return [model, coords];
}

//Asset Instances

let sphereModel = new Model(generateSphere(0.1), true, gl.TRIANGLES);
let cubeModel = new Model([[
    1,1,1,
    1,-1,1,
    -1,1,1,

    -1,1,1,
    -1,-1,1,
    1,-1,1,

    -1,-1,1,
    -1,-1,-1,
    -1,1,1,

    -1,-1,-1,
    -1,1,-1,
    -1,1,1,

    -1,-1,-1,
    1,-1,-1,
    1,1,-1,

    -1,-1,-1,
    -1,1,-1,
    1,1,-1,

    1,-1,-1,
    1,-1,1,
    1,1,1,

    1,1,1,
    1,1,-1,
    1,-1,-1,

    1,1,1,
    -1,1,1,
    -1,1,-1,

    1,1,1,
    1,1,-1,
    -1,1,-1,

    -1,-1,-1,

    1,-1,1,
    1,-1,-1,

    1,-1,1,
    -1,-1,-1,
    -1,-1,1,
], [ 
    1,0,//
    1,1,
    0,0,
    0,0,
    0,1,
    1,1,

    0,0,//
    1,0,
    0,1,
    1,0,
    1,1,
    0,1,

    1,0,//
    1,1,
    0,1,
    1,0,
    0,0,
    0,1,

    1,1,//
    0,1,
    0,0,
    0,0,
    1,0,
    1,1,

    1,1,//
    0,1,
    0,0,
    1,1,
    1,0,
    0,0,

    0,0,
    1,1,
    0,1,
    1,1,
    0,0,
    1,0,

]], false, gl.TRIANGLES);

