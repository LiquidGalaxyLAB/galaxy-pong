var socket = io.connect({ query: "type=controller" });
var playerNum = -1;
let txtTeam = document.getElementById('txtTeam')
var pause = false;
var fullSpeed = false;
let titanic = new Audio('flautaTitanic.mp3')
var cId = null;

function playSound() {
    titanic.play().catch((err) => {
        alert(err)
    });
}

socket.on('welcome', msg => {
    playerNum = msg.num;
    cId = msg.id;

    if (playerNum == 0 || playerNum == 2)
        txtTeam.innerHTML = 'Team Left'
    else if (playerNum == 1 || playerNum == 3)
        txtTeam.innerHTML = 'Team Right'
    else
        txtTeam.innerHTML = 'DISCONECTED'
})

socket.on('pause', msg => {
    pause = msg
})

socket.on('lost', msg => {
    if (msg == cId) {
        playSound();
    }
})

socket.on('die', msg => {
    if (msg == cId)
        socket.disconnect();
})

socket.on('disconnect', () => {
    txtTeam.innerHTML = "DISCONECTED";
})

var DIRECTION = {
    IDLE: 0,
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4
};

var options = {
    color: "blue",
    zone: document.querySelector('.zone'),
    mode: "static",
    position: { left: "50%", top: "50%"},
    lockY: true
}

var lastDir = { dir: DIRECTION.IDLE, speed: false };

createNipple();

function createNipple() {
	var manager = nipplejs.create(options);
	manager.on("dir", function (evt, data) {
		var direction = data.direction;
		if(direction.angle == "up") {
            actualDir = DIRECTION.UP
            setDirection()
		} else if(direction.angle == "down") {
            actualDir = DIRECTION.DOWN
            setDirection()
		}
	})

    manager.on("end", () => {
        actualDir = DIRECTION.IDLE
        setDirection()
    })
}

function onBtnPause() {
    socket.emit('pause', pause = !pause);
    if (!pause) {
        document.getElementById("btnIcon").className = "btn fa fa-pause btn-success"
    }
    else
        document.getElementById("btnIcon").className = "btn fa fa-play btn-success"
}

function onIdle() {
    actualDir = DIRECTION.IDLE
    this.setDirection()
}

function setDirection() {
    lastDir.dir = actualDir
    lastDir.speed = 4
    socket.emit('move', {dir: lastDir.dir, speed: lastDir.speed, playerNum: playerNum})
}
