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
		this.drawNPCs();
		this.drawNessie();
		
		ctx.fillStyle = "#FFFFFF";
		ctx.font = "30px Courier New";
		ctx.fillText("High Score: " + myModel.highscore.toString(), 10, 30);
		ctx.fillText("Score: " + myModel.score.toString(), 10, 70);
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
		var coords = myModel.getNessie();
		coords = this.gameToScreen(coords);
		ctx.beginPath();
		ctx.arc( coords.x , coords.y , this.gameLengthToScreen(1) , 0 , 2 * Math.PI );
		ctx.fillStyle = "#00FF00";
		ctx.fill();
	}
	
	this.drawNPCs = function() {
		for (idx in myModel.myNPCs) {
			var coords = myModel.myNPCs[idx].getPosition();
			var size = myModel.myNPCs[idx].size;
			coords = this.gameToScreen(coords);
			ctx.beginPath();
			ctx.arc( coords.x , coords.y , this.gameLengthToScreen(size) , 0 , 2 * Math.PI );
			ctx.fillStyle = "#FFFFFF";
			if (myModel.myNPCs[idx].type == "FISH") {
				ctx.fillStyle = "#0000FF";
			} else if (myModel.myNPCs[idx].type == "BULLET") {
				if (myModel.myNPCs[idx].bullet_life % 0.25 > 0.125) {
					ctx.fillStyle = "#FFFF00";
				} else {
					ctx.fillStyle = "#FF0000";
				}
			} else if (myModel.myNPCs[idx].type == "SHOOTER") {
				ctx.fillStyle = "#000000";
			} else if (myModel.myNPCs[idx].type == "BLASTER") {
				ctx.fillStyle = "#FF0000";
			}
			ctx.fill();
		}
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
}
