const CRTRVert = 'attribute vec2 CRTPos; attribute vec2 CRToff; attribute float CRTColor; varying float color; void main() { color = CRTColor/255.0; gl_Position = vec4(CRTPos.x + CRToff.x*1.0, CRTPos.y + CRToff.y*1.0, 0.0, 1.0);}';

const CRTRFrag = 'precision mediump float; varying float color; void main() { gl_FragColor = vec4(color, 0.0, 0.0, 1.0); }';

const CRTGVert = 'attribute vec2 CRTPos; attribute vec2 CRToff; attribute float CRTColor; varying float color; void main() { color = CRTColor/255.0; gl_Position = vec4(CRTPos.x + CRToff.x*1.0, CRTPos.y + CRToff.y*1.0, 0.0, 1.0);}';

const CRTGFrag = 'precision mediump float; varying float color; void main() { gl_FragColor = vec4(0.0, color, 0.0, 1.0); }';

const CRTBVert = 'attribute vec2 CRTPos; attribute vec2 CRToff; attribute float CRTColor; varying float color; void main() { color = CRTColor/255.0; gl_Position = vec4(CRTPos.x + CRToff.x*1.0, CRTPos.y + CRToff.y*1.0, 0.0, 1.0);}';

const CRTBFrag = 'precision mediump float; varying float color; void main() { gl_FragColor = vec4(0.0, 0.0, color, 1.0); }';

const CRTLinesVert = 'attribute vec2 linesPos; void main() { gl_Position = vec4(linesPos.x, linesPos.y, 0.0, 1.0);}';

const CRTLinesFrag = 'precision mediump float; void main() { gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); }';

var CRTRedProgram;
var CRTGreenProgram;
var CRTBlueProgram;
var CRTBuffer;
var CRTColorBuffer;
var CRTRedOffsetBuffer;
var CRTGreenOffsetBuffer;
var CRTBlueOffsetBuffer;
var CRTColor;
var CRTPos;
var CRToff;

var CRTLinesProgram;
var CRTLinesBuffer;
var CRTLinesPos;

var phosphor;
var redPhosphors;
var greenPhosphors;
var bluePhosphors;
var gaps;


function initCRTShaders(){
    CRTRedProgram = InitializeShader(gl, CRTRVert, CRTRFrag);
    CRTGreenProgram = InitializeShader(gl, CRTGVert, CRTGFrag);
    CRTBlueProgram = InitializeShader(gl, CRTBVert, CRTBFrag);
    CRTBuffer = gl.createBuffer();
    CRTColorBuffer = gl.createBuffer();
    CRTRedOffsetBuffer = gl.createBuffer();
    CRTGreenOffsetBuffer = gl.createBuffer();
    CRTBlueOffsetBuffer = gl.createBuffer();
    CRTColor = gl.getAttribLocation(CRTRedProgram, 'CRTColor');
    
    CRTPos = gl.getAttribLocation(CRTRedProgram, 'CRTPos');
    CRToff = gl.getAttribLocation(CRTRedProgram, 'CRToff');

    CRTLinesProgram = InitializeShader(gl, CRTLinesVert, CRTLinesFrag);
    CRTLinesBuffer = gl.createBuffer();
    CRTLinesPos = gl.getAttribLocation(CRTLinesProgram, 'linesPos');
    gl.enableVertexAttribArray(CRTLinesPos);
}

