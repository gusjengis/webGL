class Object {
    constructor(position, scale, rotation, color, model){
        this.pos = position;
        this.scale = scale;
        // this.scale[0] = this.scale[0]/(canvas.width/canvas.height);
        this.rot = rotation;
        this.color = color;

        this.matrix = [];

        this.model = model;

        
        //console.log(this.model.SmoothLighting);
        
        this.updateMatrix();
    }

    setPos(position){
        this.pos = position;
        this.updateMatrix();
    }

    setScale(scale){
        this.scale = scale;
        // this.scale[0] = this.scale[0]/(canvas.width/canvas.height);
        this.updateMatrix();

    }

    setRot(rotation){
        this.rot = rotation;

        this.updateMatrix();

    }

    move(translation){
        this.pos = pos.map(function (num, idx) {
            return num + translation[idx];
        });
        this.updateMatrix();

    }

    setScale(scale){
        this.scale = scale;
        this.updateMatrix();
    }

    updateMatrix(){
        this.matrix = camera.matrix;
        // this.matrix = m4.identity();
        this.matrix = m4.translate(this.matrix, this.pos[0], this.pos[1], this.pos[2]);
        this.matrix = m4.xRotate(this.matrix, this.rot[0]);
        this.matrix = m4.yRotate(this.matrix, this.rot[1]);
        this.matrix = m4.zRotate(this.matrix, this.rot[2]);
        this.matrix = m4.scale(this.matrix, this.scale[0], this.scale[1], this.scale[2]);
        
        this.normMatrix = m4.identity();
        this.normMatrix = m4.yRotate(this.normMatrix, this.rot[1]);
        this.normMatrix = m4.toM3(this.normMatrix); 

        // translation = [
        //     1,0,0,0,
        //     0,1,0,0,
        //     0,0,1,0,
        //     0,0,0,1
        // ];

        // this.matrix = translation;
    }
}

class Objects {
    constructor(model){

        this.vertices = model;
        this.normals = [];
        let i,j;
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
        this.vertices = new Float32Array(this.vertices);
        this.normals = new Float32Array(this.normals);

        this.positions = [];
        this.scales = [];
        this.rotations = [];
        this.matrices = [];
        this.normMatrices = [];
        this.colors = [];

        this.len = 0;
    }

    add(position, scale, rotation, color){
        this.positions.push(position);
        this.scales.push(scale);
        this.rotations.push(rotation);
        this.colors.push(new Float32Array(color));
        this.matrices.push([]);
        this.matrices.push([]);
        this.matrices.push([]);
        this.matrices.push([]);
        this.normMatrices.push([]);
        this.normMatrices.push([]);
        this.normMatrices.push([]);

        this.len++;
        this.updateMatrix(this.len-1);
    }

    setPos(position, index){
        this.positions[index] = position;
        this.updateMatrix(index);
    }

    setScale(scale, index){
        this.scales[index] = scale;
        this.updateMatrix(index);
    }

    setRot(rotation, index){
        this.rotations[index] = rotation;
        this.updateMatrix(index);
    }

    setScale(scale, index){
        this.scale[index] = scale;
        this.updateMatrix(index);
    }

    updateMatrix(index){
        let matrix = camera.matrix;
        // this.matrix = m4.identity();
        matrix = m4.translate(matrix, this.positions[index][0], this.positions[index][1], this.positions[index][2]);
        matrix = m4.xRotate(matrix, this.rotations[index][0]);
        matrix = m4.yRotate(matrix, this.rotations[index][1]);
        matrix = m4.zRotate(matrix, this.rotations[index][2]);
        matrix = m4.scale(matrix, this.scales[index][0], this.scales[index][1], this.scales[index][2]);
        
        let normMatrix = m4.identity();
        normMatrix = m4.yRotate(normMatrix, this.rotations[index][1]);
        normMatrix = m4.toM3(normMatrix); 

        this.matrices[index] = new Float32Array(m4.getColumn(matrix, 0)); 
        this.matrices[index] = new Float32Array(m4.getColumn(matrix, 1)); 
        this.matrices[index] = new Float32Array(m4.getColumn(matrix, 2)); 
        this.matrices[index] = new Float32Array(m4.getColumn(matrix, 3)); 

        this.normMatrices[index] = new Float32Array(m4.getColumnM3(normMatrix, 0)); 
        this.normMatrices[index] = new Float32Array(m4.getColumnM3(normMatrix, 1)); 
        this.normMatrices[index] = new Float32Array(m4.getColumnM3(normMatrix, 2)); 
        // translation = [
        //     1,0,0,0,
        //     0,1,0,0,
        //     0,0,1,0,
        //     0,0,0,1
        // ];

        // this.matrix = translation;
    }
}
class Camera {
    constructor(position, rotation){
        this.pos = position;
        this.rot = rotation;
        this.dir = [];
        this.matrix = [];
        this.target = [0,0,-1];
        this.updateMatrix();
    }

