const squareVert = '\
    uniform vec2 squarePos;\
    uniform float squareSize;\
    void main() {\
        gl_Position = vec4(squarePos.x, squarePos.y, 0.0, 1);\
        gl_PointSize = squareSize;\
    }';

const squareFrag = '\
    precision mediump float;\
    uniform vec3 squareColor;\
    void main() {\
        gl_FragColor = vec4(squareColor, 1.0);\
    }';

const pointVert = '\
    attribute float xPos;\
    attribute float yPos;\
    attribute vec3 pointColor;\
    varying vec3 color;\
    uniform float pointSize;\
    uniform vec2 dim;\
    void main() { \
        color = pointColor/255.0;\
        gl_Position = vec4(2.0*xPos/dim.x - 1.0, 2.0*yPos/dim.y - 1.0, 0.0, 1); \
        gl_PointSize = pointSize;\
    }';

const pointFrag = '\
    precision mediump float;\
    varying vec3 color;\
    void main() {\
        float r = 0.0, delta = 0.0, alpha = 1.0;\
        vec2 cxy = 2.0 * gl_PointCoord - 1.0;\
        r = dot(cxy, cxy);\
        if (r > 1.0) {\
            discard;\
        }\
        gl_FragColor = vec4(color, 1.0);\
    }';

const sinVert = '\
    uniform float sinSize;\
    uniform vec2 center;\
    uniform float sinTimestamp;\
    uniform vec2 sinDim;\
    void main() {\
        float proportion = sinDim.x/sinDim.y;\
        gl_Position = vec4(center.x-sinSize*cos(sinTimestamp), center.y+sinSize*proportion*sin(sinTimestamp), 0.0, 1);\
        gl_PointSize = 2.5;\
    }';

const sinFrag = '\
    precision mediump float;\
    uniform vec3 sinColor;\
    void main() {\
        gl_FragColor = vec4(sinColor, 1.0);\
    }';

var squareProgram;
var squarePos;
var squareColor;
var squareSize;

var pointProgram;
var pointXPos;
var pointYPos;
var pointColor;
var pointColorBuffer;
var pointXPosBuffer;
var pointYPosBuffer;
var pointSize;
var dimensions;

var sinProgram;
var sinColor;
var sinSize;
var sinDim;
var sinPos;

function initPoints(){
    squareProgram = InitializeShader(gl, squareVert, squareFrag);
    squarePos = gl.getUniformLocation(squareProgram, "squarePos");
    squareColor = gl.getUniformLocation(squareProgram, "squareColor");
    squareSize = gl.getUniformLocation(squareProgram, "squareSize");

    pointProgram = InitializeShader(gl, pointVert, pointFrag);
    pointXPos = gl.getAttribLocation(pointProgram, "xPos");
    pointYPos = gl.getAttribLocation(pointProgram, "yPos");
    pointXPosBuffer = gl.createBuffer();
    pointYPosBuffer = gl.createBuffer();
    pointColorBuffer = gl.createBuffer();
    pointColor = gl.getAttribLocation(pointProgram, "pointColor");
    dimensions = gl.getUniformLocation(pointProgram, "dim");
    pointSize = gl.getUniformLocation(pointProgram, "pointSize");

    sinProgram = InitializeShader(gl, sinVert, sinFrag);
    sinColor = gl.getUniformLocation(sinProgram, "sinColor");
    sinSize = gl.getUniformLocation(sinProgram, "sinSize");
    sinPos = gl.getUniformLocation(sinProgram, "center");
    sinDim = gl.getUniformLocation(sinProgram, "sinDim");
    sinTimestamp = gl.getUniformLocation(sinProgram, "sinTimestamp");
}

//draw single square point
function drawSquare(x,y,r,g,b,s){
    gl.useProgram(squareProgram);
    gl.uniform3fv(squareColor, [r/255.0, g/255.0, b/255.0]); //SetColor
    gl.uniform2fv(squarePos, [2*(x)/canvas.width - 1, -2*(y)/canvas.height + 1]); //SetPos
    gl.uniform1f(squareSize, [s]); //SetSize
    gl.drawArrays(gl.POINT, 0 , 1);
}

//recursively draw loading icon using square points
function drawSin(x,y,r,g,b,s,timestamp, tail){

    gl.useProgram(sinProgram);
    gl.uniform3fv(sinColor, [r/255, g/255, b/255]); // SetColor
    gl.uniform1f(sinSize, [s]); //SetSize
    gl.uniform1f(sinTimestamp, [timestamp]); //SetTimestamp
    gl.uniform2fv(sinPos, [X(x),Y(y)]); //SetPosition
    gl.uniform2fv(sinDim, [canvas.width, canvas.height]) //SetDimensions
    gl.drawArrays(gl.POINT, 0 , 1);
    if(tail>0){
        drawSin(x,y,r-0.5,g+0.5,b-0.5,s,timestamp-0.01,tail-1);
    }
};

function drawPoints(points,s){
    gl.useProgram(pointProgram);
    gl.enableVertexAttribArray(pointXPos);
    gl.enableVertexAttribArray(pointYPos);
    gl.enableVertexAttribArray(pointColor);

    gl.bindBuffer(gl.ARRAY_BUFFER, pointXPosBuffer);
    gl.vertexAttribPointer(pointXPos, 1, gl.FLOAT, false, 0, 0);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points.xPos), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, pointYPosBuffer);
    gl.vertexAttribPointer(pointYPos, 1, gl.FLOAT, false, 0, 0);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points.yPos), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, pointColorBuffer);
    gl.vertexAttribPointer(pointColor, 3, gl.FLOAT, false, 0, 0);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points.colors), gl.STATIC_DRAW);

    gl.uniform2fv(dimensions, [canvas.width, canvas.height]); //SetPos
    gl.uniform1f(pointSize, [s]); //SetSize
    gl.drawArrays(gl.POINT, 0 , points.length());

    gl.disableVertexAttribArray(pointXPos);
    gl.disableVertexAttribArray(pointYPos);
    gl.disableVertexAttribArray(pointColor);

}

function drawPoint(x,y,s,r,g,b){
    gl.useProgram(pointProgram);
    gl.enableVertexAttribArray(pointXPos);
    gl.enableVertexAttribArray(pointYPos);
    gl.enableVertexAttribArray(pointColor);

    gl.bindBuffer(gl.ARRAY_BUFFER, pointXPosBuffer);
    gl.vertexAttribPointer(pointXPos, 1, gl.FLOAT, false, 0, 0);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([x]), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, pointYPosBuffer);
    gl.vertexAttribPointer(pointYPos, 1, gl.FLOAT, false, 0, 0);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([y]), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, pointColorBuffer);
    gl.vertexAttribPointer(pointColor, 3, gl.FLOAT, false, 0, 0);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([r,g,b]), gl.STATIC_DRAW);

    gl.uniform2fv(dimensions, [canvas.width, canvas.height]); //SetPos
    gl.uniform1f(pointSize, [s]); //SetSize
    gl.drawArrays(gl.POINT, 0 , 1);

    gl.disableVertexAttribArray(pointXPos);
    gl.disableVertexAttribArray(pointYPos);
    gl.disableVertexAttribArray(pointColor);
}