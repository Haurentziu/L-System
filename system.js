var c = document.getElementById("system");
var ctx = c.getContext("2d");

var length = 30;
var axiom = "F-G-G";
var systemString;
var angle = deg2rad(120)

var rules = [
	{
		variable: "F",
		transformation: "F-G+F+G-F",
	},

	{
		variable: "G",
		transformation: "GG",
	},
]


var mouseLoc = {
	x: 0,
	y: 0,
}

var offset = {
	x: 350,
	y: 650,
}

var zoom = 0.2;
var isDragged = false;

window.onload = function(){
	c.addEventListener("mousedown", mouseDownListener, false);
	c.addEventListener("mousemove", mouseMoveListener, false);
	c.addEventListener("mouseup", mouseUpListener, false);
	c.addEventListener("wheel", scrollListener, false);
	c.addEventListener("mouseenter", mouseEnterListener, false);
	c.addEventListener("mouseleave", mouseLeaveListener, false);
	
	resize();
		drawSystem();


}

function drawSystem(){
	ctx.strokeStyle = "#FFFFFF";
	var turtlePos = {
		x: offset.x,
		y: offset.y,
	};
	ctx.save();
	systemString = axiom;
	iterateSystem(7);
	console.log(systemString);
	ctx.beginPath();
	ctx.moveTo(turtlePos.x, turtlePos.y);
	for(var i = 0; i < systemString.length; i++){
		if(systemString.charAt(i) == 'F' || systemString.charAt(i) == 'G'){
			turtlePos.x += length * zoom;
			ctx.lineTo(turtlePos.x, turtlePos.y);
		}

		else if(systemString.charAt(i) == '+'){
			ctx.translate(turtlePos.x, turtlePos.y);
			ctx.rotate(angle);
			ctx.translate(-turtlePos.x, -turtlePos.y);
		}

		else if(systemString.charAt(i) == '-'){
			ctx.translate(turtlePos.x, turtlePos.y);
			ctx.rotate(-angle);
			ctx.translate(-turtlePos.x, -turtlePos.y);
		}

		else{
			console.log("Invalid character" + systemString.charAt(i));
		}


	}
	ctx.stroke();
	ctx.restore();
}

function iterateSystem(order){
	for(var j = 0; j < order; j++){
		var i = 0;
		while(i < systemString.length){
			if(systemString.charAt(i) == 'G'){
				systemString = systemString.replaceAt(i, rules[1].transformation);
				i += rules[1].transformation.length;
			}
			else if(systemString.charAt(i) == 'F'){
				systemString = systemString.replaceAt(i, rules[0].transformation);
				i += rules[0].transformation.length;
			}
			else{
				i++;
			}
		}
	}
}

function deg2rad(angle){
	return angle * Math.PI / 180.0;
}


function mouseMoveListener(event){
	if(isDragged){
		rect = c.getBoundingClientRect();
		x = event.clientX - rect.left;
		y = event.clientY - rect.top;
		offset.x += x - mouseLoc.x;
		offset.y += y - mouseLoc.y;
		mouseLoc.x = x;
		mouseLoc.y = y;
		clearScreen();
	}
}

function clearScreen(){
	ctx.clearRect(0, 0, c.width, c.height);
	drawSystem();
}

function mouseDownListener(event){
	isDragged = true;
	rect = c.getBoundingClientRect();
	mouseLoc.x = event.clientX - rect.left;
	mouseLoc.y = event.clientY - rect.top;
}

function mouseUpListener(event){
	isDragged = false;
}

function scrollListener(event){
	if(event.wheelDelta > 0){
		zoom *= 1.1;
	}
	else zoom /= 1.1;
	clearScreen();
}

function mouseEnterListener(){
	document.body.classList.add("noScroll");
}

function mouseLeaveListener(){
	document.body.classList.remove("noScroll");
}

String.prototype.replaceAt=function(index, character) {
//	console.log(this.substr(0, index) + character + this.substr(index+character.length));
    return this.substr(0, index) + character + this.substr(index+1);
}

function resize(){
	c.width = window.innerWidth;
	c.height = window.innerHeight;
	clearScreen();
}