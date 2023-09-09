const postVert = '\
    precision mediump float;\
    attribute vec3 vertices;\
    attribute vec3 normal_in;\
    attribute vec2 texcoord;\
    uniform vec4 a_color;\
    uniform mat3 normMat;\
    uniform mat4 matrix;\
    varying vec4 color;\
    varying vec2 v_texcoord;\
    varying vec3 normal;\
    void main() {\
        color = a_color/255.0;\
        v_texcoord = texcoord;\
        normal = normMat*normal_in;\
        vec4 position = matrix*vec4(vertices, 1.0);\
        gl_Position = position;\
        gl_PointSize = 3.0;\
    }';
    
const postFrag = '\
    precision mediump float;\
    varying vec4 color;\
    varying vec3 normal;\
    varying vec2 v_texcoord;\
    uniform sampler2D u_texture;\
    uniform vec3 lightDir;\
    void main() {\
        vec3 norm = normalize(normal);\
        float light = max(dot(norm, -lightDir), 0.15);\
        vec4 texColor = texture2D(u_texture, v_texcoord);\
        gl_FragColor = vec4(texColor.rgb*light, texColor.a);\
    }';

var postProgram;
var postVertBuffer;
var postNormalBuffer;
var postMatBuffer;

var postColorBuffer;
var postNormal;
var postVerts;
var postMat;
var postColor;
var normMat;
var sunUniform;

var postTex;
var postTexCoord;
var postTexUni;
var postTexCoordBuffer;

function init3D(){
    postProgram = InitializeShader(gl, postVert, postFrag);
    postVertBuffer = gl.createBuffer();
    postNormalBuffer = gl.createBuffer();
    postMatBuffer = gl.createBuffer();
    postNormMatBuffer = gl.createBuffer();
    postColorBuffer = gl.createBuffer();
    postNormal = gl.getAttribLocation(postProgram, "normal_in");
    postVerts = gl.getAttribLocation(postProgram, "vertices");
    postMat = gl.getUniformLocation(postProgram, "matrix");
    postColor = gl.getUniformLocation(postProgram, "a_color");
    postTex = gl.createTexture();
    postTexCoord = gl.getAttribLocation(postProgram, 'texcoord');
    postTexUni = gl.getUniformLocation(postProgram, 'u_texture');
    postTexCoordBuffer = gl.createBuffer();
    normMat = gl.getUniformLocation(postProgram, "normMat");
    sunUniform = gl.getUniformLocation(postProgram, "lightDir");
}



function doPostProcessing(){
    gl.enable(gl.DEPTH_TEST);
    // gl.enable(gl.CULL_FACE);
    gl.depthFunc(gl.LESS);
    gl.useProgram(postProgram);

    gl.enableVertexAttribArray(postNormal);
    gl.enableVertexAttribArray(postVerts);
    gl.enableVertexAttribArray(postTexCoord);

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(postTexUni, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, postTexCoordBuffer);
    gl.vertexAttribPointer(postTexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object.model.texCoords), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, postNormalBuffer);
    gl.vertexAttribPointer(postNormal, 3, gl.FLOAT, false, 0, 0);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object.normals), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, postVertBuffer);
    gl.vertexAttribPointer(postVerts, 3, gl.FLOAT, false, 0, 0);
    gl.bufferData(gl.ARRAY_BUFFER, object.model.vertices, gl.STATIC_DRAW);
    gl.uniform3fv(sunUniform, sunPos);
    gl.uniform4fv(postColor, object.color);
    gl.uniformMatrix3fv(normMat, false, object.normMatrix);
    gl.uniformMatrix4fv(postMat, false, object.matrix);

    gl.drawArrays(object.model.GLPrimitive, 0 , object.model.vertices.length/3);

    gl.disableVertexAttribArray(postNormal);
    gl.disableVertexAttribArray(postVerts);
    gl.disableVertexAttribArray(postTexCoord);
    gl.disable(gl.DEPTH_TEST);
}