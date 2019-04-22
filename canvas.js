function Point(x, y, isCircle){
	this.x = x;
	this.y = y;
	this.tolerance = 4;
	this.showHighLight = false;
	this.showBoundingBox = false;
	
	if(typeof(isCircle) !== "undefined" && isCircle){
		this.isCircle = isCircle
	}
	else{
		 this.isCircle = false;
	}
	return this;
}

Point.prototype.Draw = function(canvas, isReDraw){
	
	canvas.context().beginPath();
	if(this.isCircle){
		canvas.context().strokeStyle="Black";
		canvas.context().arc(this.x, this.y, 1, 0, 2*Math.PI, true);
		canvas.context().stroke();
	}
	else{
		canvas.context().strokeStyle="Black";
		canvas.context().fillRect(this.x-1,this.y-1,2,2);
	}
	canvas.context().closePath();
	
	if(this.showHighLight){
		canvas.context().beginPath();
		canvas.context().strokeStyle="DodgerBlue";
		canvas.context().rect(this.x-2,this.y-2,this.tolerance,this.tolerance);
		canvas.context().stroke();
	}
	
	if(this.showBoundingBox){
		
		var boundingPoints = this.GetBoundingBox();
		canvas.context().beginPath();
		canvas.context().strokeStyle="Black";
		canvas.context().setLineDash([5, 15]);
		canvas.context().moveTo(boundingPoints[0].x, boundingPoints[0].y);
		for(var i = 1; i<boundingPoints.length; i++){
			canvas.context().lineTo(boundingPoints[i].x, boundingPoints[i].y);
		}
		canvas.context().closePath();
		canvas.context().stroke();
		canvas.context().setLineDash([]);
	}

	if(!(typeof(isReDraw) !== "undefined" && isReDraw))
		canvas.objects.push(this);
}

Point.prototype.GetBoundingBox = function (){
	return [new Point(this.x, this.y), new Point(this.x, this.y), new Point(this.x, this.y), new Point(this.x, this.y)]
}

Point.prototype.GetQuad = function (point){
	
	var boundingPoints = this.GetBoundingBox();
	
	if(point.x > boundingPoints[2].x && point.y < boundingPoints[2].y && point.y > boundingPoints[0].y) return 1;
	if(point.y < boundingPoints[2].y && point.x < boundingPoints[2].x && point.x > boundingPoints[0].x) return 2;
	if(point.x < boundingPoints[0].x && point.y < boundingPoints[2].y && point.y > boundingPoints[0].y) return 3;
	if(point.y > boundingPoints[0].y && point.x < boundingPoints[2].x && point.x > boundingPoints[0].x) return 4;
}

Point.prototype.isSelect = function(point){
	if((this.x - this.tolerance < point.x && point.x <= this.x + this.tolerance) &&
		(this.y - this.tolerance < point.y && point.y <= this.y + this.tolerance))
		return true;
	return false;
}

Point.prototype.MirrorTo = function (){ return; }

Point.prototype.Rotate = function (){ return; }

Point.prototype.Scale = function (){ return; }

Point.prototype.Translate = function (x, y){
	this.x = this.x + x;
	this.y = this.y + y;
}

Point.prototype.ToString = function(){
	return "POINT " + this.x + " " + this.y +"%0D%0A";
}

function Line(pointI, pointF){
	this.tolerance = 4;
	this.pointI = pointI;
	this.pointF = pointF;
	this.showHighLight = false;
	this.showBoundingBox = false;
	return this;
}

Line.prototype.Draw = function(canvas, isReDraw){
	
	if(this.showHighLight){
		canvas.context().beginPath();
		canvas.context().strokeStyle="DodgerBlue";
		canvas.context().lineWidth=this.tolerance;
		canvas.context().moveTo(this.pointI.x, this.pointI.y);
		canvas.context().lineTo(this.pointF.x, this.pointF.y);
		canvas.context().stroke();
		canvas.context().closePath();
		canvas.context().lineWidth=1;
	}
	
	if(this.showBoundingBox){
		
		var boundingPoints = this.GetBoundingBox();
		canvas.context().beginPath();
		canvas.context().strokeStyle="Black";
		canvas.context().setLineDash([5, 15]);
		canvas.context().moveTo(boundingPoints[0].x, boundingPoints[0].y);
		for(var i = 1; i<boundingPoints.length; i++){
			canvas.context().lineTo(boundingPoints[i].x, boundingPoints[i].y);
		}
		canvas.context().closePath();
		canvas.context().stroke();
		canvas.context().setLineDash([]);
	}
	
	canvas.context().beginPath();
	canvas.context().strokeStyle="Black";
	canvas.context().moveTo(this.pointI.x, this.pointI.y);
	canvas.context().lineTo(this.pointF.x, this.pointF.y);
	canvas.context().stroke();
	canvas.context().closePath();
	
	
	if(!(typeof(isReDraw) !== "undefined" && isReDraw))
		canvas.objects.push(this);
}

