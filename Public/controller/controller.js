var socket = io.connect({ query: "type=controller" });
var playerNum = -1;
let txtTeam = document.getElementById('txtTeam')
var pause = false;
var fullSpeed = false;

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

var lastDir = {dir:DIRECTION.IDLE, speed:false};

function onBtnPause() {
    socket.emit('pause', pause = !pause);
    if(!pause){
        document.getElementById("btnIcon").className = "btn fa fa-pause btn-success"
    }
    else
        document.getElementById("btnIcon").className = "btn fa fa-play btn-success" 
}

let accelerometerText = document.getElementById('accelerometerText');

if (window.Accelerometer) {
    let sensor1 = new Accelerometer();
    var actualDir
    sensor1.addEventListener('reading', function (e) {
        if (e.target.y > 6) {
            actualDir = DIRECTION.UP
            fullSpeed = true
            document.getElementById('myImag').src = "https://i.ibb.co/fpVq8dc/pong-App-Controller-up.png"
        }
        else if (e.target.y > 3) {
            actualDir = DIRECTION.UP
            fullSpeed = false
            document.getElementById('myImag').src = "https://i.ibb.co/fpVq8dc/pong-App-Controller-up.png"
        }
        else if (e.target.y < -6) {
            actualDir = DIRECTION.DOWN
            fullSpeed = true
            document.getElementById('myImag').src = "https://i.ibb.co/0Zt0pSL/pong-App-Controller-down.png"
        }
        else if (e.target.y < -3) {
            actualDir = DIRECTION.DOWN
            fullSpeed = false
            document.getElementById('myImag').src = "https://i.ibb.co/0Zt0pSL/pong-App-Controller-down.png"
        }
        else {
            actualDir = DIRECTION.IDLE
            fullSpeed = true
            document.getElementById('myImag').src = "https://i.ibb.co/VxNLmKP/pong-App-Controller-idle.png"
        }

        if (actualDir != lastDir.dir || fullSpeed != lastDir.speed) {
            lastDir.dir = actualDir
            lastDir.speed = fullSpeed
            socket.emit('move', lastDir)
        }
    });
    sensor1.start();


}

