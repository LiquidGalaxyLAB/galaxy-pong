var socket = io.connect({ query: "type=controller" });
var playerNum = -1;
let txtTeam = document.getElementById('txtTeam')
var pause = false;

socket.on('welcome', msg => {
    playerNum = msg;

    if (playerNum == 0 || playerNum == 2)
        txtTeam.innerHTML = 'Team Left'
    else if(playerNum == 1 || playerNum == 3)
        txtTeam.innerHTML = 'Team Right'
    else   
        txtTeam.innerHTML = 'DISCONECTED'
})

socket.on('pause', msg=>{
    pause = msg
})

socket.on('disconnect', ()=>{
    txtTeam.innerHTML = "DISCONECTED";
})

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
    socket.emit('pause', pause = !pause);
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
        else if (e.target.y < -2) {
            actualDir = DIRECTION.DOWN
            document.getElementById('myImag').src = "https://i.ibb.co/0Zt0pSL/pong-App-Controller-down.png"
        }
        else {
            actualDir = DIRECTION.IDLE
            document.getElementById('myImag').src = "https://i.ibb.co/VxNLmKP/pong-App-Controller-idle.png"
        }

        if (actualDir != lastDir) {
            lastDir = actualDir;
            socket.emit('move', actualDir)
        }
    });
    sensor1.start();


}