Line.prototype.Distance = function (point){
	return Math.abs((point.y - this.pointI.y) * (this.pointF.x - this.pointI.x) -
					(this.pointF.y - this.pointI.y) * (this.pointI.x - point.x));
}

Line.prototype.GetBoundingBox = function(){
	var left;
	var right;
	var up;
	var down;
	
	if(this.pointI.x > this.pointF.x){
		right = this.pointI.x;
		left = this.pointF.x;
	}
	else{
		right = this.pointF.x;
		left = this.pointI.x;
	}
	
	if(this.pointI.y > this.pointF.y){
		down = this.pointI.y;
		up = this.pointF.y;
	}
	else{
		down = this.pointF.y;
		up = this.pointI.y;
	}
	
	return [new Point(left, up), new Point(left, down), new Point(right, down), new Point(right, up)]
}

Line.prototype.GetQuad = function (point){
	
	var boundingPoints = this.GetBoundingBox();
	
	if(point.x > boundingPoints[2].x && point.y < boundingPoints[2].y && point.y > boundingPoints[0].y) return 1;
	if(point.y < boundingPoints[2].y && point.x < boundingPoints[2].x && point.x > boundingPoints[0].x) return 2;
	if(point.x < boundingPoints[0].x && point.y < boundingPoints[2].y && point.y > boundingPoints[0].y) return 3;
	if(point.y > boundingPoints[0].y && point.x < boundingPoints[2].x && point.x > boundingPoints[0].x) return 4;
}

Line.prototype.MirrorTo = function(quad){ 
	var minXPoint, maxXPoint, minYPoint, maxYPoint;
	
	if(this.pointI.x < this.pointF.x){
		maxXPoint = this.pointF;
		minXPoint = this.pointI;
	}else if(this.pointI.x > this.pointF.x){
		maxXPoint = this.pointI;
		minXPoint = this.pointF;
	}
	if(this.pointI.y < this.pointF.y){
		maxYPoint = this.pointI;
		minYPoint = this.pointF;
	}else if(this.pointI.y > this.pointF.y){
		maxYPoint = this.pointF;
		minYPoint = this.pointI;
	}
	
	switch (quad){
		case 1:{
			var distX = maxXPoint.x - minXPoint.x;
			if(this.pointI != maxXPoint) this.pointI.x += distX * 2;
			if(this.pointF != maxXPoint) this.pointF.x += distX * 2;
		}
		case 2:{
			var distY = minYPoint.y - maxYPoint.y;
			if(this.pointI != maxYPoint) this.pointI.y -= distY * 2;
			if(this.pointF != maxYPoint) this.pointF.y -= distY * 2;
			break;
		}
		case 3:{
			var distX = maxXPoint.x - minXPoint.x;
			if(this.pointI != minYPoint) this.pointI.x -= distX * 2;
			if(this.pointF != minXPoint) this.pointF.x -= distX * 2;
			break;
		}
		case 4:{
			var distY = minYPoint.y - maxYPoint.y;
			if(this.pointI != minYPoint) this.pointI.y += distY * 2;
			if(this.pointF != minYPoint)this.pointF.y += distY * 2;
			break;
		}
	}
}

Line.prototype.isSelect = function(point){
	
	var angular = (this.pointF.y - this.pointI.y) / (this.pointF.x - this.pointI.x);
	var b = this.pointI.y - angular * this.pointI.x;
	
	var calc = angular * point.x - point.y + b;

	if(-this.tolerance < calc && calc <= this.tolerance) {
		 return true;
	}
	return false;

}

