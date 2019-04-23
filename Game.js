//Global variables


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
		this.width = 50;
		this.height = 50;
		this.x = 0;
		this.y = 0;
		this.moveX = DIRECTION.IDLE;
		this.moveY = DIRECTION.IDLE; 
		this.speed = speed || 10;
        return 
    }
}

var Player = {
    new: function(side){
        return
            this.width = 30;
            this.height = 200;
            this.x = side === 'left' ? width : width - (2 * width);
            this.y = (canvas.width / 2) - (height / 2);
            this.speed = 10;
            this.score = 0;
            this.move = DIRECTION.IDLE;
    }
}

var Game = {
    initialize: function(){
        //initialize everything that needs to appear when the game is initialized
        this.canvas = document.querySelector('canvas');
        this.context = canvas.getContext('2d'); 
        
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.player1 = Player.new.call(this,'left');
        this.player2 = Player.new.call(this,'right');

        this.running = this.over = false;

        this.ball = Ball.new.call(this);

        Game.listen();
    },
    update: function(){
        //update 
		if(!this.over)
		{
			//Ball movement
			if (this.ball.x <= 0) 
			{
				this.player2.score+=1;
				this.ball.x = this.canvas.width/2;
				this.ball.y = this.canvas.height/2;
				ball.moveX = DIRECTION.LEFT;
			}
			if (this.ball.x >= this.canvas.width - this.ball.width)
			{
				this.player1.score+=1;
				this.ball.x = this.canvas.width/2;
				this.ball.y = this.canvas.height/2;
				ball.moveX = DIRECTION.RIGHT;
			}
			
			if (this.ball.y <= 0) this.ball.moveY = DIRECTION.DOWN;
			if (this.ball.y >= this.canvas.height - this.ball.height) this.ball.moveY = DIRECTION.UP;
			
			//Move ball
			if (this.ball.moveY === DIRECTION.UP) this.ball.y -= (this.ball.speed / 1.5);
			else if (this.ball.moveY === DIRECTION.DOWN) this.ball.y += (this.ball.speed / 1.5);
			if (this.ball.moveX === DIRECTION.LEFT) this.ball.x -= this.ball.speed;
			else if (this.ball.moveX === DIRECTION.RIGHT) this.ball.x += this.ball.speed;
			
			//Player movement
			if (this.player1.move === DIRECTION.UP) this.player.y -= this.player.speed;
			else if (this.player1.move === DIRECTION.DOWN) this.player.y += this.player.speed;
			
			if (this.player2.move === DIRECTION.UP) this.player.y -= this.player.speed;
			else if (this.player2.move === DIRECTION.DOWN) this.player.y += this.player.speed;
			
			//Player movement limit
			if (this.player1.y <= 0) this.player1.y = 0;
			else if (this.player1.y >= (this.canvas.height - this.player1.height)) this.player1.y = (this.canvas.height - this.player1.height);
			if (this.player2.y <= 0) this.player2.y = 0;
			else if (this.player2.y >= (this.canvas.height - this.player2.height)) this.player2.y = (this.canvas.height - this.player2.height);
			
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
					this.ball.x = (this.player2.x + this.ball.width);
					this.ball.moveX = DIRECTION.RIGHT;
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
		this.context.clearRect(0, 0, canvas.width, canvas.height);
		this.context.fillStyle = '000000';
		this.context.fillRect(0, 0, canvas.width, canvas.height);
		this.context.fillStyle = 'ffffff';
		this.context.fillRect(this.player1.x, this.player1.y, this.player1.width, this.player1.height);
		this.context.fillRect(this.player2.x, this.player2.y, this.player2.width, this.player2.height);
		this.context.fillRect(this.ball.x, this.ball.y, this.ball.width, this.ball.height);
		
		for(var i=0; i<iniH ; i+= 25)
			c.fillRect(canvas.width/2, i, 25, 25);
		
		drawNum(pontoP1, canvas.width/2 - 3*25, 25, 15);
		drawNum(pontoP2, canvas.width/2 + 2*25, 25, 15);
    },
    loop: function(){
        Game.update();
        Game.draw();

        if(!Game.over) //if the game is not over, keep repeating
            requestAnimationFrame(Game.loop);
    },
    listen: function(){
        document.addEventListener('keydown',function(key){
            
            if(Game.running === false){
                Game.running = true;
                window.requestAnimationFrame(Game.loop);
            }

            //keys for player 1
            if(key.keyCode === 38){
                Game.player1.move = DIRECTION.UP;
            }
            if(key.keyCode == 40){
                Game.player1.move = DIRECTION.DOWN;
            }

            //keys for player 2
            if(key.keyCode == 87){
                Game.player2.move = DIRECTION.UP;
            }
            if(key.keyCode == 83){
                Game.player2.move =  DIRECTION.DOWN;
            }
        });

        document.addEventListener('keyup',function(key){ 
            Game.player1.move = DIRECTION.IDLE
            Game.player2.move = DIRECTION.IDLE});
    }
	
	drawNum: function(num, x, y, tam){
		switch(num){
		case 0:
			for(var i=y; i < y+5*tam; i+=tam)
			{
				c.fillRect(x, i, tam, tam);
				c.fillRect(x+2*tam, i, tam, tam);
			}
			c.fillRect(x+tam, y, tam, tam);
			c.fillRect(x+tam, y+4*tam, tam, tam);
			break;
		case 1:
			for(var i=y; i < y+5*tam; i+=tam)
				c.fillRect(x+2*tam, i, tam, tam);
			c.fillRect(x+tam, y, tam, tam);
			break;
		case 2:
			for(var i=x; i < x+3*tam; i+=tam)
			{
				c.fillRect(i, y, tam, tam);
				c.fillRect(i, y+2*tam, tam, tam);
				c.fillRect(i, y+4*tam, tam, tam);
			}
			c.fillRect(x+2*tam, y+tam, tam, tam);
			c.fillRect(x,y+3*tam, tam, tam);
			break;
		case 3:
			for(var i=x; i < x+3*tam; i+=tam)
			{
				c.fillRect(i, y, tam, tam);
				c.fillRect(i, y+2*tam, tam, tam);
				c.fillRect(i, y+4*tam, tam, tam);
			}
			c.fillRect(x+2*tam, y+tam, tam, tam);
			c.fillRect(x+2*tam,y+3*tam, tam, tam);
			break;
		case 4:
			for(var i=y; i < y+5*tam; i+=tam)
				c.fillRect(x+2*tam, i, tam, tam);
			for(var i=y; i < y+3*tam; i+=tam)
				c.fillRect(x, i, tam, tam);
			c.fillRect(x+tam, y+2*tam, tam, tam);
			break;
		case 5:
			for(var i=x; i < x+3*tam; i+=tam)
			{
				c.fillRect(i, y, tam, tam);
				c.fillRect(i, y+2*tam, tam, tam);
				c.fillRect(i, y+4*tam, tam, tam);
			}
			c.fillRect(x, y+tam, tam, tam);
			c.fillRect(x+2*tam,y+3*tam, tam, tam);
			break;
		case 6:
			for(var i=x; i < x+3*tam; i+=tam)
			{
				c.fillRect(i, y, tam, tam);
				c.fillRect(i, y+2*tam, tam, tam);
				c.fillRect(i, y+4*tam, tam, tam);
			}
			c.fillRect(x, y+tam, tam, tam);
			c.fillRect(x, y+3*tam, tam, tam);
			c.fillRect(x+2*tam,y+3*tam, tam, tam);
			break;
		case 7:
			for(var i=x; i < x+3*tam; i+=tam)
				c.fillRect(i, y, tam, tam);
			c.fillRect(x+2*tam, y+tam, tam, tam);
			for(var i=y+2*tam; i < y+5*tam; i+=tam)
				c.fillRect(x+tam, i, tam, tam);
			break;
		case 8:
			for(var i=x; i < x+3*tam; i+=tam)
			{
				c.fillRect(i, y, tam, tam);
				c.fillRect(i, y+2*tam, tam, tam);
				c.fillRect(i, y+4*tam, tam, tam);
			}
			c.fillRect(x, y+tam, tam, tam);
			c.fillRect(x+2*tam, y+tam, tam, tam);
			c.fillRect(x, y+3*tam, tam, tam);
			c.fillRect(x+2*tam, y+3*tam, tam, tam);
			
			break;
		case 9:
			for(var i=x; i < x+3*tam; i+=tam)
			{
				c.fillRect(i, y, tam, tam);
				c.fillRect(i, y+2*tam, tam, tam);
				c.fillRect(i, y+4*tam, tam, tam);
			}
			c.fillRect(x, y+tam, tam, tam);
			c.fillRect(x+2*tam, y+tam, tam, tam);
			c.fillRect(x+2*tam, y+3*tam, tam, tam);
			break;
		}
	
	}
}