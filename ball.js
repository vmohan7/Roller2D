var MAX_SIZE = 10;

function Ball(context, color, centerX, centerY, size) {
	this.ctx = context;
	this.color = color;
	this.x = centerX;
	this.y = centerY;
	this.size = size; //currently size is the radius; may need to change later

	this.radius = function(){
		return (this.diameter()/2);
	}

	this.diameter = function(){ 
		return SizeToDiameter(this.size);
	};

	this.boundingBox = {
		min: {x: this.x, y: this.y},
		max: {x: this.x-(this.radius()), y: this.y-(this.radius())} 
	}
	
	this.draw = function() {
		this.ctx.beginPath();
			
    	this.ctx.arc(this.x, this.y, this.radius(), 0, 2 * Math.PI, false);
    	this.ctx.fillStyle = color;
    	this.ctx.fill();
    	this.ctx.lineWidth = 1;
      	this.ctx.strokeStyle = '#003300';
      	this.ctx.stroke();
	};
	
	this.insideBall = function(x, y){
		return (Math.pow(x-this.x, 2) + Math.pow(y-this.y, 2)) < Math.pow(this.radius(), 2);
	}
	
	this.advance = function(speed){
		this.x-=speed;
	}
	
	this.offScreen = function(speed){
		return (this.x-this.radius()) < 0;
	}

	var onCollision = function(player, ball){
		if (player.color == ball.color){
			if (player.size < MAX_SIZE) player.size++;
		} else{
			if (player.size > 1) player.size--;
		}
	};

	this.collision = function(ball){
		var other = ball.radius();
		var mine = this.radius();
		
		var line = new Line(this.x, this.y, ball.x, ball.y);
		
		if (line.distance() <= (other + mine)){
			onCollision(this, ball);
			return true;
		}
		
		return false;
	}
	
};

var SectionHeight; //Set by world
function setSectionHeight(height){
	SectionHeight = height;
} 

function SizeToDiameter(size){
	return size*((SectionHeight*.75)/MAX_SIZE);
}

function RandomSize(){
	return Random(MAX_SIZE) + 1;
}