    updateMatrix(){
        this.matrix = m4.identity();
        // this.matrix = m4.translate(this.matrix, this.pos[0], this.pos[1], this.pos[2]);
        this.matrix = m4.multiply(this.matrix, m4.lookAt(this.pos, this.target, [0,1,0]));

        // this.matrix = m4.xRotate(this.matrix, this.rot[0]);
        // this.matrix = m4.yRotate(this.matrix, this.rot[1]);
        // this.matrix = m4.zRotate(this.matrix, this.rot[2]);
        this.matrix = mat4.invert(this.matrix, this.matrix);
        this.matrix = m4.multiply(perspective, this.matrix);
        // console.log(this.matrix)

    }

    lookAt(point){
        let newPoint = [point[0]+this.pos[0], point[1]+this.pos[1], point[2]+this.pos[2]];
        this.dir = (v3.sub(newPoint, this.pos));
        this.dir = v3.unit([this.dir[0], 0, this.dir[2]]);
        this.target = newPoint;
        this.updateMatrix();
    }

    rotateV(rot){
        // this.rot[0] += rot*Math.cos(this.rot[1]);
        // this.rot[2] += rot*-Math.sin(this.rot[1]);

        if(this.rot[0] > Math.PI/2){
            this.rot[0] = Math.PI/2;
        } else if(this.rot[0] < -Math.PI/2){
            this.rot[0] = -Math.PI/2;
        }
        if(this.rot[2] > Math.PI/2){
            this.rot[2] = Math.PI/2;
        } else if(this.rot[2] < -Math.PI/2){
            this.rot[2] = -Math.PI/2;
        }
        this.updateMatrix();
    }

    rotateH(rot){
        this.rot[1] += rot;
        this.updateMatrix();
    }

    moveX(translation){
        this.pos[0] += translation;
        this.updateMatrix();
    }

    moveY(translation){
        this.pos[1] += translation;
        this.updateMatrix();
    }

    moveZ(translation){
        this.pos[2] += translation;
        this.updateMatrix();
    }
}

let camera = new Camera([2.8,1.3,2.801], [0,0,0]);
let spread = 0.5;
let sunPos = [0.8,1.5,0.5];
function randColor(){
    return [Math.random()*255, Math.random()*255, Math.random()*255, 255];
}

// let cubes = new Objects(cubeModel);
// let spheres = new Objects(sphereModel);
// // let cubes = [
//     spheres.add([0,0,0], [0.2,0.1,0.1], [0.0,0.0,0.0],  randColor());

//     spheres.add([0,spread,0], [0.1,0.1,0.1], [0.0,0.0,0.0],  randColor());
//     spheres.add([spread,0,0], [0.1,0.1,0.1], [0.0,0.0,0.0],  randColor());
//     spheres.add([spread,spread,0], [0.1,0.1,0.1], [0.0,0.0,0.0],  randColor());
//     spheres.add([-spread,spread,0], [0.1,0.1,0.1], [0.0,0.0,0.0],  randColor());
//     spheres.add([-spread,-spread,0], [0.1,0.1,0.1], [0.0,0.0,0.0],  randColor());
//     spheres.add([-spread,0,0], [0.1,0.1,0.1], [0.0,0.0,0.0],  randColor());
//     spheres.add([spread,-spread,0], [0.1,0.1,0.1], [0.0,0.0,0.0],  randColor());
//     spheres.add([0,-spread,0], [0.1,0.1,0.1], [0.0,0.0,0.0],  randColor());

//     spheres.add([0,0,-0.5], [0.1,0.1,0.1], [0.0,0.0,0.0],  randColor());
//     spheres.add([0,spread,-0.5], [0.1,0.1,0.1], [0.0,0.0,0.0],  randColor());
//     spheres.add([spread,0,-0.5], [0.1,0.1,0.1], [0.0,0.0,0.0],  randColor());
//     spheres.add([spread,spread,-0.5], [0.1,0.1,0.1], [0.0,0.0,0.0],  randColor());
//     spheres.add([-spread,spread,-0.5], [0.1,0.1,0.1], [0.0,0.0,0.0],  randColor());
//     spheres.add([-spread,-spread,-0.5], [0.1,0.1,0.1], [0.0,0.0,0.0],  randColor());
//     spheres.add([-spread,0,-0.5], [0.1,0.1,0.1], [0.0,0.0,0.0],  randColor());
//     spheres.add([spread,-spread,-0.5], [0.1,0.1,0.1], [0.0,0.0,0.0],  randColor());
//     spheres.add([0,-spread,-0.5], [0.1,0.1,0.1], [0.0,0.0,0.0],  randColor());

