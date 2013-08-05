function World(canvas, context) {
	this.canvas = canvas;
	this.ctx = context;
	var player = new Ball(this.ctx, "blue", 10, 10, 1);
	
	var NUM_LINES = 10; //Constant
	var LINE_BLOCK_HEIGHT = canvas.height/NUM_LINES;
	setSectionHeight(LINE_BLOCK_HEIGHT); //pass to ball module
	
	var WIDTH_VARIANCE = 10;
	var MIN_WIDTH = canvas.width/WIDTH_VARIANCE;
	
	var lines = [];
	
	var COLORS = ["blue", "red", "green", "yellow"];
	var enemies = [];
	
	var AddEnemy = function (){
		var color = COLORS[Random(COLORS.length)];
		var rSize = RandomSize();
		var diameter = SizeToDiameter(rSize);
		var rHeight = (diameter/2) + (Random(NUM_LINES)*LINE_BLOCK_HEIGHT) + (Random(LINE_BLOCK_HEIGHT - diameter));
		enemies.push(new Ball(this.ctx, color, canvas.width, rHeight, rSize))
	};
	
	var AddLine = function(array, rHeight, width){
		array.push(new LineDivider(this.canvas, this.ctx, rHeight, width));
	};
	
	/****************SETUP*************************/
	
	/* Adds the seed line dividers to the screen */
	
	for(var i = 0; i < NUM_LINES; i++){
		lines.push([]);
		AddLine(lines[i], (i+1)*LINE_BLOCK_HEIGHT, 0);
		lines[i][0].line.x1 = 0;
	}
	
	/*********************************************/
	
	/* Manage new enemies */
	
	var timeoutIDE;
	var newBallSpawn = 3000;
	var TimeEnemy = function(){
		AddEnemy();
		timeoutIDE = setTimeout(TimeEnemy, newBallSpawn);
	}
	
	timeoutIDE = setTimeout(TimeEnemy, newBallSpawn);
	
	/*********************************************/
	
	/* Manage world speed */
	var speed = 5;
	var updateLineInterval = 10*1000; //can vary function of Interval
	var timeoutIDSp;
	var LineSpeed = function(){
		//speed+=3; //The speed up
		timeoutIDSp = setTimeout(LineSpeed, updateLineInterval);
	}
	
	timeoutIDSp = setTimeout(LineSpeed, updateLineInterval);
	
	/*********************************************/
	
	/* Manage score update */
	var label = document.getElementById("score");
	var currScore = 0;
	var updateScoreInterval = 1000; //every second
	var timeoutIDS;
	var UpdateScore = function(){
		currScore += player.size;
		label.innerHTML = "Score: " + currScore;
		timeoutIDS = setTimeout(UpdateScore, updateScoreInterval);
	}
	
	timeoutIDS = setTimeout(UpdateScore, updateScoreInterval);
	
	/*********************************************/
	
	var gameOver = false;
	
	/****************END SETUP*********************/
	
	
	var UpdateLines = function(){
		for(var i = 0; i < lines.length; i++){
			for (var j = 0; j < lines[i].length; j++){
				var newLine = lines[i][j].advance(speed); //game logic for speed
				if (player.insideBall(lines[i][j].line.x1, lines[i][j].line.y1)){
					player.x-= speed
				}
		
				if (j == lines[i].length-1 && newLine){
					AddLine(lines[i], lines[i][j].line.y1,  MIN_WIDTH*Random(WIDTH_VARIANCE-1)); //becomes new last line
				}
			
				if (lines[i][j].offScreen()){
					lines[i].splice(j, 1);
					j--;
				}
			}
		}
	};
	
	var UpdateEnemies = function(){
		for(var i = 0; i < enemies.length; i++){
			enemies[i].advance(speed);
			
			var prevSize = player.size;
			if (player.collision(enemies[i])){
				if (prevSize == 1 && player.size == 1){
					window.clearTimeout(timeoutIDS);
					window.clearTimeout(timeoutIDSp);
					window.clearTimeout(timeoutIDE);
					gameOver = true;
				}
				enemies.splice(i, 1);
				i--;
			}
			else if (enemies[i].offScreen()) {
				AddEnemy();
				enemies.splice(i, 1);
				i--;
			}
		}
	}
	
	var updateWorld = function(){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		if (!gameOver){	
			UpdateLines();
			UpdateEnemies();
			
		} else{
			//Game Over screen
		}
		
		world.draw(); //uses world in html file
	};
	
	this.draw = function() {
		player.draw();
		for(var i = 0; i < lines.length; i++){
			for(var j = 0; j < lines[i].length; j++){
				lines[i][j].draw();
			}
		}
			
		for(var i = 0; i < enemies.length; i++){
			enemies[i].draw();
		}
			
		requestAnimFrame(updateWorld);
	};
	
	this.directionMovePlayer = function(deltaX, deltaY){
		this.movePlayerTo(player.x+deltaX, player.y+deltaY);
	};
	
	this.movePlayerTo = function(x, y){
		if (canMoveTo(x, y)){
			player.x = x;
			player.y = y;
		}
	};
	
	var canMoveTo = function (x, y){	
		if (x < 0 || x > canvas.width || y < 0 || y > canvas.height)
			return false;

		var topVector = new Line(player.x, player.y, x, y-player.diameter());
		var botVector = new Line(player.x, player.y, x, y);

		for(var i = 0; i < lines.length; i++){
			for(var j = 0; j < lines[i].length; j++){
				var line = lines[i][j].line;
				if(line.isIntersected(topVector) || line.isIntersected(botVector) ){
					return false;
				}
			}
		}
		
		return true;
	}
}