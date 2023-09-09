const B_squareVert = 'uniform vec2 squarePos; uniform float squareSize; void main() { gl_Position = vec4(squarePos.x, squarePos.y, 0.0, 1); gl_PointSize = squareSize;}';

const B_squareFrag = 'precision mediump float; uniform vec3 squareColor; void main() { gl_FragColor = vec4(squareColor, 1.0); }';

const B_rectVert = 'attribute vec2 rectPos; void main() { gl_Position = vec4(rectPos.x, rectPos.y, 0.0, 1);}';

const B_rectFrag = 'precision mediump float; uniform vec3 rectColor; void main() { gl_FragColor = vec4(rectColor, 1.0); }';

const B_sinVert = 'uniform float sinSize; uniform float sinTimestamp; uniform float sinWidth; uniform float sinHeight; void main() { float proportion = sinWidth/sinHeight; gl_Position = vec4(-sinSize*cos(sinTimestamp), sinSize*proportion*sin(sinTimestamp), 0.0, 1); gl_PointSize = 8.0;}';

const B_sinFrag = 'precision mediump float; uniform vec3 sinColor; void main() { gl_FragColor = vec4(sinColor, 1.0); }';

var B_squareProgram;
var B_squarePos;
var B_squareColor;
var B_squareSize;

var B_rectProgram;
var B_rectBuffer;
var B_rectVertices;
var B_rectPos;
var B_rectColor;

var B_sinColor;
var B_sinSize;
var B_sinWidth;
var B_sinHeight;

var B_Timestamp;

function InitializeBufferShaders(){
    B_squareProgram = InitializeShader(buffergl, B_squareVert, B_squareFrag);
    B_squarePos = buffergl.getUniformLocation(B_squareProgram, "squarePos");
    B_squareColor = buffergl.getUniformLocation(B_squareProgram, "squareColor");
    B_squareSize = buffergl.getUniformLocation(B_squareProgram, "squareSize");

    B_rectProgram = InitializeShader(buffergl, B_rectVert, B_rectFrag);
    B_rectBuffer = buffergl.createBuffer();
    buffergl.bindBuffer(buffergl.ARRAY_BUFFER, B_rectBuffer);
    B_rectPos = buffergl.getAttribLocation(B_rectProgram, 'rectPos');
    buffergl.enableVertexAttribArray(B_rectPos);
    buffergl.vertexAttribPointer(B_rectPos, 2, buffergl.FLOAT, false, 0, 0);
    B_rectColor = buffergl.getUniformLocation(B_rectProgram, "rectColor");
    
    B_sinProgram = InitializeShader(buffergl, B_sinVert, B_sinFrag);
    B_sinColor = buffergl.getUniformLocation(B_sinProgram, "sinColor");
    B_sinSize = buffergl.getUniformLocation(B_sinProgram, "sinSize");
    B_sinWidth = buffergl.getUniformLocation(B_sinProgram, "sinWidth");
    B_sinHeight = buffergl.getUniformLocation(B_sinProgram, "sinHeight");

    B_sinTimestamp = buffergl.getUniformLocation(B_sinProgram, "sinTimestamp");
}

function B_drawSquare(x,y,r,g,b,s){
    buffergl.useProgram(B_squareProgram);
    buffergl.uniform3fv(B_squareColor, [r/255.0, g/255.0, b/255.0]); //SetColor
    buffergl.uniform2fv(B_squarePos, [2*(x)/bufferImage.width - 1, -2*(y)/bufferImage.height + 1]); //SetPos
    buffergl.uniform1f(B_squareSize, [s]); //SetSize
    buffergl.drawArrays(buffergl.POINT, 0 , 1);
};

function B_drawRect(x,y,w,h,r,g,b){
    buffergl.useProgram(B_rectProgram);
    let B_rectVertices = [
        bX(x), bY(y+h),
        bX(x+w), bY(y+h),
        bX(x), bY(y),
        bX(x+w), bY(y),
    ];
    buffergl.uniform3fv(B_rectColor, [r/255.0, g/255.0, b/255.0]);
    buffergl.bufferData(buffergl.ARRAY_BUFFER, new Float32Array(B_rectVertices), buffergl.DYNAMIC_DRAW);
    buffergl.drawArrays(buffergl.TRIANGLE_STRIP, 0 , 4);
}

function B_drawCRTPixel(x,y,r,g,b){
    let spacing = 0;
    let phosWidth = 1;

    buffergl.useProgram(B_rectProgram);
    let B_rectVertices = [
        bX(x), bY(y+3*phosWidth+spacing),
        bX(x+phosWidth), bY(y+3*phosWidth+spacing),
        bX(x), bY(y),
        bX(x+phosWidth), bY(y),

        bX(x+phosWidth+spacing), bY(y+3*phosWidth+spacing),
        bX(x+2*phosWidth+spacing), bY(y+3*phosWidth+spacing),
        bX(x+phosWidth+spacing), bY(y),
        bX(x+2*phosWidth+spacing), bY(y),

        bX(x+2*phosWidth+2*spacing), bY(y+3*phosWidth+spacing),
        bX(x+3*phosWidth+2*spacing), bY(y+3*phosWidth+spacing),
        bX(x+2*phosWidth+2*spacing), bY(y),
        bX(x+3*phosWidth+2*spacing), bY(y),
    ];
    
    buffergl.bufferData(buffergl.ARRAY_BUFFER, new Float32Array(B_rectVertices), buffergl.DYNAMIC_DRAW);
    buffergl.uniform3fv(B_rectColor, [r/255.0, 0, 0]);
    buffergl.drawArrays(buffergl.TRIANGLE_STRIP, 0 , 4);
    buffergl.uniform3fv(B_rectColor, [0, g/255.0, 0]);
    buffergl.drawArrays(buffergl.TRIANGLE_STRIP, 4 , 4);
    buffergl.uniform3fv(B_rectColor, [0, 0, b/255.0]);
    buffergl.drawArrays(buffergl.TRIANGLE_STRIP, 8 , 4);
}

function bX(x){
    return 2*(x)/bufferImage.width - 1;
}

function bY(y){
    return -2*(y)/bufferImage.height + 1;
}

function InitializeShader(context, vertex, fragment){

    let vertexShader = context.createShader(context.VERTEX_SHADER);
    let fragmentShader = context.createShader(context.FRAGMENT_SHADER);

    context.shaderSource(vertexShader, vertex);
    context.shaderSource(fragmentShader, fragment);

    context.compileShader(vertexShader);
    context.compileShader(fragmentShader);

    var error = false;

    if(!context.getShaderParameter(vertexShader, context.COMPILE_STATUS)) {
        alert("An error occured compiling shaders: " + context.getShaderInfoLog(vertexShader));
        error = true;
    }

    if(!context.getShaderParameter(fragmentShader, context.COMPILE_STATUS)) {
        alert("An error occured compiling shaders: " + context.getShaderInfoLog(fragmentShader));
        error = true;
    }

    program = context.createProgram();

    context.attachShader(program, vertexShader);
    context.attachShader(program, fragmentShader);

    if(context.linkProgram(program) == 0){
        console.log("buffergl.linkProgram(program) failed with error code 0");
        error = true;
    }

    if(error) {
        console.log("Failed to initialize shader.");
        return false;
    }

    console.log("Shader successfully created");

    return program;
}