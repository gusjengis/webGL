document.body.style.zoom= 1/window.devicePixelRatio;


var pixels;

// import {floor} from "./objects.js";

if (gl === null) {
    alert("Unable to initialize WebGL. Your browser or machine may not support it.");
}

function canvasOnLoad(){
    canvasResize();
    clear();
    InitializeShaders();
    updateBD();
    initPhosphors(bW,bH);
    drawFrame();
}

function getShader(filePath){
    let shader = document.createElement("script");
    shader.type = "GLSL";
    shader.src = filePath;
    console.log(shader);
    return shader.innerHTML;
    
}

function canvasResize(){//
    document.body.style.zoom=1/window.devicePixelRatio;
    canvas.width = window.devicePixelRatio*document.documentElement.clientWidth;
    canvas.height = window.devicePixelRatio*document.documentElement.clientHeight;
    gl.viewport(0,0,canvas.width,canvas.height);
    aspect = canvas.width/canvas.height;
    perspective = m4.perspective(fov, aspect, zNear, zFar);

    updateBD();
    
    initPhosphors(bW,bH);
    
    applyBufferImage();
}
let tick = 0;
let speed = 12;
let amplitude = 1000;

let lastTimestamp = Date.now();

let aniTime = 0;
function drawFrame(timestamp){
    let start = Date.now();
    if(isNaN(timestamp - lastTimestamp)){
        timestamp = Date.now();
    }
    applyKeystrokes(timestamp - lastTimestamp);
    let scale = 1;
    if(CRT){
        scale = 1/6;
    }
    let cW = canvas.width*scale;
    let cH = canvas.height*scale;
    clear();
    gl.viewport(0,0,cW,cH);
    
    // for(i=0; i<cW; i++){
    //     drawSquare(i, (amplitude*Math.sin((i-speed*tick)/50) + amplitude*Math.sin((i-speed*tick)/58))/2 + cH/2, 255,255,255,1);
    // }

    // drawRect(cW/2 - bW/2 - 1,cH/2-bH/2 - 1,(bW+2),(bH+2),255,255,255);
    // drawRect(cW/2 - bW/2,cH/2-bH/2,bW,bH,0,0,0);
    // let a = Math.sin(timestamp/300);
    // let b = Math.cos(timestamp/200);
    // let c = -Math.sin(timestamp/400);
    // let d = -Math.cos(timestamp/100);
    // drawGrad(0,0,canvas.width,canvas.height,[a,0,b,1],[c+d,b,0,1],[0,a-b,c,1],[d+a,d+c,d+b,1]);
    // someEffect(timestamp);

    let targetRadius = Math.cos(xRot);
    let target = [
        -Math.sin(yRot)*targetRadius,
         Math.sin(xRot),
        -Math.cos(yRot)*targetRadius
    ];
    target = v3.unit(target);
    camera.lookAt(target);
    // console.log(floor)
    floor.updateMatrix();
    // sun.updateMatrix();
    // drawObject(sun);
    for(i=0; i<cubes.length; i++){
        // cubes[i].setScale([size, size, size]);
        // cubes[i].setRot([xRot, yRot, zRot]); 
        if(animated){
            cubes[i].setPos([(Math.cos(aniTime/(9000*i))), Math.cos(Math.sqrt(aniTime/(9000*i)))+0.2, (Math.sin(aniTime/(9000*i)))]); 
            // console.log(aniTime)
            
            if(timestamp - lastTimestamp > 0) aniTime += (timestamp - lastTimestamp);
            //console.log(aniTime)
        }

        // cubes[i].setRot([(Math.cos(timestamp/(200*i))), Math.cos(Math.sqrt(timestamp/(200*i)))+0.2, (Math.sin(timestamp/(200*i)))]); 
        cubes[i].updateMatrix();
        drawObject(cubes[i], rectImg);
    }
    // let start = Date.now();
    drawObject(floor, rectImg);

    //drawImg(0,0, canvas.height*273/364, canvas.height);
    // drawGrad(0,0,bH,bW,[2/255,247/255,150/255,1],[252/255,247/255,2/255,1],[0,0,150/255,1],[252/255,0,1/255,1]);

    // camera.lookAt(sunPos);

    // sunPos= [Math.sin(timestamp/300),1,Math.cos(timestamp/300)];
    // drawObjects(spheres);

    // drawRect(0,0,cW,cH,255,255,255);
    // drawRect(cW/2-240*1.5-1,cH/2-160*1.5+1,240*3+2,160*3+3,255,255,255);

    // applyBufferImage();
    // let sinS = 0.04;
    // if(leftClick || timestamp<2000){
    //     drawSin(bW/2,cH-bH/2,255,0,255,sinS,timestamp/150, 510);
    // } else {
    //     drawSin(bW/2,cH-bH/2,255,0,255,Math.cos(tick/50)*sinS,timestamp/150*Math.abs(Math.cos(tick/50)), 510);//Math.abs(Math.cos(tick/50))
    //     tick++;
    // }

    
    // 
    // drawSin(255,255,255,0.1+Math.abs(Math.cos(tick/50))/2,timestamp/3020, 510);
    // for(i=0; i<100; i++){
    //     drawSin(255,255,255,Math.sin(tick/50)/2,timestamp/Math.random*, 510
    //     ); 
    // }
    
    // if(leftClick){
    //     crazySquares();
    //     drawSquare(mX,mY,255,255,255,10);
        
    // } else {
        
    // }
    if(CRT){
        let pixels = getPixels((cW/2 - bW/2), (cH/2 - bH/2) + 1, bW, bH);

        cW = canvas.width;
        cH = canvas.height;

        gl.viewport(0,0,cW,cH);
        
        drawRect(0,0,cW,cH,0,0,0);
        applyBufferImage(pixels);
    }   
    drawCursor();
    // console.log(timestamp - lastTimestamp);
    // lastTimestamp = timestamp;
    // console.clear();    
    // console.log(Date.now() - start);
    console.log("FPS: "+1000/(Date.now() - start));
    lastTimestamp = timestamp;
    window.requestAnimationFrame(drawFrame);
}

