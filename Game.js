//Global variables
var canvas = document.querySelector('canvas');
var context = canvas.getContext('2d');
canvas.width = window.innerWidth - 10;
canvas.height = window.innerHeight - 10;

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
			x : side === 'left' ? 150 : canvas.width - 200,
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
	},
	menu: function () {
		// Draw all the Pong objects in their current state
		pong.draw();

		// Change the canvas font size and color
		context.font = '50px Courier New';
		context.fillStyle = '#008000';

		// Draw the rectangle behind the 'Press any key to begin' text.
		context.fillRect(
			canvas.width / 2 - 350,
			canvas.height / 2 - 48,
			700,
			100
		);

		// Change the canvas color;
		context.fillStyle = '#ffffff';

		// Draw the 'press any key to begin' text
		context.fillText('Press spacebar to begin the game',
			canvas.width / 2,
			canvas.height / 2 + 15
		);

	},
    update: function(){
		//update 
		
		if(!this.over && this.running)
		{
			this.ball.speedX+=0.01;
			//Ball movement
			if (this.ball.x <= 0) 
			{
				this.player2.score+=1;
				this.ball.x = canvas.width/2;
				this.ball.y = canvas.height/2;
				this.ball.moveX = DIRECTION.LEFT;
				this.ball.speedX = 25;
			}
			if (this.ball.x >= canvas.width - this.ball.width)
			{
				this.player1.score+=1;
				this.ball.x = canvas.width/2;
				this.ball.y = canvas.height/2;
				this.ball.moveX = DIRECTION.RIGHT;
				this.ball.speedX = 25;
			}
			
			if (this.ball.y <= 0) this.ball.moveY = DIRECTION.DOWN;
			if (this.ball.y >= canvas.height - this.ball.height) this.ball.moveY = DIRECTION.UP;
			
			//Move ball ---- this is not working
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
		context.fillRect(this.player1.x,this.player1.y, this.player1.width, this.player1.height);
		context.fillRect(this.player2.x, this.player2.y, this.player2.width, this.player2.height);
		context.fillRect(this.ball.x, this.ball.y, this.ball.width, this.ball.height);

		//this is not working
		for(var i=0; i< canvas.width ; i+= 50){
			context.fillStyle = '#FFFFFF';
			context.fillRect(canvas.width/2, i, 25, 25);
		}
		
		//update the score
		this.drawNum(this.player1.score, canvas.width/2 - 4*50, 25, 50);
		this.drawNum(this.player2.score, canvas.width/2 + 1.5*50, 25, 50);
    },
    loop: function(){
		//keep the events running
        pong.update();
        pong.draw();

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
				if(pong.running)
					pong.running = false;
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
					pong.ball.speed = 25;
					pong.loop();
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
var pong =  Object.assign({},Game);
pong.initialize();