Line.prototype.Rotate = function(sin, cos, point){
	var points = [this.pointI,this.pointF]
	for (var i = 0 ; i < points.length;i++){
		points[i].x += point.x*-1
		points[i].y += point.y*-1
		points[i].x = ((cos*points[i].x) - (sin*points[i].y));
		points[i].y = ((sin*points[i].x) + (cos*points[i].y));
		points[i].x += point.x
		points[i].y += point.y
	}
}

Line.prototype.Scale = function (x, y){
	this.pointI.x *= x;
	this.pointI.y *= x;
	this.pointF.x *= y;
	this.pointF.y *= y;	
}

Line.prototype.Side = function (point){
	var distance = this.Distance(point);
	
	if (distance > 0)
        return 1;
    if (distance < 0)
        return -1;
    return 0;
}

Line.prototype.Translate = function (x, y){
	this.pointI.Translate(x,y);
	this.pointF.Translate(x,y);
}

Line.prototype.ToString = function(){
	return "LINE " + this.pointI.x + " " + this.pointI.y + " " + this.pointF.x + " " + this.pointF.y + "%0D%0A";
}

function Polygon(points){
	this.points = points;
	this.showHighLight = false;
	this.showBoundingBox = false;
	
}

Polygon.prototype.ConvexHull = function(){
	var result = [];
	
	var minX = 0
	var maxX = 0;
	
    for (var i=1; i<this.points.length; i++)
    {
        if (this.points[i].x < this.points[minX].x)
            minX = i;
        if (this.points[i].x > this.points[maxX].x)
            maxX = i;
    }
	
	//Algoritmo de Fecho Convexo
	function QuickHull(points, point1, point2, side){
		var indice = -1;
		var maxDist = 0
		
		for (var i=0; i<points.length; i++)
		{
			var line = new Line(point1, point2);
			var aux = line.Distance(points[i])
			if (line.Side(points[i]) == side && aux > maxDist)
			{
				indice = i;
				maxDist = aux;
			}
		}
		
		if(indice == -1){
			if(!result.includes(point1)) result.push(point1);
			if(!result.includes(point2)) result.push(point2);
			return;
		}
		var side = new Line(points[indice], point1).Side(point2);
		QuickHull(points, points[indice], point1, -side);
		side = new Line(points[indice], point2).Side(point1);
		QuickHull(points, points[indice], point2, -side);
	}
	
	QuickHull(this.points, this.points[minX], this.points[maxX], 1);
	QuickHull(this.points, this.points[minX], this.points[maxX], -1);
	return result;
}

Polygon.prototype.Draw = function (canvas, isReDraw){
	
	canvas.context().beginPath();
	canvas.context().strokeStyle="Black";
	canvas.context().moveTo(this.points[0].x, this.points[0].y);
	for(var i = 1; i<this.points.length; i++){
		canvas.context().lineTo(this.points[i].x, this.points[i].y);
	}
	canvas.context().closePath();
	canvas.context().stroke();
	
	
	if(this.showHighLight){
		canvas.context().beginPath();
		canvas.context().strokeStyle="DodgerBlue";
		canvas.context().lineWidth = 3;
		canvas.context().moveTo(this.points[0].x, this.points[0].y);
		for(var i = 1; i<this.points.length; i++){
			canvas.context().lineTo(this.points[i].x, this.points[i].y);
		}
		canvas.context().closePath();
		canvas.context().stroke();
		canvas.context().lineWidth=1;
		canvas.context().strokeStyle="Black";
	}
	
	if(this.showBoundingBox){
		
		var boundingPoints = this.GetBoundingBox();
		canvas.context().beginPath();
		canvas.context().strokeStyle="Black";
		canvas.context().setLineDash([5, 15]);
		canvas.context().moveTo(boundingPoints[0].x, boundingPoints[0].y);
		for(var i = 1; i<boundingPoints.length; i++){
			canvas.context().lineTo(boundingPoints[i].x, boundingPoints[i].y);
		}
		canvas.context().closePath();
		canvas.context().stroke();
		canvas.context().setLineDash([]);
		
		//Fecho
		var convex = this.ConvexHull();
		canvas.context().beginPath();
		canvas.context().strokeStyle="Red";
		canvas.context().moveTo(convex[0].x, convex[0].y);
		for(var i = 1; i<convex.length; i++){
			canvas.context().lineTo(convex[i].x, convex[i].y);
		}
		canvas.context().closePath();
		canvas.context().stroke();
		canvas.context().strokeStyle="Black";
	}
	
	if(!(typeof(isReDraw) !== "undefined" && isReDraw))
		canvas.objects.push(this);
	
}