function initPhosphors(w,h){
    
    let spacing = 1;
    let phosWidth = 2;
    let pW = (phosWidth)*3;
    let pH = (phosWidth)*3;
    let bX = canvas.width/2 - pW*w/2;
    let bY = canvas.height/2- pH*h/2;
    phosphor = [];
    redPhosphors = [];
    greenPhosphors = [];
    bluePhosphors = [];
    gaps=[];
    
    phosphor.push(intX(canvas.width/2));
    phosphor.push(intY(canvas.height/2+3*phosWidth));
    phosphor.push(intX(canvas.width/2+phosWidth));
    phosphor.push(intY(canvas.height/2+3*phosWidth));
    phosphor.push(intX(canvas.width/2));
    phosphor.push(intY(canvas.height/2));
    phosphor.push(intX(canvas.width/2+phosWidth));
    phosphor.push(intY(canvas.height/2));

    for(j=0; j<h; j++){
        for(i=0; i<w; i++){
            redPhosphors.push(intX(bX+(i*pW)));
            redPhosphors.push(-intY(bY+(j*pH)+3*phosWidth));
    
            greenPhosphors.push(intX(bX+(i*pW)+phosWidth));
            greenPhosphors.push(-intY(bY+(j*pH)+3*phosWidth));
    
            bluePhosphors.push(intX(bX+(i*pW)+2*phosWidth));
            bluePhosphors.push(-intY(bY+(j*pH)+3*phosWidth));
        }
    }
    let offset = pH/2;
    bX++;
    for(j=0; j<h; j++){
        for(i=0; i<w*3; i++){
            if((Math.floor(i/3))%2==0){
                gaps.push(intX(bX+0.5+(i*phosWidth-spacing))); gaps.push(intY(bY+0.5+j*pH));
                gaps.push(intX(bX+0.5+((i+1)*phosWidth-spacing))); gaps.push(intY(bY+0.5+j*pH));
            } else {
                gaps.push(intX(bX+0.5+(i*phosWidth-spacing))); gaps.push(intY(bY+0.5+offset+j*pH));
                gaps.push(intX(bX+0.5+((i+1)*phosWidth-spacing))); gaps.push(intY(bY+0.5+offset+j*pH));
            }
        }
    }
    phosphor = new Float32Array(phosphor);
    redPhosphors = new Float32Array(redPhosphors);
    greenPhosphors = new Float32Array(greenPhosphors);
    bluePhosphors = new Float32Array(bluePhosphors);
    gaps = new Float32Array(gaps);

    pushPhosphorVertices();
}

function pushPhosphorVertices() {
    gl.bindBuffer(gl.ARRAY_BUFFER, CRTBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, phosphor, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, CRTRedOffsetBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, redPhosphors, gl.STATIC_DRAW);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, CRTGreenOffsetBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, greenPhosphors, gl.STATIC_DRAW);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, CRTBlueOffsetBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, bluePhosphors, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, CRTLinesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, gaps, gl.STATIC_DRAW);
}



function drawCRTImg(pixels, w, h){

    gl.enableVertexAttribArray(CRTColor);
    gl.enableVertexAttribArray(CRTPos);
    gl.enableVertexAttribArray(CRToff);

    gl.useProgram(CRTRedProgram);
    gl.bindBuffer(gl.ARRAY_BUFFER, CRTBuffer);
    gl.vertexAttribPointer(CRTPos, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, CRTRedOffsetBuffer);
    gl.vertexAttribPointer(CRToff, 2, gl.FLOAT, false, 0, 0);
    gl.vertexAttribDivisor(CRToff, 1);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, CRTColorBuffer);
    gl.vertexAttribPointer(CRTColor, 1, gl.UNSIGNED_BYTE, false, 4, 0);
    gl.vertexAttribDivisor(CRTColor, 1);
    gl.bufferData(gl.ARRAY_BUFFER, pixels, gl.STATIC_DRAW);
    gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0 , 4, w*h);

    gl.useProgram(CRTGreenProgram);

    gl.bindBuffer(gl.ARRAY_BUFFER, CRTBuffer);
    gl.vertexAttribPointer(CRTPos, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, CRTGreenOffsetBuffer);
    gl.vertexAttribPointer(CRToff, 2, gl.FLOAT, false, 0, 0);
    gl.vertexAttribDivisor(CRToff, 1);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, CRTColorBuffer);
    gl.vertexAttribPointer(CRTColor, 1, gl.UNSIGNED_BYTE, false, 4, 1);
    gl.vertexAttribDivisor(CRTColor, 1);
    gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0 , 4, w*h);

    gl.useProgram(CRTBlueProgram);

    gl.bindBuffer(gl.ARRAY_BUFFER, CRTBuffer);
    gl.vertexAttribPointer(CRTPos, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, CRTBlueOffsetBuffer);
    gl.vertexAttribPointer(CRToff, 2, gl.FLOAT, false, 0, 0);
    gl.vertexAttribDivisor(CRToff, 1);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, CRTColorBuffer);
    gl.vertexAttribPointer(CRTColor, 1, gl.UNSIGNED_BYTE, false, 4, 2);
    gl.vertexAttribDivisor(CRTColor, 1);
    gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0 , 4, w*h);

    gl.vertexAttribDivisor(CRTColor, 0);
    gl.vertexAttribDivisor(CRToff, 0);
    gl.useProgram(CRTLinesProgram);
    gl.bindBuffer(gl.ARRAY_BUFFER, CRTLinesBuffer);
    gl.vertexAttribPointer(CRTLinesPos, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.LINES, 0 , h*w*2*3);

    gl.disableVertexAttribArray(CRTColor);
    gl.disableVertexAttribArray(CRTPos);
    gl.disableVertexAttribArray(CRToff);
}