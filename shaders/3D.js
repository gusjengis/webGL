const objVert = '\
    precision mediump float;\
    attribute vec3 vertices;\
    attribute vec3 normal_in;\
    uniform vec4 a_color;\
    uniform mat3 normMat;\
    uniform mat4 matrix;\
    varying vec4 color;\
    varying vec3 normal;\
    void main() {\
        color = a_color/255.0;\
        normal = normMat*normal_in;\
        vec4 position = matrix*vec4(vertices, 1.0);\
        gl_Position = position;\
        gl_PointSize = 3.0;\
    }';
    //attribute vec2 texcoord;\//varying vec2 v_texcoord;\//v_texcoord = texcoord;\
const objFrag = '\
    precision mediump float;\
    varying vec4 color;\
    varying vec3 normal;\
    uniform vec3 lightDir;\
    void main() {\
        vec3 norm = normalize(normal);\
        float light = max(dot(norm, -lightDir), 0.15);\
        vec4 texColor = color;\
        vec4 tempFragColor = vec4(texColor.rgb*light, texColor.a);\
        float luminance = floor((tempFragColor.r + tempFragColor.g + tempFragColor.b)/3.0 + 0.5);\
        gl_FragColor = vec4(tempFragColor.rgb, tempFragColor.a);\
    }'
        //varying vec2 v_texcoord;\
    //uniform sampler2D u_texture;\
    //texture2D(u_texture, v_texcoord);\
    // gl_FragColor = vec4(color.rgb*light, 1.0);\
// const objsVert = '\
//     precision mediump float;\
//     attribute vec3 vertices;\
//     attribute vec3 normal_in;\
//     uniform vec4 a_color;\
//     uniform mat3 normMat;\
//     uniform mat4 matrix;\
//     varying vec4 color;\
//     varying vec3 normal;\
//     varying vec3 verts;\
//     void main() {\
//         color = a_color/255.0;\
//         normal = normMat*normal_in;\
//         vec4 position = matrix*vec4(vertices, 1.0);\
//         gl_Position = position;\
//         verts = position.xyz; \
//         gl_PointSize = 3.0;\
//     }';
    
// const objsFrag = '\
//     precision mediump float;\
//     varying vec4 color;\
//     varying vec3 normal;\
//     varying vec3 verts;\
//     uniform vec3 lightDir;\
//     void main() {\
//         vec3 norm = normalize(normal);\
//         float dist = length(verts-lightDir);\
//         float light = max(dot(norm, -lightDir), 0.15)/(pow(dist, 2.0));\
//         gl_FragColor = vec4(color.rgb*light, 1.0);\
//     }';

var objProgram;
var objVertBuffer;
var objNormalBuffer;
var objMatBuffer;

var objColorBuffer;
var objNormal;
var objVerts;
var objMat;
var objColor;
var normMat;
var sunUniform;

var objTex;
var objTexCoord;
var objTexUni;
var objTexCoordBuffer;
// var dirtTex;

function init3D(){
    objProgram = InitializeShader(gl, objVert, objFrag);
    objVertBuffer = gl.createBuffer();
    objNormalBuffer = gl.createBuffer();
    objMatBuffer = gl.createBuffer();
    objNormMatBuffer = gl.createBuffer();
    objColorBuffer = gl.createBuffer();
    objNormal = gl.getAttribLocation(objProgram, "normal_in");
    objVerts = gl.getAttribLocation(objProgram, "vertices");
    objMat = gl.getUniformLocation(objProgram, "matrix");
    objColor = gl.getUniformLocation(objProgram, "a_color");
    objTex = gl.createTexture();
    // objTexCoord = gl.getAttribLocation(objProgram, 'texcoord');
    // objTexUni = gl.getUniformLocation(objProgram, 'u_texture');
    objTexCoordBuffer = gl.createBuffer();
    normMat = gl.getUniformLocation(objProgram, "normMat");
    sunUniform = gl.getUniformLocation(objProgram, "lightDir");
    // dirtTex = [dirtTex, 1];
    // initTexture(dirtTex, "dirt.png");
}