Polygon.prototype.GetBoundingBox = function(){
	var left = this.points[0].x;
	var right = this.points[0].x;;
	var up = this.points[0].y;;
	var down = this.points[0].y;
	
	for(var i = 1; i<this.points.length; i++){
		if(left > this.points[i].x)
			left = this.points[i].x;
		if(right < this.points[i].x)
			right = this.points[i].x;
		if(up > this.points[i].y)
			up = this.points[i].y;
		if(down < this.points[i].y)
			down = this.points[i].y;
	}
	
	return [new Point(left, up), new Point(left, down), new Point(right, down), new Point(right, up)]
}

Polygon.prototype.GetQuad= function (point){
	
	var boundingPoints = this.GetBoundingBox();
	
	if(point.x > boundingPoints[2].x && point.y < boundingPoints[2].y && point.y > boundingPoints[0].y) return 1;
	if(point.y < boundingPoints[2].y && point.x < boundingPoints[2].x && point.x > boundingPoints[0].x) return 2;
	if(point.x < boundingPoints[0].x && point.y < boundingPoints[2].y && point.y > boundingPoints[0].y) return 3;
	if(point.y > boundingPoints[0].y && point.x < boundingPoints[2].x && point.x > boundingPoints[0].x) return 4;

}

Polygon.prototype.isSelect = function (point){
	
	//Se toca nos verticies
	for (var i = 0;i<this.points.length;i++)
		if(this.points[i].isSelect(point)) return true;
	
	var count = 0;
	
	for(var i = 0; i<this.points.length-1; i++){
		var pointI, pointF

		if(this.points[i].y < this.points[i+1].y){
			pointI = this.points[i];
			pointF = this.points[i + 1];
		}
		else{
			pointI = this.points[i + 1];
			pointF = this.points[i];
		}

		if(point.y > pointI.y && point.y < pointF.y && (point.x > pointI.x || point.x > pointF.x)){
			if((point.x < pointI.x && point.x < pointF.x)){
				count += 1;
			}
			else{
				var delta = pointI.x - pointF.x;
				var xc = pointI.x;
				if(delta != 0){
					xc += ( point.y - pointI.y ) * delta / ( pointI.y - pointF.y );
				}
				if(point.x > xc){
					count += 1
				}
			}
		}
	}

	if(this.points[this.points.length-1].y < this.points[0].y){
			pointI = this.points[this.points.length-1];
			pointF = this.points[0];
	}
	else{
		pointI = this.points[0];
		pointF = this.points[this.points.length-1];
	}

	if(point.y > pointI.y && point.y < pointF.y && (point.x > pointI.x || point.x > pointF.x)){
		if((point.x < pointI.x && point.x < pointF.x))
		{
			count += 1;
		}
		else{
			var delta = pointI.x - pointF.x;
			var xc = pointI.x;
			
			if(delta != 0){
				xc += ( point.y - pointI.y ) * delta / ( pointI.y - pointF.y );
			}
			
			if(point.x > xc){
				count += 1
			}
		}
	}
	if(count%2 == 1)
		return true;
	return false;
}

Polygon.prototype.MirrorTo = function(quad){ 
	switch (quad){
		case 1:{
			var maxPoint = this.points[0];
			for(var i = 1; i < this.points.length; i++){
				if(this.points[i].x > maxPoint.x){
					maxPoint = this.points[i];
				}
			}
			for(var i = 0; i < this.points.length; i++){
				var dist = maxPoint.x - this.points[i].x;
				this.points[i].x += dist * 2;
			}
			break;
		}
		case 2:{
			var maxPoint = this.points[0];
			for(var i = 1; i < this.points.length; i++){
				if(this.points[i].y < maxPoint.y){
					maxPoint = this.points[i];
				}
			}
			for(var i = 0; i < this.points.length; i++){
				var distY = this.points[i].y - maxPoint.y;
				this.points[i].y -= distY * 2;
			}
			break;
		}
		case 3:{
			var minPoint = this.points[0];
			for(var i = 1; i < this.points.length; i++){
				if(this.points[i].x < minPoint.x){
					minPoint = this.points[i];
				}
			}
			for(var i = 0; i < this.points.length; i++){
				var distX = this.points[i].x - minPoint.x;
				this.points[i].x -= distX * 2;
			}
			break;
		}
		case 4:{
			var minPoint = this.points[0];
			for(var i = 1; i < this.points.length; i++){
				if(this.points[i].y > minPoint.y){
					minPoint = this.points[i];
				}
			}
			for(var i = 0; i < this.points.length; i++){
				var distY = minPoint.y - this.points[i].y;
				this.points[i].y += distY * 2;
			}
			break;
		}
	}
}

