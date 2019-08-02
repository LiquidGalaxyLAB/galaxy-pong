const fs = require('fs')
const express = require('express')
const app = express()

var httpOptions = {
  key: fs.readFileSync("keys/privateKey.key"),
  cert: fs.readFileSync("keys/certificate.crt"),
  passphrase: 'batatinha'
}

const server = require('https').createServer(httpOptions, app).listen(8112, () => {
  console.log("Listening to port 8112")
});
const io = require('socket.io')(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/index.html");
})
app.get('/Game.js', (req, res) => {
  res.sendFile(__dirname + "/Game.js");
})


var maxRes = 0
var ballX = 0;
var ballY = 0;


var clients = [];
var controllers = []
var controller = {
  new: function (idC) {
    return {
      id: idC,
      resp: true
    }
  }
}

var maxPlayers = 0;

function client(id, screen, screenSize) {
  this.id = id;
  this.screen = screen;
  this.screenSize = screenSize;
}

function message(screen, nScreen) {
  this.screen = screen;
  this.nScreen = nScreen;
}

function disconnectUnecessaryPlayers() {
  var aux = []
  if (controllers.length > maxPlayers) {
    for (var i = maxPlayers; i < controllers.length; i++) {
      aux.push(controllers[i])
    }
    aux.forEach((at) => {
      io.emit('die', at)
      controllers.pop(at);
    })
  }
}

var nScreens = 0

app.use(express.static(__dirname + '/Public'));
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/Game.js', function (req, res) {
  res.sendFile(__dirname + '/Game.js');
});


io.on('connection', function (socket) {
  if (socket.handshake.query['type'] == 'controller') {
    if (controllers.length == maxPlayers)
      socket.disconnect();
    else {
      controllers.push(socket.id)
      socket.emit('welcome', { num: controllers.indexOf(socket.id), id: socket.id })
    }
  }
  else {
    if (nScreens == 0)
      maxPlayers = 1;
    nScreens += 1;
    //catch name for url
    // console.log("id",url.parse(socket.handshake.headers.referer))
    // console.log("screen conected number: ", nScreens, socket.id);
    //tudo o mundo


    //welcome process
    socket.emit("welcome", { nScreen: nScreens, nScreens: nScreens, ballX: ballX, ballY: ballY })
    socket.on("windowData", function (msg) {
      maxRes += msg.screenResolution;
      clients.push(new client(socket.id, msg.screen, msg.screenResolution))
      console.log(clients)
      console.log(maxRes)
      io.emit('updateNScreens', { nScreens: nScreens, maxRes: maxRes })
    })
  }

  socket.on("updateData", function (msg) {

    ballX = msg.ballX
    ballY = msg.ballY
    io.emit("updateData", msg)
    //console.log(msg)
  })
  socket.on("move", msg => {
    io.emit('move', { player: msg.playerNum, dir: msg.dir, speed: msg.speed })
  })
  socket.on("Goals", function (msg) {
    io.emit("Goals", msg)
  })
  socket.on("pei", () => {
    io.emit("pei")
  })
  socket.on("maxPlayers", msg => {
    maxPlayers = msg;
    disconnectUnecessaryPlayers()
  })

  socket.on("play", function () {
    io.emit("play")
  })

  socket.on("pause", function (msg) {
    io.emit("pause", msg)
  })

  socket.on("fps", function () {
    io.emit("fps")
  })

  socket.on("GameOver", function () {
    io.emit("GameOver")
  })
  socket.on('lost', msg => {
    if (msg == 1) {
      io.emit('lost', controllers[0])
      io.emit('lost', controllers[2])
    }
    else if (msg == 2) {
      io.emit('lost', controllers[1])
      io.emit('lost', controllers[3])
    }
  })
  socket.on("AAAA", msg => {
    console.log(msg)
  })
  //io.emit('updateNScreens', {nScreens : nScreens , maxRes : maxRes})

  socket.on('disconnect', function () {
    if (socket.handshake.query['type'] == 'controller')
    {
      controllers.splice(controllers.indexOf(socket.id), 1)
    }
    else {
      nScreens -= 1;
      if (nScreens == 0) {
        maxPlayers = 0;
        disconnectUnecessaryPlayers()
      }
      clients.forEach(function (client) {
        //console.log("good bye" , client.id, "socket how exit")
        if (socket.id == client.id) {
          console.log("our friend", client.id, "left us. It was screen", client.screen)
          maxRes -= client.screenSize;
          console.log("new screen size", maxRes)
          clients.pop(client)
        }
        //console.log(clients)
        io.emit('updateNScreens', { nScreens: nScreens, maxRes: maxRes })
      })
    }
  });
  //send to the last socket
});



module.exports = server;
