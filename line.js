//For calculations
function Line(x1, y1, x2, y2) {
	this.x1 = x1;
	this.y1 = y1;
	
	this.x2 = x2;
	this.y2 = y2;
	
	this.distance = function(){
		return Math.sqrt(Math.pow(this.x1-this.x2,2) + Math.pow(this.y1-this.y2,2));
	}
	
	var IsOnSegment = function (line, x, y) {
		return (line.x1 <= x || line.x2 <= x) && (x <= line.x1 || x <= line.x2) &&
         (line.y1 <= y || line.y2 <= y) && (y <= line.y1 || y <= line.y2);
	};

	var ComputeDirection = function (line, x, y) {
		var a = (x - line.x1) * (line.y2 - line.y1);
		var b = (line.x2 - line.x1) * (y - line.y1);
		return a < b ? -1 : a > b ? 1 : 0;
	};

	/** Do line segments (x1, y1)--(x2, y2) and (x3, y3)--(x4, y4) intersect? */
	this.isIntersected = function(line){
		var d1 = ComputeDirection(line, this.x1, this.y1);
		var d2 = ComputeDirection(line, this.x2, this.y2);
		var d3 = ComputeDirection(this, line.x1, line.y1);
		var d4 = ComputeDirection(this, line.x2, line.y2);
		return (((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) &&
          ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))) ||
         (d1 == 0 && IsOnSegment(line, this.x1, this.y1)) ||
         (d2 == 0 && IsOnSegment(line, this.x2, this.y2)) ||
         (d3 == 0 && IsOnSegment(this, line.x1, line.y1)) ||
         (d4 == 0 && IsOnSegment(this, line.x2, line.y2));
	};
}


//For display
function LineDivider(canvas, context, height, length) {
	var width = canvas.width;
	this.ctx = context;
	this.line = new Line(width, height, width+length, height);
	
	var minOffset = 100;
	var maxExtraPadding = 10;
	var intervalPadding = 10;
	
	this.draw = function() {
		this.ctx.beginPath();
		this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = '#003300';
		this.ctx.moveTo(this.line.x1,this.line.y1);
		this.ctx.lineTo(this.line.x2, this.line.y2);
		this.ctx.stroke();
	};
	
	var randomPad = intervalPadding*Random(maxExtraPadding); 
	
	//Updates line and if the line is off screen it returns true
	this.advance = function(speed){
		this.line.x1-=speed;
		this.line.x2-=speed;
		
		if (this.line.x2 + minOffset + randomPad < width){
			randomPad = intervalPadding*Random(maxExtraPadding); 
			return true;
		}
		
		return false;
	};
	
	this.offScreen = function(){
		return this.line.x2 < 0;
	};
}