Polygon.prototype.Rotate = function(sin, cos, point){
	for (var i = 0 ; i < this.points.length;i++){
		this.points[i].x -= point.x
		this.points[i].y -= point.y
		this.points[i].x = ((cos*this.points[i].x) - (sin*this.points[i].y));
		this.points[i].y = ((sin*this.points[i].x) + (cos*this.points[i].y));
		this.points[i].x += point.x
		this.points[i].y += point.y
	}
}

Polygon.prototype.Scale = function (x, y){
	for(var i = 0; i<this.points.length; i++){
		this.points[i].x *= x;
		this.points[i].y *= y;
	}
}

Polygon.prototype.Translate = function (x, y){
	for(var i = 0; i<this.points.length; i++){
		this.points[i].Translate(x,y);
	}
}

Polygon.prototype.ToString = function(){
	var string = "POLYGON";
	for(var i = 0; i < this.points.length; i++){
		var points = " " + this.points[i].x + " " + this.points[i].y;
		string = string.concat(points);
	}
	return string.concat("%0D%0A");
}

function Arc(point, radius, startAngle, finishAngle){
	this.startAngle = startAngle;
	this.finishAngle = finishAngle;
	this.point = point;
	this.radius = radius;
	this.showHighLight = false;
	this.showBoundingBox = false;
	this.tolerance = 10;
}

Arc.prototype.Draw = function (canvas, isReDraw){
	canvas.context().beginPath();
	if(this.showHighLight){
		canvas.context().strokeStyle="DodgerBlue";
		canvas.context().lineWidth = 3;
	}
	canvas.context().arc(this.point.x, this.point.y, this.radius, this.startAngle, this.finishAngle, true);
	canvas.context().stroke();
	
	if(this.showHighLight){
		canvas.context().lineWidth=1;
		canvas.context().strokeStyle="Black";
	}
	
	if(this.showBoundingBox){
		
		var boundingPoints = this.GetBoundingBox();
		canvas.context().beginPath();
		canvas.context().strokeStyle="Black";
		canvas.context().setLineDash([5, 15]);
		canvas.context().moveTo(boundingPoints[0].x, boundingPoints[0].y);
		for(var i = 1; i<boundingPoints.length; i++){
			canvas.context().lineTo(boundingPoints[i].x, boundingPoints[i].y);
		}
		canvas.context().closePath();
		canvas.context().stroke();
		canvas.context().setLineDash([]);
	}
	
	if(!(typeof(isReDraw) !== "undefined" && isReDraw))
		canvas.objects.push(this);
}

Arc.prototype.GetBoundingBox = function(){
	var left = this.point.x - this.radius;
	var right = this.point.x + this.radius;
	var up = this.point.y - this.radius;
	var down = this.point.y + this.radius;
	
	return [new Point(left, up), new Point(left, down), new Point(right, down), new Point(right, up)]
}

Arc.prototype.GetQuad = function (point){
	
	var boundingPoints = this.GetBoundingBox();
	
	if(point.x > boundingPoints[2].x && point.y < boundingPoints[2].y && point.y > boundingPoints[0].y) return 1;
	if(point.y < boundingPoints[2].y && point.x < boundingPoints[2].x && point.x > boundingPoints[0].x) return 2;
	if(point.x < boundingPoints[0].x && point.y < boundingPoints[2].y && point.y > boundingPoints[0].y) return 3;
	if(point.y > boundingPoints[0].y && point.x < boundingPoints[2].x && point.x > boundingPoints[0].x) return 4;
}

Arc.prototype.isSelect = function (point){
	var distance = Math.sqrt(Math.pow(point.x - this.point.x, 2) + Math.pow(point.y - this.point.y, 2));
	if(distance > this.radius- this.tolerance && distance < this.radius + this.tolerance){
		return true;
	}
	return false;
}

