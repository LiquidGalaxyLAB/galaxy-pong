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
      if (controllers[i]) {
        aux.push(controllers[i])
        io.sockets.sockets[controllers[i]].disconnect();
      }
    }
    aux.forEach((at) => {
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
      socket.emit('welcome', controllers.indexOf(socket.id))
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
    io.emit('move', { player: controllers.indexOf(socket.id), dir: msg })
  })
  socket.on("Goals", function (msg) {
    io.emit("Goals", msg)
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

  socket.on("AAAA", msg => {
    console.log(msg)
  })
  //io.emit('updateNScreens', {nScreens : nScreens , maxRes : maxRes})

  socket.on('disconnect', function () {
    if (socket.handshake.query['type'] == 'controller')
      console.log("AAAAA SAIU");
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
