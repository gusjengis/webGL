var bW;
var bH;
updateBD();

function updateBD(){
    bW = canvas.width/6;
    bW -= bW%2;
    bH = canvas.height/6;
}

function X(x){
    return 2*(x)/canvas.width - 1;
}

function Y(y){
    return -2*(y)/canvas.height + 1;
}

function intX(x){
    return 2*(Math.floor(x))/canvas.width - 1;
}

function intY(y){
    return -2*(Math.floor(y))/canvas.height + 1;
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
        console.log("gl.linkProgram(program) failed with error code 0");
        error = true;
    }

    if(error) {
        console.log("Failed to initialize shader.");
        return false;
    }
    console.log(context.getProgramInfoLog(program))
    console.log("Shader successfully created");

    return program;
}

function initTexture(texture, src){
    gl.bindTexture(gl.TEXTURE_2D, texture[0]);
    let index = texture[1];
    gl.texImage2D(gl.TEXTURE_2D, index, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
    
    var image = new Image();
    image.src = src;
    console.log(image);
    image.onload = function() {
        // gl.bindTexture(gl.TEXTURE_2D, texture[0]);
        gl.texImage2D(gl.TEXTURE_2D, index, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
        // gl.generateMipmap(gl.TEXTURE_2D);
        console.log("loaded");
        console.log(texture)
    };
}