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
    //how to change an image src 
    document.getElementById('myImag').src = "https://www.stickpng.com/assets/images/58f8bd170ed2bdaf7c128308.png"
}


let accelerometerText = document.getElementById('accelerometerText');

if (window.Accelerometer) {
    let sensor1 = new Accelerometer();
    var actualDir
    sensor1.addEventListener('reading', function (e) {
        if (e.target.y > 3) {
            actualDir = DIRECTION.UP
        }
        else if (e.target.y < -3){
            actualDir = DIRECTION.DOWN
        }
        else{
            actualDir = DIRECTION.IDLE
        }

        if(actualDir != lastDir)
        {
            lastDir = actualDir;
            socket.emit('move',actualDir)
        }
    });
    sensor1.start();
}