//     spheres.add([0,0,0.5], [0.1,0.1,0.1], [0.0,0.0,0.0],  randColor());
//     spheres.add([0,spread,0.5], [0.1,0.1,0.1], [0.0,0.0,0.0],  randColor());
//     spheres.add([spread,0,0.5], [0.1,0.1,0.1], [0.0,0.0,0.0],  randColor());
//     spheres.add([spread,spread,0.5], [0.1,0.1,0.1], [0.0,0.0,0.0],  randColor());
//     spheres.add([-spread,spread,0.5], [0.1,0.1,0.1], [0.0,0.0,0.0],  randColor());
//     spheres.add([-spread,-spread,0.5], [0.1,0.1,0.1], [0.0,0.0,0.0],  randColor());
//     spheres.add([-spread,0,0.5], [0.1,0.1,0.1], [0.0,0.0,0.0],  randColor());
//     spheres.add([spread,-spread,0.5], [0.1,0.1,0.1], [0.0,0.0,0.0],  randColor());
//     spheres.add([0,-spread,0.5], [0.1,0.1,0.1], [0.0,0.0,0.0],  randColor());

// ];

let cubes = [
    new Object([0,0,0], [0.1,0.1,0.1], [0.0,0.0,0.0],  randColor(), sphereModel),

    new Object([0,spread,0], [0.1,0.1,0.1], [0.0,0.0,0.0],  randColor(), sphereModel),
    new Object([spread,0,0], [0.1,0.1,0.1], [0.0,0.0,0.0],  randColor(), sphereModel),
    new Object([spread,spread,0], [0.1,0.1,0.1], [0.0,0.0,0.0],  randColor(), sphereModel),
    new Object([-spread,spread,0], [0.1,0.1,0.1], [0.0,0.0,0.0],  randColor(), sphereModel),
    new Object([-spread,-spread,0], [0.1,0.1,0.1], [0.0,0.0,0.0],  randColor(), sphereModel),
    new Object([-spread,0,0], [0.1,0.1,0.1], [0.0,0.0,0.0],  randColor(), sphereModel),
    new Object([spread,-spread,0], [0.1,0.1,0.1], [0.0,0.0,0.0],  randColor(), sphereModel),
    new Object([0,-spread,0], [0.1,0.1,0.1], [0.0,0.0,0.0],  randColor(), sphereModel),

    new Object([0,0,-0.5], [0.1,0.1,0.1], [0.0,0.0,0.0],  randColor(), sphereModel),
    new Object([0,spread,-0.5], [0.1,0.1,0.1], [0.0,0.0,0.0],  randColor(), sphereModel),
    new Object([spread,0,-0.5], [0.1,0.1,0.1], [0.0,0.0,0.0],  randColor(), sphereModel),
    new Object([spread,spread,-0.5], [0.1,0.1,0.1], [0.0,0.0,0.0],  randColor(), sphereModel),
    new Object([-spread,spread,-0.5], [0.1,0.1,0.1], [0.0,0.0,0.0],  randColor(), sphereModel),
    new Object([-spread,-spread,-0.5], [0.1,0.1,0.1], [0.0,0.0,0.0],  randColor(), sphereModel),
    new Object([-spread,0,-0.5], [0.1,0.1,0.1], [0.0,0.0,0.0],  randColor(), sphereModel),
    new Object([spread,-spread,-0.5], [0.1,0.1,0.1], [0.0,0.0,0.0],  randColor(), sphereModel),
    new Object([0,-spread,-0.5], [0.1,0.1,0.1], [0.0,0.0,0.0],  randColor(), sphereModel),

    new Object([0,0,0.5], [0.1,0.1,0.1], [0.0,0.0,0.0],  randColor(), sphereModel),
    new Object([0,spread,0.5], [0.1,0.1,0.1], [0.0,0.0,0.0],  randColor(), sphereModel),
    new Object([spread,0,0.5], [0.1,0.1,0.1], [0.0,0.0,0.0],  randColor(), sphereModel),
    new Object([spread,spread,0.5], [0.1,0.1,0.1], [0.0,0.0,0.0],  randColor(), sphereModel),
    new Object([-spread,spread,0.5], [0.1,0.1,0.1], [0.0,0.0,0.0],  randColor(), sphereModel),
    new Object([-spread,-spread,0.5], [0.1,0.1,0.1], [0.0,0.0,0.0],  randColor(), sphereModel),
    new Object([-spread,0,0.5], [0.1,0.1,0.1], [0.0,0.0,0.0],  randColor(), sphereModel),
    new Object([spread,-spread,0.5], [0.1,0.1,0.1], [0.0,0.0,0.0],  randColor(), sphereModel),
    new Object([0,-spread,0.5], [0.1,0.1,0.1], [0.0,0.0,0.0],  randColor(), sphereModel),
];
let sun = new Object(sunPos, [0.1,0.1,0.1], [0.0,0.0,0.0],  [255,255,255,255], cubeModel);

let floor = new Object([0,-5.9,0], [5,5,5], [0,0,0], [66, 16, 43, 255], cubeModel);

console.log(sphereModel)