Arc.prototype.MirrorTo = function (quad){
	
	switch (quad){
		case 2:
		case 4:{
			var aux = this.startAngle * -1;
			this.startAngle = this.finishAngle * -1;
			this.finishAngle = aux;
			break;
		}
		case 1:
		case 3:{
			var aux = this.startAngle
			this.startAngle = Math.PI - this.finishAngle;
			this.finishAngle = Math.PI - aux;
			break;
		}

	}	
	switch (quad){
		case 1: this.point.x += this.radius*2; break;
		case 2: this.point.y -= this.radius*2; break;
		case 3: this.point.x -= this.radius*2; break;
		case 4: this.point.y += this.radius*2; break;
	}

}

Arc.prototype.Rotate = function () { return; }

Arc.prototype.Scale = function (radius){
	this.radius *= radius;
}

Arc.prototype.Translate = function (x, y){
	this.point.x = this.point.x + x;
	this.point.y = this.point.y + y;
}

Arc.prototype.ToString = function(){
	return "ARC " + this.point.x + " " + this.point.y + " " + this.radius + " " + this.startAngle + " " + this.finishAngle +"%0D%0A";
}

function Bezier(line, controlPoint1, controlPoint2){
	this.line = line;
	this.controlPoint1 = controlPoint1;
	this.controlPoint2 = controlPoint2;
	this.showHighLight = false;
	this.showBoundingBox = false;
	return this;
}

Bezier.prototype.Draw = function(canvas, isReDraw){
	
	canvas.context().beginPath();
	if(this.showHighLight){
		canvas.context().strokeStyle="DodgerBlue";
		canvas.context().lineWidth = 3;
	}
	canvas.context().moveTo(this.line.pointI.x,this.line.pointI.y);
	canvas.context().bezierCurveTo(this.controlPoint1.x,this.controlPoint1.y,this.controlPoint2.x,this.controlPoint2.y,this.line.pointF.x,this.line.pointF.y);
	canvas.context().stroke();
	if(this.showHighLight){
		canvas.context().lineWidth=1;
		canvas.context().strokeStyle="Black";
	}
	
	if(this.showBoundingBox){
		
		var boundingPoints = this.GetBoundingBox();
		canvas.context().beginPath();
		canvas.context().strokeStyle="Black";
		canvas.context().setLineDash([5, 15]);
		canvas.context().moveTo(boundingPoints[0].x, boundingPoints[0].y);
		for(var i = 1; i<boundingPoints.length; i++){
			canvas.context().lineTo(boundingPoints[i].x, boundingPoints[i].y);
		}
		canvas.context().closePath();
		canvas.context().stroke();
		canvas.context().setLineDash([]);
	}
	
	if(!(typeof(isReDraw) !== "undefined" && isReDraw))
		canvas.objects.push(this);
}

Bezier.prototype.GetBoundingBox = function(){
	var left;
	var right;
	var up;
	var down;
	
	var px, py, qx, qy, rx, ry, sx, sy, tx, ty;
    var tobx, toby, tocx, tocy, todx, tody, toqx, toqy, torx, tory, totx, toty;
    var x, y, left, up, right, down;
    
    left = up = Number.POSITIVE_INFINITY;
    right = down = Number.NEGATIVE_INFINITY;
    
    tobx = this.controlPoint1.x - this.line.pointI.x;  toby = this.controlPoint1.y - this.line.pointI.y;  
    tocx = this.controlPoint2.x - this.controlPoint1.x;  tocy = this.controlPoint2.y - this.controlPoint1.y;
    todx = this.line.pointF.x - this.controlPoint2.x;  tody = this.line.pointF.y - this.controlPoint2.y;
    var step = 1/40;
    for(var d=0; d<1.001; d+=step){
        px = this.line.pointI.x +d*tobx;  py = this.line.pointI.y +d*toby;
        qx = this.controlPoint1.x +d*tocx;  qy = this.controlPoint1.y +d*tocy;
        rx = this.controlPoint2.x +d*todx;  ry = this.controlPoint2.y +d*tody;
        toqx = qx - px;      toqy = qy - py;
        torx = rx - qx;      tory = ry - qy;
        
        sx = px +d*toqx;  sy = py +d*toqy;
        tx = qx +d*torx;  ty = qy +d*tory;
        totx = tx - sx;   toty = ty - sy;

        x = sx + d*totx;  y = sy + d*toty;
        
        left = Math.min(left, x); up = Math.min(up, y);
        right = Math.max(right, x); down = Math.max(down, y);
    }   
	
	return [new Point(left, up), new Point(left, down), new Point(right, down), new Point(right, up)]
}

