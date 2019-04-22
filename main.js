var canvas = new Canvas('MainCanvas');



var navbarElement = document.getElementById('navbar');

var navbarPanel = [];
	navbarPanel.currentButton = null;
	navbarPanel.mirror = document.getElementById('navbarPanelButtonMirror');
	navbarPanel.rotate = document.getElementById('navbarPanelButtonRotate');
	navbarPanel.scale = document.getElementById('navbarPanelButtonScale');
	navbarPanel.mousePointer = document.getElementById('navbarPanelButtonMousePointer');
	navbarPanel.pencil = document.getElementById('navbarPanelButtonPencil');
	navbarPanel.lineArrow = document.getElementById('navbarPanelButtonLineArrow');
	navbarPanel.square = document.getElementById('navbarPanelButtonSquare');
	navbarPanel.circle = document.getElementById('navbarPanelButtonCircle');
	navbarPanel.bezier = document.getElementById('navbarPanelButtonBezier');
	navbarPanel.fileReader = document.getElementById('fileReader');

	
var mouse = [];

var isDrawing = "";
var currentInteraction = "";

function _Init(){
	canvas.element.addEventListener('mousemove', _getMousePos, false);
	canvas.element.addEventListener('mousemove', _OnMouseMove, false);
	canvas.element.addEventListener('mousedown', _OnMouseDown, false);
	canvas.element.addEventListener('mouseup', _OnMouseUp, false);
	navbarPanel.fileReader.addEventListener('change', _OnReadFile, false);
	window.addEventListener('resize', _Resize, false);
	_Resize();
	setInteraction("point");
}

function _Resize(){
	canvas.element.width  = navbarElement.offsetWidth;
	canvas.element.height = window.innerHeight - navbarElement.offsetHeight;
	canvas.reDraw();
}

function setInteraction(interaction){
	
	if(currentInteraction == interaction) return;
	
	var last = currentInteraction;
	
	switch (currentInteraction){
		case "arc":{
			if(mouseLinePI != null){
				canvas.reDraw();
				arcCenter = null;
				arcPoint = null;
			}
			break;
		}
		case "line":{
			if(mouseLinePI != null){
				canvas.reDraw();
				mouseLinePI = null;
			}
			break;
		}
	}
	
	if(navbarPanel.currentButton != null)
		navbarPanel.currentButton.classList.remove("active");
	
	switch (interaction){
		case "mirror":{
			currentInteraction = interaction;
			navbarPanel.currentButton = navbarPanel.mirror;
			navbarPanel.mirror.classList.add("active");
			break;
		}
		case "rotate":{
			currentInteraction = interaction;
			navbarPanel.currentButton = navbarPanel.rotate;
			navbarPanel.rotate.classList.add("active");
			break;
		}
		case "scale":{
			currentInteraction = interaction;
			navbarPanel.currentButton = navbarPanel.scale;
			navbarPanel.scale.classList.add("active");
			break;
		}
		case "select":{
			currentInteraction = interaction;
			navbarPanel.currentButton = navbarPanel.mousePointer;
			navbarPanel.mousePointer.classList.add("active");
			break;
		}
		case "point":{
			currentInteraction = interaction;
			navbarPanel.currentButton = navbarPanel.pencil;
			navbarPanel.pencil.classList.add("active");
			break;
		}
		case "line":{
			currentInteraction = interaction;
			navbarPanel.currentButton = navbarPanel.lineArrow;
			navbarPanel.lineArrow.classList.add("active");
			break;
		}
		case "polygon":{
			currentInteraction = interaction;
			navbarPanel.currentButton = navbarPanel.square;
			navbarPanel.square.classList.add("active");
			break;
		}
		case "arc":{
			currentInteraction = interaction;
			navbarPanel.currentButton = navbarPanel.circle;
			navbarPanel.circle.classList.add("active");
			break;
		}
		case "bezier":{
			currentInteraction = interaction;
			navbarPanel.currentButton = navbarPanel.bezier;
			navbarPanel.bezier.classList.add("active");
			break;
		}
		case "eraser":{
			canvas.objects = [];
			canvas.clear();
			setInteraction(last);
			break;
		}
		case "download":{
			function download(filename, text) {
				var element = document.createElement('a');
				element.setAttribute('href', 'data:text/plain;charset=utf-8,' + text);
				element.setAttribute('download', filename);

				element.style.display = 'none';
				document.body.appendChild(element);
				
				element.click();

				document.body.removeChild(element);
			}
			var text = "";
			for(var i = 0; i<canvas.objects.length; i++){
				text = text.concat(canvas.objects[i].ToString());
			}
			download("download.txt",text);
			setInteraction(last);
			break;
		}
		case "read":{
			navbarPanel.fileReader.click();
			setInteraction(last);
			break;
		}
	}
}

