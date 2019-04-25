//Global variables
var socket = io();

var canvas = document.querySelector('canvas');
var context = canvas.getContext('2d');
screenRes = window.innerWidth - 7;
canvas.width = screenRes;
canvas.height = window.innerHeight - 7;
var ballX
var ballY
var pong;
var player2X;
var pause = false;
// link vars


////////////////////////////v
var screenNumber;
maxRes = screenRes;
//



//Directions
var DIRECTION = {
	IDLE: 0,
	UP: 1,
	DOWN: 2,
	LEFT: 3,
	RIGHT: 4
};

//Ball object
var Ball = {
    new: function(speed){
		return{
		width : 100,
		height : 100,
		x : canvas.width / 2,
		y : canvas.height / 2,
		moveX : DIRECTION.IDLE,
		moveY : DIRECTION.IDLE,
		speedY: speed || 10,
		speedX: speed || 10
		}
    }
}

var Player = {
    new: function(side){
		return{
			width: 50,
            height: 500,
			//side === 'left' ? this.width : this.width - (2 * this.width)
			x : side === 'left' ? 50 : maxRes - 200,
			//(canvas.width / 2) - (this.height / 2)
            y : canvas.height / 2 - 250,
            speed : 20,
            score :0,
			move : DIRECTION.IDLE
		};
	},
}

