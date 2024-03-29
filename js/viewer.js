var Viewer = function() {
	
	/**
	 * The main screen that the game will be on is a square.
	 * This square will have its own coordinates: [0, 100] by [0, 100].
	 */
	 
	this.gameWindowTopLeft = Vector.NULL;
	this.gameWindowSideLength = null;
	
	this.draw = function() {
		
		this.drawBackground();
		this.getGameWindow();
		this.drawGame();
		this.drawNessie();
		this.drawNPCs();
		
		ctx.fillStyle = "#FFFFFF";
		ctx.font = "20px Courier New";
		var bdayMessage = "In observance of Lilian's 20th."
		ctx.fillText(bdayMessage, 10, 25);
		ctx.fillText("Justin's High Score: 41", 10, 50);
		ctx.fillText("Your High Score: " + myModel.highscore.toString(), 10, 75);
		ctx.fillText("Score: " + myModel.score.toString(), 10, 100);
		var bulletDisplay = "Bullets: " + myModel.bullets.length.toString();
		ctx.fillText(bulletDisplay, window.innerWidth - ctx.measureText(bulletDisplay).width - 10, 25);
	}
	
	this.getGameWindow = function () {
		// We need the biggest square that can fit.
		this.gameWindowSideLength = Math.min(window.innerWidth,
									   window.innerHeight) * 0.9;
		
		this.gameWindowTopLeft = Vector.fromComponents(
			window.innerWidth / 2 - this.gameWindowSideLength / 2,
			window.innerHeight / 2 - this.gameWindowSideLength / 2);
	}
	
	
	this.drawBackground = function() {
		ctx.fillStyle = "#888888";
		ctx.fillRect( 0 , 0 , window.innerWidth , window.innerHeight );
	}
	
	this.drawGame = function() {
		
		var offset = this.gameWindowSideLength * 0.02
		
		ctx.fillStyle = "#444444";
		ctx.fillRect(
			this.gameWindowTopLeft.x + offset, this.gameWindowTopLeft.y + offset,
			this.gameWindowSideLength, this.gameWindowSideLength);
		
		ctx.fillStyle = "#445D88";
		ctx.fillRect(
			this.gameWindowTopLeft.x, this.gameWindowTopLeft.y,
			this.gameWindowSideLength, this.gameWindowSideLength);
	}
	
	this.drawNessie = function() {
		this.drawGameCircle(myModel.getNessie(), 1, "#00FF00");
	}
	
	this.drawNPCs = function() {
		myModel.enemies.concat(myModel.bullets).forEach(function(myObject) {
				
			color = "#FFFFFF";
			if (myObject.type == "BULLET") {
				var bulletFrame = myObject.bullet_life % 1 * 60
				if (bulletFrame % 10 >= 5) {
					color = "#FFFF00";
				} else {
					color = "#FF0000";
				}
			} else if (myObject.type == "BULLET1") {
				var bulletFrame = myObject.bullet_life % 1 * 60
				if (bulletFrame % 10 >= 5) {
					color = "#00FFFF";
				} else {
					color = "#FFFFFF";
				}
			} else if (myObject.type == "SHOOTER") {
				color = "#000000";
			} else if (myObject.type == "BLASTER") {
				color = "#FF0000";
			}
			this.drawGameCircle(myObject.getPosition(), myObject.hitRadius, color);
		}, this);
		
		this.drawGameCircle(myModel.fish.getPosition(), 1, "#0000FF");

		
	}
	
	this.gameToScreen = function(objectCoords) {
		var tMatrix = [[0.01 * this.gameWindowSideLength, 0],
					   [0, 0.01 * this.gameWindowSideLength]];
		return objectCoords.transform(tMatrix)
						   .add(this.gameWindowTopLeft);
	}
	
	this.screenToGame = function(objectCoords, lockToWindow) {
		var coords = objectCoords.subtract(this.gameWindowTopLeft)
						   .scMult(100 / this.gameWindowSideLength);
		if (lockToWindow) {
			coords.x = Math.max(coords.x, 0)
			coords.x = Math.min(coords.x, 100);
			coords.y = Math.max(coords.y, 0)
			coords.y = Math.min(coords.y, 100);
		}
		
		return coords;
	}
	
	this.gameLengthToScreen = function(length) {
		return length / 100 * this.gameWindowSideLength;
	}
	
	this.drawGameCircle = function(gameVector, gameRadius, color) {
		var screenVector = this.gameToScreen(gameVector);
		var screenRadius = this.gameLengthToScreen(gameRadius);
		ctx.beginPath();
		ctx.arc(screenVector.x, screenVector.y, screenRadius, 0, 2 * Math.PI);
		ctx.fillStyle = color;
		ctx.fill();
	}
}