function _getMousePos(evt) {
	mouse.previousX = mouse.x;
	mouse.previousY = mouse.y;
    mouse.x = evt.clientX - canvas.rect().left,
    mouse.y = evt.clientY - canvas.rect().top
}

var mouseLinePI = null;
var mousePolygon = [];
var selectObject = null;
var selectObjectBeforeScaled = null;
var selectObjectBeforeRotate = null;
var continueSelecting = false;
var initalSelect = null;
var arcCenter = null;
var arcPoint = null;
var mouseBezierPI = null;
var mouseBezierLine = null;
var mouseBezierControl = null;

function _OnMouseDown(evt){
	switch (currentInteraction){
		case "rotate":
		case "scale":
		case "select":{
			var found = null
			for(var i = 0; i < canvas.objects.length; i++){
				var object = canvas.objects[i];
				if(object.isSelect(new Point(mouse.x, mouse.y))){
					found = object;
					break;
				}
			}
			
			if(found != null){
				if(selectObject != null) selectObject.showBoundingBox = false;
				selectObject = found;
				//Apagar os Highlights
				for(var i = 0; i < canvas.objects.length; i++){
					var object = canvas.objects[i];
					object.showHighLight = false;
				}
				
				selectObject.showHighLight = true;
				selectObject.showBoundingBox = true;
				continueSelecting = true;
				initalSelect = [mouse.x, mouse.y];
			}
			else{
				continueSelecting = false;
				if(selectObject != null) {
					selectObject.showBoundingBox = false;
					selectObject.showHighLight = false;
				}
				selectObject = null
			}

			canvas.reDraw();
			break;
		}
		case "mirror":{
			
			var found = null;
			for(var i = 0; i < canvas.objects.length; i++){
				var object = canvas.objects[i];
				if(object.isSelect(new Point(mouse.x, mouse.y))){
					found = object;
					break;
				}
			}
			
			if(found != null){
				if(selectObject != null) selectObject.showBoundingBox = false;
				selectObject = found;
				//Apagar os Highlights
				for(var i = 0; i < canvas.objects.length; i++){
					var object = canvas.objects[i];
					object.showHighLight = false;
				}
				
				selectObject.showHighLight = true;
				selectObject.showBoundingBox = true;
				
				continueSelecting = true;
				initalSelect = [mouse.x, mouse.y];
			}
			else{
				continueSelecting = false;
				if(selectObject != null) {
					selectObject.showBoundingBox = false;
					selectObject.showHighLight = false;
					selectObject.MirrorTo(selectObject.GetQuad(new Point(mouse.x, mouse.y)));
				}
				selectObject = null
			}
			canvas.reDraw();
			
			if (selectObject != null && selectObject.showBoundingBox){
				var points = selectObject.GetBoundingBox();
				new Line(new Point(0, points[0].y), new Point (canvas.element.width, points[0].y)).Draw(canvas, true);
				new Line(new Point(0, points[1].y), new Point (canvas.element.width, points[1].y)).Draw(canvas, true);
				new Line(new Point(points[0].x, 0), new Point (points[0].x, canvas.element.height)).Draw(canvas, true);
				new Line(new Point(points[2].x, 0), new Point (points[2].x,  canvas.element.height)).Draw(canvas, true);
			}
			break;
		}
		case "point":{
			new Point(mouse.x, mouse.y).Draw(canvas);
			break;
		}
		case "line":{
			if(mouseLinePI == null){
				mouseLinePI = new Point(mouse.x, mouse.y);
				mouseLinePI.Draw(canvas, true);
			}
			else{
				new Line(mouseLinePI, new Point(mouse.x, mouse.y)).Draw(canvas);
				mouseLinePI = null;
			}
			break;
		}
		case "polygon":{
			if(evt.which == 1){
				var point = new Point(mouse.x, mouse.y)
				mousePolygon.push(point);
				point.Draw(canvas, true);
			}
			else{
				new Polygon(mousePolygon).Draw(canvas);
				mousePolygon = [];
			}
			break;
		}
		case "arc":{
			if(arcCenter == null){
				arcCenter = new Point(mouse.x, mouse.y);
				arcCenter.Draw(canvas, true);
			}
			else if(arcCenter != null && arcPoint == null){
				arcPoint = new Point(mouse.x, mouse.y);
			}
			else if(arcPoint != null){
				var distance1 = Math.sqrt(Math.pow(arcCenter.x - arcPoint.x, 2) + Math.pow(arcCenter.y - arcPoint.y, 2));
				var distance2 = Math.sqrt(Math.pow(arcCenter.x - mouse.x, 2) + Math.pow(arcCenter.y - mouse.y, 2));
				
				if(arcPoint.y > arcCenter.y){
					if(mouse.y > arcPoint.y){
						new Arc (arcCenter, distance1, Math.acos((arcPoint.x-arcCenter.x)/distance1),Math.acos((mouse.x-arcCenter.x)/distance2)).Draw(canvas);
					}else{
						new Arc (arcCenter, distance1, Math.acos((arcPoint.x-arcCenter.x)/distance1),-Math.acos((mouse.x-arcCenter.x)/distance2)).Draw(canvas);
					}
				}else{
					if(mouse.y > arcCenter.y){
						new Arc (arcCenter, distance1, -Math.acos((arcPoint.x-arcCenter.x)/distance1),Math.acos((mouse.x-arcCenter.x)/distance2)).Draw(canvas);
					}else{
						new Arc (arcCenter, distance1, -Math.acos((arcPoint.x-arcCenter.x)/distance1),-Math.acos((mouse.x-arcCenter.x)/distance2)).Draw(canvas);
					}
				}
				arcCenter = null;
				arcPoint = null;
			}	
			break;
		}
		case "bezier":{
			
			if(mouseBezierPI == null){
				mouseBezierPI = new Point(mouse.x, mouse.y);
				mouseBezierPI.Draw(canvas, true);
			}
			else if(mouseBezierPI != null && mouseBezierLine == null){
				mouseBezierLine = new Line(mouseBezierPI, new Point(mouse.x, mouse.y));
				mouseBezierLine.Draw(canvas, true);
			}
			else if(mouseBezierLine != null && mouseBezierControl == null){
				mouseBezierControl = new Point(mouse.x, mouse.y);
				new Bezier(mouseBezierLine, mouseBezierControl, new Point(mouseBezierLine.pointF.x, mouseBezierLine.pointF.y)).Draw(canvas, true);
			}
			else if(mouseBezierControl != null){
				var control2 = new Point(mouse.x, mouse.y);
				new Bezier(mouseBezierLine, mouseBezierControl, control2).Draw(canvas);
				mouseBezierControl = null;
				mouseBezierLine = null;
				mouseBezierPI = null;
			}
			break;
		}
	}
}

