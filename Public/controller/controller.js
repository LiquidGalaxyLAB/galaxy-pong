var socket = io();

var DIRECTION = {
    IDLE: 0,
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4
};

var lastDir = DIRECTION.IDLE;

function onBtnStart() {
    console.log('start');
}

function onBtnPause() {
    console.log('pause');
}


let accelerometerText = document.getElementById('accelerometerText');

if (window.Accelerometer) {
    let sensor1 = new Accelerometer();
    var actualDir
    sensor1.addEventListener('reading', function (e) {
        if (e.target.y > 2) {
            actualDir = DIRECTION.UP
            document.getElementById('myImag').src = "https://i.ibb.co/fpVq8dc/pong-App-Controller-up.png"
        }
        else if (e.target.y < -2){
            actualDir = DIRECTION.DOWN
            document.getElementById('myImag').src = "https://i.ibb.co/0Zt0pSL/pong-App-Controller-down.png"
        }
        else{
            actualDir = DIRECTION.IDLE
            document.getElementById('myImag').src = "https://i.ibb.co/VxNLmKP/pong-App-Controller-idle.png"
        }

        if(actualDir != lastDir)
        {
            lastDir = actualDir;
            socket.emit('move',actualDir)
        }
    });
    sensor1.start();


}

