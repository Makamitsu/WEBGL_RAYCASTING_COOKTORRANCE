/**
 * Created by ambie on 09/03/2017.
 */

var mouseX=0;
var mouseY=0;
var lastMouseX=0;
var lastMouseY=0;
var deltaMouseX=0;
var deltaMouseY=0;
var rotY = 0;
var rotX = 0;
var mainScene;
var zPressed = false;
var qPressed = false;
var sPressed = false;
var dPressed = false;
var onFloor = true;

var speed = 1;

var objMatrix = mat4.create();

Material.prototype.plusM = function(){this.m +=0.1;this.show();};
Material.prototype.moinsM = function(){this.m -=0.1;this.show();};
Material.prototype.plusNi = function(){this.ni +=0.1;this.show();};
Material.prototype.moinsNi = function(){this.ni -=0.1;this.show();};
Material.prototype.show = function () {console.log("m: "+this.m+" Ni: "+this.ni);};

var matGold = new Material([0.211, 0.175, 0.055],1.0, 0.4, 1.3); //0.05 Mirror

var matCopper = new Material([0.220, 0.109, 0.055], 1.0, 0.5, 1.5); //0.02 Mirror

var matChrome = new Material([0.150, 0.150, 0.170], 1.0, 0.1, 3.0); //0.80 Mirror

var matSilver = new Material([0.180, 0.180, 0.180], 1.0, 0.6, 1.3); //0.03 Mirror

var decal =0;

function initialiseComponent(){
    mainScene = new Scene();
    mainScene.lights[0] = new Light([0.0,30.0,0.0],[17.0,17.0,17.0]);
    mainScene.spheres[0] = new Sphere([50.0,3,50.0],12.0, matGold);
    mainScene.spheres[1] = new Sphere([50.0,3.0,-50.0],12.0, matCopper);
    mainScene.spheres[2] = new Sphere([-50.0,3.0,50.0],12.0, matChrome);
    mainScene.spheres[3] = new Sphere([-50.0,3.0,-50.0],12.0, matSilver);
    mainScene.plans[0] = new Plan([0.0, 1.0 , 0.0], 20, new Material([0.2,0.2,0.25],1.0,1.5,1.5));

    mainScene.speed = 0;
    mainScene.gravity = [0.0,-0.1,0.0];
}


function update() {


    if (!onFloor){
        mainScene.speed += mainScene.gravity[1];
        mainScene.mainCam.origin[1] += mainScene.speed;
        if(mainScene.mainCam.origin[1] < 0){
            onFloor = true;
        }
    }


    viewControl();
    // move();
    dragScene();
    moveLight();
    mainScene.spheres[0].center[0] = 50*Math.sin(decal + 3.1416/2);
    mainScene.spheres[0].center[2] = 50*Math.cos(decal + 3.1416/2);
    mainScene.spheres[1].center[0] = 50*Math.sin(decal + 3.1416);
    mainScene.spheres[1].center[2] = 50*Math.cos(decal + 3.1416);
    mainScene.spheres[2].center[0] = 50*Math.sin(decal - 3.1416/2);
    mainScene.spheres[2].center[2] = 50*Math.cos(decal - 3.1416/2);
    mainScene.spheres[3].center[0] = 50*Math.sin(decal);
    mainScene.spheres[3].center[2] = 50*Math.cos(decal);

    mainScene.spheres[0].updateUniform();
    mainScene.spheres[1].updateUniform();
    mainScene.spheres[2].updateUniform();
    mainScene.spheres[3].updateUniform();

    mainScene.mainCam.updateUniform();

    drawScene();
}

function dragScene() {
    decal = mouseX*0.001;
}

function moveLight(){
    if(zPressed){
        mainScene.lights[0].center[2] += 2;
    }
    if(sPressed){
        mainScene.lights[0].center[2] -= 2;
    }
    if(qPressed){
        mainScene.lights[0].center[0] -= 2;
    }
    if(dPressed){
        mainScene.lights[0].center[0] += 2;
    }
    mainScene.lights[0].updateUniform();
}

