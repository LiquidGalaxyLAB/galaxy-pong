//Global variables
var canvas = document.querySelector('canvas');
var context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

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
		width : 50,
		height : 50,
		x : 0,
		y : 0,
		moveX : DIRECTION.IDLE,
		moveY : DIRECTION.IDLE, 
		speed : speed || 10
		}
    }
}

var Player = {
    new: function(side){
		return{
			width: 30,
            height: 200,
			//side === 'left' ? this.width : this.width - (2 * this.width)
			x : side === 'left' ? 150 : canvas.width - 150,
			//(canvas.width / 2) - (this.height / 2)
            y : 50,
            speed : 10,
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

        this.ball = Ball.new.call(this,5);

		pong.listen();
		pong.loop();
    },
    update: function(){
        //update 
		if(!this.over)
		{
			//Ball movement
			if (this.ball.x <= 0) 
			{
				this.player2.score+=1;
				this.ball.x = canvas.width/2;
				this.ball.y = canvas.height/2;
				this.ball.moveX = DIRECTION.LEFT;
			}
			if (this.ball.x >= canvas.width - this.ball.width)
			{
				this.player1.score+=1;
				this.ball.x = canvas.width/2;
				this.ball.y = canvas.height/2;
				this.ball.moveX = DIRECTION.RIGHT;
			}
			
			if (this.ball.y <= 0) this.ball.moveY = DIRECTION.DOWN;
			if (this.ball.y >= canvas.height - this.ball.height) this.ball.moveY = DIRECTION.UP;
			
			//Move ball
			if (this.ball.moveY === DIRECTION.UP) this.ball.y -= (this.ball.speed / 1.5);
			else if (this.ball.moveY === DIRECTION.DOWN) this.ball.y += (this.ball.speed / 1.5);
			if (this.ball.moveX === DIRECTION.LEFT) this.ball.x -= this.ball.speed;
			else if (this.ball.moveX === DIRECTION.RIGHT) this.ball.x += this.ball.speed;
			
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
			if (this.ball.x - this.ball.width <= this.player1.x && this.ball.x >= this.player1.x - this.player1.width) {
				if (this.ball.y <= this.player1.y + this.player1.height && this.ball.y + this.ball.height >= this.player1.y) {
					this.ball.x = (this.player1.x + this.ball.width);
					this.ball.moveX = DIRECTION.RIGHT;
				}
			}
			//Player2 Collision
			if (this.ball.x - this.ball.width <= this.player2.x && this.ball.x >= this.player2.x - this.player2.width) {
				if (this.ball.y <= this.player2.y + this.player2.height && this.ball.y + this.ball.height >= this.player2.y) {
					this.ball.x = (this.player2.x - this.ball.width);
					this.ball.moveX = DIRECTION.LEFT;
				}
			}
			
			if(this.player1.score == 9 || this.player2.score == 9)
			{
				this.running = false;
				this.over = true;
			}
		}
        
    },
    draw: function(){
		//draw the objects 
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.fillStyle = '#000000';
		context.fillRect(0, 0, canvas.width, canvas.height);
		context.fillStyle = '#FFFFFF';
		context.beginPath();
		context.fillRect(this.player1.x,this.player1.y, this.player1.width, this.player1.height);
		context.fill()
		context.fillRect(this.player2.x, this.player2.y, 30, 1000);
		context.fillRect(this.ball.x, this.ball.y, this.ball.width, this.ball.height);
		
		
		for(var i=0; i< canvas.innerWidth ; i+= 25)
		c.fillRect(canvas.width/2, i, 25, 25);
		
		this.drawNum(this.player1.score, canvas.width/2 - 3*25, 25, 15);
		this.drawNum(this.player2.score, canvas.width/2 + 2*25, 25, 15);
    },
    loop: function(){
        pong.update();
        pong.draw();

        if(!this.over) //if the game is not over, keep repeating
            requestAnimationFrame(pong.loop);
    },
    listen: function(){
        document.addEventListener('keydown',function(key){
            
            if(this.running === false){
                this.running = true;
                window.requestAnimationFrame(this.loop);
            }

            //keys for player 1
            if(key.keyCode === 38){
                pong.player1.move = DIRECTION.UP;
            }
            if(key.keyCode == 40){
                pong.player1.move = DIRECTION.DOWN;
            }

            //keys for player 2
            if(key.keyCode == 87){
                pong.player2.move = DIRECTION.UP;
            }
            if(key.keyCode == 83){
                pong.player2.move =  DIRECTION.DOWN;
            }
        });

        document.addEventListener('keyup',function(key){ 
            pong.player1.move = DIRECTION.IDLE
            pong.player2.move = DIRECTION.IDLE});
    },
	
	drawNum: function(num, x, y, tam){
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