function applyBufferImage(pixels){
    drawCRTImg(pixels, bW, bH);
}

function drawCursor() {
    // drawRect(mX-11, mY-11, 22,22,255,255,255);
    // drawRect(mX-10, mY-10, 20,20,255,0,0);
    // drawRect(mX-9, mY-9, 18,18,255,125,0);
    // drawRect(mX-8, mY-8, 16,16,255,255,0);
    // drawRect(mX-7, mY-7, 14,14,0,255,0);
    // drawRect(mX-6, mY-6, 12,12,0,0,255);
    // drawRect(mX-5, mY-5, 10,10,180,0,255);
    // drawRect(mX-4, mY-4, 8,8,0,0,0);
    //if(CRT){
    if(document.pointerLockElement == canvas){
        drawSquare(canvas.width/2,canvas.height/2,255,255,255,4);
    } else {
        drawSquare(mouseX,mouseY,255,255,255,4);
    }

    //}
}

function crazySquares(){
    for(i=0; i<60; i++){
        drawSquare(mX + Math.random()*Math.random()*130 - 65, // x
                 mY + Math.random()*Math.random()*130 - 65, // y
                 Math.random()*255,                        // r
                 Math.random()*255,                        // g
                 Math.random()*255,                        // b
                 Math.random()*7

        ); 
    }
    for(i=0; i<60; i++){
        drawSquare(mX - Math.random()*Math.random()*130 + 65, // x
                 mY - Math.random()*Math.random()*130 + 65, // y
                 Math.random()*255,                        // r
                 Math.random()*255,                        // g
                 Math.random()*255,                        // b
                 Math.random()*7

        ); 
    }
}

function someEffect(timestamp){
    let c1 = [Math.abs(Math.sin(timestamp/800)),Math.abs(Math.cos(timestamp/700)),Math.abs(Math.sin(timestamp/600)),1];
    let c2 = [0,0,Math.abs(Math.sin(timestamp/1000)),1];
    let c3 = [0,Math.abs(Math.cos(timestamp/1200)),0,1];
    let c4 = [Math.abs(Math.sin(timestamp/300)),0,0,1];
    let size = canvas.height/4;

    if(canvas.width<canvas.height){
        size = canvas.width/4;
    }
    let bY = canvas.height/2 - size/2;
    let bX = canvas.width/2 - size/2;
    drawGrad(bX+bW/2 - size/2 - size/8*Math.sin(timestamp/80), bY+bH/2-size/2 + size/8*Math.cos(timestamp/80), size,size,c1,c2,c3,c4);
    drawGrad(bX+bW/2 - size/2 + size/8*Math.sin(timestamp/80), bY+bH/2-size/2 + size/8*Math.cos(timestamp/80), size,size,c2,c1,c4,c3);
    drawGrad(bX+bW/2 - size/2 + size/8*Math.sin(timestamp/80), bY+bH/2-size/2 - size/8*Math.cos(timestamp/80), size,size,c3,c4,c1,c2);
    drawGrad(bX+bW/2 - size/2 - size/8*Math.sin(timestamp/80), bY+bH/2-size/2 - size/8*Math.cos(timestamp/80), size,size,c4,c2,c3,c1);
    
}

function getPixels(x,y,w,h){
    let arrSize = bW * bH * 4;
    pixels = new Uint8Array(arrSize);
    gl.readPixels(x,y-1,w,h, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    return pixels;
}

function clear(){
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}