function move(){
    if(zPressed){
        //speed +=0.1;
        mainScene.mainCam.origin[0] += mainScene.mainCam.direction[0]*speed;
        mainScene.mainCam.origin[2] += mainScene.mainCam.direction[2]*speed;
    }
    if(sPressed){
        mainScene.mainCam.origin[0] -= mainScene.mainCam.direction[0];
        mainScene.mainCam.origin[2] -= mainScene.mainCam.direction[2];
    }
    if(qPressed){
        var crossVecteur = vec3.cross(mainScene.mainCam.direction, [0,1,0]);
        mainScene.mainCam.origin[0] += crossVecteur[0];
        mainScene.mainCam.origin[2] += crossVecteur[2];
    }
    if(dPressed){
        var crossVecteur = vec3.cross(mainScene.mainCam.direction, [0,1,0]);
        mainScene.mainCam.origin[0] -= crossVecteur[0];
        mainScene.mainCam.origin[2] -= crossVecteur[2];
    }
}


function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

function viewControl() {
    var sensibility = 0.1;

    var newX = mouseX;
    var newY = mouseY;

    var deltaX = newX - lastMouseX;
    var deltaY = newY - lastMouseY;

    rotY += degToRad(deltaX*sensibility / 2);
    rotX += degToRad(deltaY*sensibility / 2);

    mat4.identity(objMatrix);
    // mat4.rotate(objMatrix, rotY, [0, 1, 0]);
    // mat4.rotate(objMatrix, rotX, [1, 0, 0]);

    mainScene.mainCam.direction = mat4.multiplyVec3(objMatrix, [0.0,0.0,1.0]);
    mainScene.mainCam.rotation = objMatrix;

    lastMouseX = newX;
    lastMouseY = newY;
}

function keypressed(e){
    switch (e.key){
        case "z": // Z key is pressed
            zPressed = true;
            break;
        case "q": // Q key is pressed
            qPressed = true;
            break;
        case "s": // S key is pressed
            sPressed = true;
            break;
        case "d": // D key is pressed
            dPressed = true;
            break;
        case " ": // SpaceBar is pressed

            break;
        case "i":matSilver.moinsM();break;
        case "o":matSilver.plusM();break;
        case "k":matSilver.moinsNi();break;
        case "l":matSilver.plusNi();break;
    }
}

function keyreleased(e){
    switch (e.key){
        case "z": // Z key is pressed
            zPressed = false;
            speed = 1;
            break;
        case "q": // Q key is pressed
            qPressed = false;
            break;
        case "s": // S key is pressed
            sPressed = false;
            break;
        case "d": // D key is pressed
            dPressed = false;
            break;
        case " ": // SpaceBar is pressed
            onFloor = false;
            mainScene.speed = 3;
            break;
    }
}
document.addEventListener("keydown",keypressed);
document.addEventListener("keyup",keyreleased);


function animate() {
    gl.useProgram(shaderProgram);
    update();
    requestAnimFrame(animate);
}

setTimeout((function() {window.requestAnimFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.msRequestAnimationFrame;
    animate();
}),1000);


canvas = document.getElementById("WebGL-test");
canvas.requestPointerLock = canvas.requestPointerLock ||
    canvas.mozRequestPointerLock;

document.exitPointerLock = document.exitPointerLock ||
    document.mozExitPointerLock;

canvas.onclick = function() {
    canvas.requestPointerLock();
};

document.addEventListener('pointerlockchange', lockChangeAlert, false);
document.addEventListener('mozpointerlockchange', lockChangeAlert, false);

function lockChangeAlert() {
    if (document.pointerLockElement === canvas ||
        document.mozPointerLockElement === canvas) {
        console.log('The pointer lock status is now locked');
        document.addEventListener("mousemove", updatePosition, false);
    } else {
        console.log('The pointer lock status is now unlocked');
        document.removeEventListener("mousemove", updatePosition, false);
    }
}

function updatePosition(e) {
    mouseX += e.movementX;
    mouseY += e.movementY;
}

function fullscreen(){
    if(canvas.webkitRequestFullScreen) {
        canvas.webkitRequestFullScreen();
    }
    else {
        canvas.mozRequestFullScreen();
    }
}
// document.addEventListener("click",fullscreen);

