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
    new: function(){
        return  
        //blablabla
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
        
    },
    draw: function(){
        //draw the objects 
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
}