function drawObject(object, texture){
    gl.enable(gl.DEPTH_TEST);
    // gl.enable(gl.CULL_FACE);
    gl.depthFunc(gl.LESS);
    gl.useProgram(objProgram);

    gl.enableVertexAttribArray(objNormal);
    gl.enableVertexAttribArray(objVerts);
    // gl.enableVertexAttribArray(objTexCoord);

    // gl.bindTexture(gl.TEXTURE_2D, texture[0]);
    // gl.uniform1i(objTexUni, texture[1]);

    // gl.bindBuffer(gl.ARRAY_BUFFER, objTexCoordBuffer);
    // gl.vertexAttribPointer(objTexCoord, 2, gl.FLOAT, false, 0, 0);
    // gl.bufferData(gl.ARRAY_BUFFER, new Flomat32Array(object.model.texCoords), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, object.model.normBuffer);
    gl.vertexAttribPointer(objNormal, 3, gl.FLOAT, false, 0, 0);
    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object.model.normals), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, object.model.vertBuffer);
    gl.vertexAttribPointer(objVerts, 3, gl.FLOAT, false, 0, 0);
    // gl.bufferData(gl.ARRAY_BUFFER, object.model.vertices, gl.STATIC_DRAW);
    gl.uniform3fv(sunUniform, sunPos);
    gl.uniform4fv(objColor, object.color);
    gl.uniformMatrix3fv(normMat, false, object.normMatrix);
    gl.uniformMatrix4fv(objMat, false, object.matrix);

    gl.drawArrays(object.model.GLPrimitive, 0 , object.model.vertices.length/3);

    gl.disableVertexAttribArray(objNormal);
    gl.disableVertexAttribArray(objVerts);
    // gl.disableVertexAttribArray(objTexCoord);
    gl.disable(gl.DEPTH_TEST);
}

function drawObjects(objects, texture){
    gl.enable(gl.DEPTH_TEST);
    // gl.enable(gl.CULL_FACE);
    gl.depthFunc(gl.LESS);
    gl.useProgram(objProgram);

    gl.enableVertexAttribArray(objNormal);
    gl.enableVertexAttribArray(objVerts);
    gl.enableVertexAttribArray(objColor);
    gl.enableVertexAttribArray(objMat);
    gl.enableVertexAttribArray(normMat);
    gl.enableVertexAttribArray(objTexCoord);

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(objTexUni, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, objTexCoordBuffer);
    gl.vertexAttribPointer(objTexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(objects.texcoords), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, objNormalBuffer);
    gl.vertexAttribPointer(objNormal, 3, gl.FLOAT, false, 0, 0);
    gl.bufferData(gl.ARRAY_BUFFER, objects.normals, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, objVertBuffer);
    gl.vertexAttribPointer(objVerts, 3, gl.FLOAT, false, 0, 0);
    gl.bufferData(gl.ARRAY_BUFFER, objects.vertices, gl.STATIC_DRAW);
    gl.uniform3fv(sunUniform, v3.unit(sunPos));

    gl.bindBuffer(gl.ARRAY_BUFFER, objColorBuffer);
    gl.vertexAttribPointer(objColor, 1, gl.FLOAT, false, 0, 0);
    gl.vertexAttribDivisor(objColor, 1);
    gl.bufferData(gl.ARRAY_BUFFER, objects.colors, gl.STATIC_DRAW);

    for(m=0; m<4; m++){
        gl.bindBuffer(gl.ARRAY_BUFFER, objMatBuffer);
        gl.vertexAttribPointer(+m, 1, gl.FLOAT, false, 0, 4*4*m);
        gl.vertexAttribDivisor(+m, 1);
        gl.bufferData(gl.ARRAY_BUFFER, objects.matrices, gl.STATIC_DRAW);
    }
    
    for(m=0; m<3; m++){
        gl.bindBuffer(gl.ARRAY_BUFFER, objNormMatBuffer);
        gl.vertexAttribPointer(normMat+m, 1, gl.FLOAT, false, 0, 3*4*m);
        gl.vertexAttribDivisor(normMat+m, 1);
        gl.bufferData(gl.ARRAY_BUFFER, objects.normMatrices, gl.STATIC_DRAW); 
    }
    
    gl.drawArraysInstanced(gl.POINT, 0 , objects.vertices.length/3, objects.len);

    gl.vertexAttribDivisor(objColor, 0);
    gl.vertexAttribDivisor(objMat, 0);
    gl.vertexAttribDivisor(objMat+1, 0);
    gl.vertexAttribDivisor(objMat+2, 0);
    gl.vertexAttribDivisor(objMat+3, 0);
    gl.vertexAttribDivisor(normMat, 1);
    gl.vertexAttribDivisor(normMat+1, 1);
    gl.vertexAttribDivisor(normMat+2, 1);

    gl.disableVertexAttribArray(objNormal);
    gl.disableVertexAttribArray(objVerts);
    gl.disableVertexAttribArray(objColor);
    gl.disableVertexAttribArray(objMat);
    gl.disableVertexAttribArray(normMat);
    gl.disableVertexAttribArray(objTexCoord);
    gl.disable(gl.DEPTH_TEST);
}