var Game = {
    initialize: function(){
		//initialize everything that needs to appear when the game is initialized
        this.player1 = Player.new.call(this,'left');
		this.player2 = Player.new.call(this,'right');

        this.running = this.over = false;

        this.ball = Ball.new.call(this,25 );

		pong.listen();
		pong.menu();
		pong.loop();

		//socket code////////////////////
		socket.on('welcome',function(msg){
			screenNumber = msg.nScreen
			console.log("number of screens", msg.nScreens)
			socket.emit("windowData", {screen : screenNumber, screenResolution : screenRes})
		});

		socket.on('updateNScreens',function(msg){
			maxRes = msg.maxRes;
			playerPosition = (maxRes) - 90;
			playerPosition = (playerPosition - (screenRes * (screenNumber -1)))
			console.log(playerPosition)
			pong.player2.x = playerPosition;
		});

		socket.on("Goals",function(msg){
			pong.player1.score = msg.player1
			pong.player2.score = msg.player2
		})

		socket.on("play",function(){
			pong.running = true;
			pong.over = false;
		})

		socket.on('updateData',function(msg){

			if(screenNumber != 1){
				offset = (screenNumber - 1) * screenRes
				ballX = msg.ballX - offset;
				ballY = msg.ballY;
				if(screenNumber != 1) pong.player2.y = msg.playerY
			}
		});




	},
	menu: function () {
		// Draw all the Pong objects in their current state
		pong.draw();
		
		var boxW = 500;
		var boxH = 100;
		var boxX = canvas.width / 2 - (boxW / 2);
		var boxY = canvas.height / 2 - 48;
		
		// Change the canvas font size and color
		context.font = 'bold 50px Courier new';

		// Change the canvas color;
		context.fillStyle = '#06ba12';

		// Draw the text
		if(pause){
			context.fillText('SPACE TO RESTART',boxX + 40,boxY + 60);
			context.fillText('P TO CONTINUE',boxX + 80,boxY + 120);
		}
		else
			context.fillText('SPACE TO START',boxX + 40,boxY + 60);
			

	},
    update: function(){
		//update

		if(!this.over && this.running)
		{
			if(screenNumber == 1){
				this.ball.speedX+=0.01;
				//Ball movement
				if (this.ball.x <= 0)
				{
					this.player2.score+=1;
					this.ball.x = canvas.width/2;
					this.ball.y = canvas.height/2;
					this.ball.moveX = DIRECTION.LEFT;
					this.ball.speedX = 25;
					socket.emit("Goals", {player1 : this.player1.score, player2 : this.player2.score})
				}
					//goal player 1, wall = canvas.width
					if (this.ball.x >= maxRes - this.ball.width)
					{
						this.player1.score+=1;
						this.ball.x = canvas.width/2;
						this.ball.y = canvas.height/2;
						this.ball.moveX = DIRECTION.RIGHT;
						this.ball.speedX = 25;
						socket.emit("Goals", {player1 : this.player1.score, player2 : this.player2.score})
					}

					if (this.ball.y <= 0) this.ball.moveY = DIRECTION.DOWN;
					if (this.ball.y >= canvas.height - this.ball.height) this.ball.moveY = DIRECTION.UP;

					//Move ball
					if (this.ball.moveY === DIRECTION.UP) this.ball.y -= (this.ball.speedY);
					else if (this.ball.moveY === DIRECTION.DOWN) this.ball.y += (this.ball.speedY);
					if (this.ball.moveX === DIRECTION.LEFT) this.ball.x -= this.ball.speedX;
					else if (this.ball.moveX === DIRECTION.RIGHT) this.ball.x += this.ball.speedX;

					//Player movement
					if (this.player1.move === DIRECTION.UP) this.player1.y -= this.player1.speed;
					else if (this.player1.move === DIRECTION.DOWN) this.player1.y += this.player1.speed;

					if (this.player2.move === DIRECTION.UP) this.player2.y -= this.player2.speed;
					else if (this.player2.move === DIRECTION.DOWN) this.player2.y += this.player2.speed;

					//Player movement limit
					if (this.player1.y <= 0) this.player1.y = 0;
					else if (this.player1.y >= (canvas.height - this.player1.height)) this.player1.y = (canvas.height - this.player1.height);
					if (this.player2.y <= 0) this.player2.y = 0;
					else if (this.player2.y >= (canvas.height - this.player2.height)) this.player2.y = (canvas.height - this.player2.height);

					//Player1 Collision
					if (this.ball.x >= this.player1.x && this.ball.x <= this.player1.x + this.player1.width) {
						if (this.ball.y <= this.player1.y + this.player1.height && this.ball.y + this.ball.height >= this.player1.y) {
							this.ball.moveX = DIRECTION.RIGHT;
						}
					}
					//Player2 Collision
					if (this.ball.x + this.ball.width <= this.player2.x + this.player2.width && this.ball.x + this.ball.width >= this.player2.x) {
						if (this.ball.y <= this.player2.y + this.player2.height && this.ball.y + this.ball.height >= this.player2.y) {
							this.ball.moveX = DIRECTION.LEFT;
						}
					}

					if(this.player1.score == 5 || this.player2.score == 5)
					{
						this.running = false;
						this.over = true;
					}
			}else{
				this.ball.x = ballX;
				this.ball.y = ballY;
			}
			if(screenNumber == 1) socket.emit("updateData", {ballX: this.ball.x, ballY: this.ball.y, playerX: this.player2.x, playerY: this.player2.y})
		}
    },
    draw: function(){
		//draw the objects

		//clear canvas
		context.clearRect(0, 0, canvas.width, canvas.height);

		//draw background
		context.fillStyle = '#000000';
		context.fillRect(0, 0, canvas.width, canvas.height);

		//set the color of the fillStyle to white
		context.fillStyle = '#FFFFFF';

		//draw the elements
		if(screenNumber == 1) context.fillRect(this.player1.x,this.player1.y, this.player1.width, this.player1.height);
		context.fillRect(this.player2.x, this.player2.y, this.player2.width, this.player2.height);
		// revisaar!!!
		if(screenNumber == 1) {
			context.fillRect(this.ball.x, this.ball.y, this.ball.width, this.ball.height)
		}else{
			context.fillRect(ballX, ballY, this.ball.width, this.ball.height)
		}

		linePos = (maxRes/2 - (screenRes * (screenNumber -1)))
		for(var i=0; i< canvas.width ; i+= 50){
			context.fillStyle = '#FFFFFF';

			context.fillRect(linePos, i, 25, 25);
		}

		//update the score
		numPos1 = (maxRes/2 - 4   * 50) - (screenRes * (screenNumber -1))
		numPos2 = (maxRes/2 + 1.5 * 50) - (screenRes * (screenNumber -1))
		this.drawNum(this.player1.score, numPos1, 25, 50);
		this.drawNum(this.player2.score, numPos2, 25, 50);
    },
    loop: function(){
		//keep the events running
		pong.update();
		if(pong.running)
        	pong.draw();
		else
		{
			pong.menu();
		}

        if(!this.over) //if the game is not over, keep repeating
            requestAnimationFrame(pong.loop);
    },
    listen: function(){
		//listen the pressed keys
        document.addEventListener('keydown',function(key){


            //keys for player 1
            if(key.keyCode === 87){
                pong.player1.move = DIRECTION.UP;
            }
            if(key.keyCode == 83){
                pong.player1.move = DIRECTION.DOWN;
            }

            //keys for player 2
            if(key.keyCode == 38){
                pong.player2.move = DIRECTION.UP;
            }
            if(key.keyCode == 40){
                pong.player2.move =  DIRECTION.DOWN;
			}

			//keys for menu
			if(key.keyCode == 80){ //Pause (P)
				if(pong.running){
					pong.running = false;
					pause = true;
				}
				else if(!pong.running)
					pong.running = true;
			}
			if(key.keyCode == 32){//Start (spacebar)
				if(!pong.running || pong.over)
				{
					pong.running = true;
					pong.over = false;
					pong.ball.moveX = DIRECTION.RIGHT;
					pong.ball.moveY = DIRECTION.UP;
					pong.player1.score = 0;
					pong.player2.score = 0;
					pong.ball.x = canvas.width/2;
					pong.ball.y = canvas.height/2;
					pong.ball.speed = 25;
					socket.emit("play")
				}
			}
        });

        document.addEventListener('keyup',function(key){
            if(key.keyCode == 38 || key.keyCode == 40)
            pong.player2.move = DIRECTION.IDLE
            if(key.keyCode == 87 || key.keyCode == 83)
            pong.player1.move = DIRECTION.IDLE});
    },

	drawNum: function(num, x, y, tam){
		//draw the score numbers
		switch(num){
		case 0:
			for(var i=y; i < y+5*tam; i+=tam)
			{
				context.fillRect(x, i, tam, tam);
				context.fillRect(x+2*tam, i, tam, tam);
			}
			context.fillRect(x+tam, y, tam, tam);
			context.fillRect(x+tam, y+4*tam, tam, tam);
			break;
		case 1:
			for(var i=y; i < y+5*tam; i+=tam)
			context.fillRect(x+2*tam, i, tam, tam);
			context.fillRect(x+tam, y, tam, tam);
			break;
		case 2:
			for(var i=x; i < x+3*tam; i+=tam)
			{
				context.fillRect(i, y, tam, tam);
				context.fillRect(i, y+2*tam, tam, tam);
				context.fillRect(i, y+4*tam, tam, tam);
			}
			context.fillRect(x+2*tam, y+tam, tam, tam);
			context.fillRect(x,y+3*tam, tam, tam);
			break;
		case 3:
			for(var i=x; i < x+3*tam; i+=tam)
			{
				context.fillRect(i, y, tam, tam);
				context.fillRect(i, y+2*tam, tam, tam);
				context.fillRect(i, y+4*tam, tam, tam);
			}
			context.fillRect(x+2*tam, y+tam, tam, tam);
			context.fillRect(x+2*tam,y+3*tam, tam, tam);
			break;
		case 4:
			for(var i=y; i < y+5*tam; i+=tam)
				context.fillRect(x+2*tam, i, tam, tam);
			for(var i=y; i < y+3*tam; i+=tam)
				context.fillRect(x, i, tam, tam);
			context.fillRect(x+tam, y+2*tam, tam, tam);
			break;
		case 5:
			for(var i=x; i < x+3*tam; i+=tam)
			{
				context.fillRect(i, y, tam, tam);
				context.fillRect(i, y+2*tam, tam, tam);
				context.fillRect(i, y+4*tam, tam, tam);
			}
			context.fillRect(x, y+tam, tam, tam);
			context.fillRect(x+2*tam,y+3*tam, tam, tam);
			break;
		case 6:
			for(var i=x; i < x+3*tam; i+=tam)
			{
				context.fillRect(i, y, tam, tam);
				context.fillRect(i, y+2*tam, tam, tam);
				context.fillRect(i, y+4*tam, tam, tam);
			}
			context.fillRect(x, y+tam, tam, tam);
			context.fillRect(x, y+3*tam, tam, tam);
			context.fillRect(x+2*tam,y+3*tam, tam, tam);
			break;
		case 7:
			for(var i=x; i < x+3*tam; i+=tam)
				context.fillRect(i, y, tam, tam);
			context.fillRect(x+2*tam, y+tam, tam, tam);
			for(var i=y+2*tam; i < y+5*tam; i+=tam)
				context.fillRect(x+tam, i, tam, tam);
			break;
		case 8:
			for(var i=x; i < x+3*tam; i+=tam)
			{
				context.fillRect(i, y, tam, tam);
				context.fillRect(i, y+2*tam, tam, tam);
				context.fillRect(i, y+4*tam, tam, tam);
			}
			context.fillRect(x, y+tam, tam, tam);
			context.fillRect(x+2*tam, y+tam, tam, tam);
			context.fillRect(x, y+3*tam, tam, tam);
			context.fillRect(x+2*tam, y+3*tam, tam, tam);

			break;
		case 9:
			for(var i=x; i < x+3*tam; i+=tam)
			{
				context.fillRect(i, y, tam, tam);
				context.fillRect(i, y+2*tam, tam, tam);
				context.fillRect(i, y+4*tam, tam, tam);
			}
			context.fillRect(x, y+tam, tam, tam);
			context.fillRect(x+2*tam, y+tam, tam, tam);
			context.fillRect(x+2*tam, y+3*tam, tam, tam);
			break;
		}

	}
}
pong =  Object.assign({},Game);
pong.initialize();