function _OnMouseMove(evt){
	switch (currentInteraction){
		case "line":{
			if(mouseLinePI != null){
				canvas.reDraw();
				mouseLinePI.Draw(canvas, true);
				new Line(mouseLinePI, new Point(mouse.x, mouse.y)).Draw(canvas, true);
			}
			break;
		}
		case "bezier":{
			if(mouseBezierPI != null && mouseBezierLine == null){
				canvas.reDraw();
				mouseBezierPI.Draw(canvas, true);
				new Line(mouseBezierPI, new Point(mouse.x, mouse.y)).Draw(canvas, true);
			}
			else if(mouseBezierLine != null && mouseBezierControl == null){
				canvas.reDraw();
				var aux = new Point(mouse.x, mouse.y);
				new Bezier(mouseBezierLine, aux, new Point(mouseBezierLine.pointF.x, mouseBezierLine.pointF.y)).Draw(canvas, true);
			}
			else if(mouseBezierControl != null){
				canvas.reDraw();
				var aux = new Point(mouse.x, mouse.y);
				new Bezier(mouseBezierLine, mouseBezierControl, aux).Draw(canvas, true);
			}
			break;
		}
		case "scale":{
			if(selectObject == null){
				for(var i = 0; i < canvas.objects.length; i++){
					var object = canvas.objects[i];
					object.showHighLight = object.isSelect(new Point(mouse.x, mouse.y));
				}
			}
			else{
				if(selectObjectBeforeScaled == null) selectObjectBeforeScaled = [1,1]
				selectObject.showHighLight = true;
				//Scale
				if(continueSelecting){
					var scaleX = mouse.x - initalSelect[0]; 
					var scaleY = mouse.y - initalSelect[1];
					
					var scaleX = scaleX/10;
					var scaleY = scaleY/10;
					if(scaleX <= 0) scaleX = 1;
					if(scaleY <= 0) scaleY = 1;
					
					selectObject.Scale(1/selectObjectBeforeScaled[0], 1/selectObjectBeforeScaled[1]);
					selectObject.Scale(scaleX, scaleY);
					selectObjectBeforeScaled = [scaleX, scaleY];

				}
			}
			canvas.reDraw();
			break;
		}
		case "rotate":{
			canvas.reDraw();
			if(selectObject == null){
				for(var i = 0; i < canvas.objects.length; i++){
					var object = canvas.objects[i];
					object.showHighLight = object.isSelect(new Point(mouse.x, mouse.y));
				}
			}
			else{
				if(selectObjectBeforeRotate == null) selectObjectBeforeRotate = [0,90]
				selectObject.showHighLight = true;
				//Rotate
				if(continueSelecting){
					new Line(new Point(mouse.x, mouse.y), new Point(initalSelect[0], initalSelect[1])).Draw(canvas, true);
					new Arc(new Point(initalSelect[0], initalSelect[1]), 5, 0, 2 * Math.PI).Draw(canvas, true);
				}
			}
			
			break;
		}
		case "select":{
			canvas.reDraw();
			if(selectObject == null){
				for(var i = 0; i < canvas.objects.length; i++){
					var object = canvas.objects[i];
					object.showHighLight = object.isSelect(new Point(mouse.x, mouse.y));
				}
			}
			else{
				selectObject.showHighLight = true;
				//Translate
				if(continueSelecting){
					var translateX = mouse.x - initalSelect[0]; 
					var translateY = mouse.y - initalSelect[1];
					
					selectObject.Translate(translateX, translateY);
					initalSelect = [mouse.x, mouse.y]
				}
			}
			break;
		}
		case "polygon":{
			canvas.reDraw();
			var copy = mousePolygon.slice();
			var point = new Point(mouse.x, mouse.y)
			copy.push(point);
			var polygon = new Polygon(copy);
			polygon.Draw(canvas, true);
			
			break;
		}
		case "arc":{
			if(arcCenter != null && arcPoint == null){
				canvas.reDraw();
				new Line(arcCenter, new Point(mouse.x, mouse.y)).Draw(canvas, true);
			}
			else if(arcPoint != null){
				canvas.reDraw();
				var distance1 = Math.sqrt(Math.pow(arcCenter.x - arcPoint.x, 2) + Math.pow(arcCenter.y - arcPoint.y, 2));
				var distance2 = Math.sqrt(Math.pow(arcCenter.x - mouse.x, 2) + Math.pow(arcCenter.y - mouse.y, 2));
				
				if(arcPoint.y > arcCenter.y){
					if(mouse.y > arcPoint.y){
						new Arc (arcCenter, distance1, Math.acos((arcPoint.x-arcCenter.x)/distance1),Math.acos((mouse.x-arcCenter.x)/distance2)).Draw(canvas, true);
					}else{
						new Arc (arcCenter, distance1, Math.acos((arcPoint.x-arcCenter.x)/distance1),-Math.acos((mouse.x-arcCenter.x)/distance2)).Draw(canvas, true);
					}
				}else{
					if(mouse.y > arcCenter.y){
						new Arc (arcCenter, distance1, -Math.acos((arcPoint.x-arcCenter.x)/distance1),Math.acos((mouse.x-arcCenter.x)/distance2)).Draw(canvas, true);
					}else{
						new Arc (arcCenter, distance1, -Math.acos((arcPoint.x-arcCenter.x)/distance1),-Math.acos((mouse.x-arcCenter.x)/distance2)).Draw(canvas, true);
					}
				}
			}
			break;
		}
	}
	
}