Bezier.prototype.MirrorTo = function (){ return; }

Bezier.prototype.GetQuad = function (point){
	var boundingPoints = this.GetBoundingBox();
	
	if(point.x > boundingPoints[2].x && point.y < boundingPoints[2].y && point.y > boundingPoints[0].y) return 1;
	if(point.y < boundingPoints[2].y && point.x < boundingPoints[2].x && point.x > boundingPoints[0].x) return 2;
	if(point.x < boundingPoints[0].x && point.y < boundingPoints[2].y && point.y > boundingPoints[0].y) return 3;
	if(point.y > boundingPoints[0].y && point.x < boundingPoints[2].x && point.x > boundingPoints[0].x) return 4;
}

Bezier.prototype.isSelect = function(point){
	
	if(this.line.pointI.isSelect(point) == true || this.line.pointF.isSelect(point) == true) return true;

	var ptList = [];
	var lerpT = 0.5;
	ptList[0] = this.line.pointI;
	ptList[1] = this.controlPoint1;
	ptList[2] = this.controlPoint2;
	ptList[3] = this.line.pointF;
	ptList[4] = new Point(ptList[0].x+(lerpT*(ptList[1].x-ptList[0].x)),ptList[0].y+(lerpT*(ptList[1].y-ptList[0].y))); 
	ptList[5] = new Point(ptList[1].x+(lerpT*(ptList[2].x-ptList[1].x)),ptList[1].y+(lerpT*(ptList[2].y-ptList[1].y)));
	ptList[6] = new Point(ptList[2].x+(lerpT*(ptList[3].x-ptList[2].x)),ptList[2].y+(lerpT*(ptList[3].y-ptList[2].y)));
	ptList[7] = new Point(ptList[4].x+(lerpT*(ptList[5].x-ptList[4].x)),ptList[4].y+(lerpT*(ptList[5].y-ptList[4].y)));
	ptList[8] = new Point(ptList[5].x+(lerpT*(ptList[6].x-ptList[5].x)),ptList[5].y+(lerpT*(ptList[6].y-ptList[5].y)));
	ptList[9] = new Point(ptList[7].x+(lerpT*(ptList[8].x-ptList[7].x)),ptList[7].y+(lerpT*(ptList[8].y-ptList[7].y)));

	if(ptList[9].isSelect(point) == true) return true;

	var poly = new Polygon(ptList);
	return poly.isSelect(point);

}

Bezier.prototype.Rotate = function(sin,cos,point){
	this.line.Translate(sin, cos, point);
	
	var points = [this.controlPoint1,this.controlPoint2]
	for (var i = 0 ; i < points.length;i++){
		points[i].x -= point.x
		points[i].y -= point.y
		points[i].x = ((cos*points[i].x) - (sin*points[i].y));
		points[i].y = ((sin*points[i].x) + (cos*points[i].y));
		points[i].x += point.x
		points[i].y += point.y
	}
}

Bezier.prototype.Scale = function (x, y){
	this.line.Translate(x,y);
	this.controlPoint1.x *= x;
	this.controlPoint1.y *= y;
	this.controlPoint2.x *= x;
	this.controlPoint2.y *= y;
}

Bezier.prototype.Translate = function (x, y){
	this.line.Translate(x, y);
	this.controlPoint1.Translate(x,y);
	this.controlPoint2.Translate(x,y);
}

Bezier.prototype.ToString = function(){
	return "BEZIER " + this.line.pointI.x + " " + this.line.pointI.y + " " + this.line.pointF.x + " " + this.line.pointF.y + " " + this.controlPoint1.x + " " + this.controlPoint1.y + " " + this.controlPoint2.x + " " + this.controlPoint2.y + "%0D%0A";
}

function Canvas(id) {
    this.element = document.getElementById(id);
	this.objects = [];
};

Canvas.prototype.context = function(){
	return this.element.getContext('2d');
}

Canvas.prototype.rect = function(){
	return this.element.getBoundingClientRect();
}

Canvas.prototype.reDraw = function(){
	this.clear();
	for(var i = 0; i < this.objects.length; i++){
		this.objects[i].Draw(this, true);
	}
}

Canvas.prototype.clear = function(){
	this.context().clearRect(0, 0, canvas.element.width, canvas.element.height);
}


