const rectVert = '\
    attribute vec2 rectPos;\
    void main() {\
        gl_Position = vec4(rectPos.x, rectPos.y, 0.0, 1);\
    }';

const rectFrag = '\
precision mediump float;\
uniform vec3 rectColor;\
void main() {\
    gl_FragColor = vec4(rectColor, 1.0);\
}';

const GradVert = '\
attribute vec2 GradPos;\
attribute vec4 GradColor;\
varying vec4 color;\
void main() {\
    color = GradColor;\
    gl_Position = vec4(GradPos.x, GradPos.y, 0.0, 1);\
}';

const GradFrag = '\
precision mediump float;\
varying vec4 color;\
void main() {\
    gl_FragColor = color;\
}';

const rectImgVert = '\
attribute vec2 rectPos;\
attribute vec2 texcoord;\
varying vec2 v_texcoord;\
void main() {\
    v_texcoord = texcoord;\
    gl_Position = vec4(rectPos, 0.0, 1);\
}';

const rectImgFrag = '\
precision mediump float;\
varying vec2 v_texcoord;\
uniform sampler2D u_texture;\
void main() {\
   gl_FragColor = texture2D(u_texture, v_texcoord);\
}'
//texture2D(u_texture, v_texcoord)
var rectProgram;
var rectBuffer;
var rectColor;
var rectPos;

var GradProgram;
var GradBuffer;
var GradColorBuffer;
var GradColor;
var GradPos;

var rectImgProgram;
var rectImg;
var rectImgPos;
var rectImgBuffer;
var rectImgCoord;
var rectImgUni;
var rectImgBuffer;
var rectImgCoordBuffer;

function initRectangles(){
    rectProgram = InitializeShader(gl, rectVert, rectFrag);
    rectBuffer = gl.createBuffer();
    rectPos = gl.getAttribLocation(rectProgram, 'rectPos');
    rectColor = gl.getUniformLocation(rectProgram, "rectColor");
    
    GradProgram = InitializeShader(gl, GradVert, GradFrag);
    GradBuffer = gl.createBuffer();
    GradColorBuffer = gl.createBuffer();
    GradColor = gl.getAttribLocation(GradProgram, 'GradColor');
    GradPos = gl.getAttribLocation(GradProgram, 'GradPos');

    rectImgProgram = InitializeShader(gl, rectImgVert, rectImgFrag);
    rectImgBuffer = gl.createBuffer();
    rectImgPos = gl.getAttribLocation(rectImgProgram, 'rectPos');
    rectImg = gl.createTexture();
    rectImgCoord = gl.getAttribLocation(rectImgProgram, 'texcoord');
    rectImgUni = gl.getUniformLocation(rectImgProgram, 'u_texture');
    rectImgCoordBuffer = gl.createBuffer();
    console.log(rectImgPos+", "+rectImgCoord)
    rectImg = [rectImg, 0];
    initTexture(rectImg, "saul.jpg");
}

function drawRect(x,y,w,h,r,g,b){
    gl.useProgram(rectProgram);
    gl.enableVertexAttribArray(rectPos);
    let rectVertices = [
        X(x), Y(y+h),
        X(x+w), Y(y+h),
        X(x), Y(y),
        X(x+w), Y(y),
    ];
    gl.uniform3fv(rectColor, [r/255.0, g/255.0, b/255.0]);
    gl.bindBuffer(gl.ARRAY_BUFFER, rectBuffer);
    gl.vertexAttribPointer(rectPos, 2, gl.FLOAT, false, 0, 0);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(rectVertices), gl.DYNAMIC_DRAW);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0 , 4);

    gl.disableVertexAttribArray(rectPos);
}

function drawGrad(x,y,w,h,c1,c2,c3,c4){
    gl.useProgram(GradProgram);
    gl.enableVertexAttribArray(GradColor);
    gl.enableVertexAttribArray(GradPos);
    let gradVertices = [
        X(x), Y(y+h),
        X(x+w), Y(y+h),
        X(x), Y(y),
        X(x+w), Y(y),
    ];
    let gradColors = [
        c1[0], c1[1], c1[2], c1[3],
        c2[0], c2[1], c2[2], c2[3],
        c3[0], c3[1], c3[2], c3[3],
        c4[0], c4[1], c4[2], c4[3]
    ];
    gl.bindBuffer(gl.ARRAY_BUFFER, GradColorBuffer);
    gl.vertexAttribPointer(GradColor, 4, gl.FLOAT, false, 0, 0);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(gradColors), gl.DYNAMIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, GradBuffer);
    gl.vertexAttribPointer(GradPos, 2, gl.FLOAT, false, 0, 0);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(gradVertices), gl.DYNAMIC_DRAW);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0 , 4);

    gl.disableVertexAttribArray(GradColor);
    gl.disableVertexAttribArray(GradPos);
}

function drawImg(x,y,w,h){
    gl.useProgram(rectImgProgram);
    gl.enableVertexAttribArray(rectImgPos);
    gl.enableVertexAttribArray(rectImgCoord);
    let rectVertices = [
        X(x), Y(y+h),
        X(x+w), Y(y+h),
        X(x), Y(y),
        X(x+w), Y(y),
    ];
    let texcoords = [
        0,1,
        1,1,
        0,0,
        1,0
    ]
    gl.bindTexture(gl.TEXTURE_2D, rectImg);
    gl.uniform1i(rectImgUni, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, rectImgCoordBuffer);
    gl.vertexAttribPointer(rectImgCoord, 2, gl.FLOAT, false, 0, 0);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, rectImgBuffer);
    gl.vertexAttribPointer(rectImgPos, 2, gl.FLOAT, false, 0, 0);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(rectVertices), gl.STATIC_DRAW);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0 , 4);

    gl.disableVertexAttribArray(rectImgPos);
    gl.disableVertexAttribArray(rectImgCoord);
}