function _OnMouseUp(evt){
	switch (currentInteraction){
		case "rotate":{
			if(selectObject != null){
				var dist = Math.sqrt(Math.pow(initalSelect[0] - mouse.x, 2) + Math.pow( initalSelect[1] - mouse.y, 2));
				var cos = ((mouse.x - initalSelect[0]) / dist);
				var sin = ((mouse.y - initalSelect[1]) / dist);
				selectObject.Rotate(sin, cos, new Point(initalSelect[0], initalSelect[1]));
				continueSelecting = false;
				selectObjectBeforeRotate = null;
			}
		}
		
		case "scale": 
		case "select":{
			
			selectObjectBeforeScaled = null;
			continueSelecting = false;
			break;
		}
	}
}

function _OnReadFile(){
	var reader = new FileReader();
	reader.onload = function(){
		var text = reader.result;
		
		//Draw From File
		
		var textLines = text.split("\n");
		
		for(var i = 0, length = textLines.length; i < length; i++){
			var arguments = textLines[i].split(" ");
			if(textLines[i].indexOf("POINT") !== -1){
				new Point(parseInt(arguments[1]), parseInt(arguments[2])).Draw(canvas);
			}
			else if(textLines[i].indexOf("LINE") !== -1){
				new Line(new Point(parseInt(arguments[1]),parseInt(arguments[2])),
						 new Point( parseInt(arguments[3]), parseInt(arguments[4]))).Draw(canvas);
			}
			else if(textLines[i].indexOf("POLYGON") !== -1){
				var points = []
				for (var count = 1; count < arguments.length; count = count+2){
					points.push(new Point(parseInt(arguments[count]), parseInt(arguments[count + 1])));
				}
				new Polygon (points).Draw(canvas);
			}
			else if(textLines[i].indexOf("ARC") !== -1){
				new Arc (new Point(parseInt(arguments[1]), parseInt(arguments[2])), 
						parseInt(arguments[3]), parseFloat(arguments[4]), parseFloat(arguments[5])).Draw(canvas);
			}
			else if(textLines[i].indexOf("BEZIER") !== -1){
				new Bezier(new Line(new Point(parseInt(arguments[1]), parseInt(arguments[2])), new Point(parseInt(arguments[3]), parseInt(arguments[4]))),
						   new Point(parseInt(arguments[5]), parseInt(arguments[6])), new Point(parseInt(arguments[7]), parseInt(arguments[8]))).Draw(canvas);
			}
			
		}
	};
	reader.readAsText(navbarPanel.fileReader.files[0]);
}

_Init();

