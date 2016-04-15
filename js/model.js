
/**
 * The Model is a container for a set of bodies. You'll be able to 
 * manipulate them through here!
 */
 
var Model = function() {
	
	this.nessie = null;
	
	this.myNPCs = null;
	
	this.score = 0;
	this.highscore = 0;
	
	this.state = null;
	this.stateTimer = 0.0;
	
	this.start = function() {
		this.state = "RUNNING";
		
		this.score = 0;
		this.nessie = new Boat(new Vector.fromComponents(50, 50));
		this.nessie.speed = 250
		this.nessie.hurtRad = 0.5
		
		this.myNPCs = [];
		this.fish = null;
		this.spawnFish();
		
		this.spawnBoat();
	}
	
	this.update = function(delta_time) {
		
		if (this.state == "KILLED") {
			this.stateTimer -= delta_time;
			if (this.stateTimer <= 0) {
				this.start();
			}
			return;
		}
			
		
		this.nessie.chase(delta_time, myController.getTarget());
		
		for (idx in this.myNPCs) {
			this.myNPCs[idx].act(delta_time, this.getNessie());
			if (this.myNPCs[idx].type == "SHOOTER" || this.myNPCs[idx].type == "BLASTER") {
				while (this.myNPCs[idx].firedBullets.length > 0) {
					var bullet = this.myNPCs[idx].firedBullets.pop();
					this.myNPCs.push(bullet);
				}
			}
		}
		
		if (this.detectedHit(this.nessie, this.fish)) {
			this.score += 1;
			this.highscore = Math.max(this.highscore, this.score);
			this.spawnFish();
			this.spawnBoat();
		}
		
		for (idx in this.myNPCs) {
			if (this.detectedHit(this.myNPCs[idx], this.nessie)) {
				if (this.myNPCs[idx].type == "FISH") {
					this.myNPCs.splice(idx, 1);
					this.score += 1;
					this.highscore = Math.max(this.highscore, this.score);
					idx -= 1;
					this.spawnFish();
					this.spawnBoat();
				} else {
					this.state = "KILLED"
					this.stateTimer = 1.0;
					//this.start();
					break;
				}
			}
		}
		
		
	}
	
	this.getNessie = function() {
		return this.nessie.getPosition();
	}
	
	this.spawnFish = function() {
		var xPos = Math.random() * 100;
		var yPos = Math.random() * 100;
		var newFish = new Entity(Vector.fromComponents(xPos, yPos));
		newFish.type = "FISH";
		this.fish = newFish;
	}
	
	this.spawnBoat = function() {
		
		var position = Math.random() * 100;
		var start_positions = [];
		
		if (this.getNessie().x < 50) {
			start_positions.push(new Vector.fromComponents(100, position));
		} else {
			start_positions.push(new Vector.fromComponents(0, position));
		}
		
		if (this.getNessie().y < 50) {
			start_positions.push(new Vector.fromComponents(position, 100));
		} else {
			start_positions.push(new Vector.fromComponents(position, 0));
		}
		
		start_position = start_positions[Math.floor(Math.random() * 2)];
		
		var myRand = Math.random();
		
		var driftAngle = Math.random(2 * Math.PI);
		
		if (this.score == 20) {
			this.myNPCs.push(new SuperBlaster(start_position, driftAngle));
			return;
		}
		
		if (myRand < 0.05) {
			this.myNPCs.push(new Blaster(start_position, driftAngle));
		} else if (myRand < 0.5) {
			this.myNPCs.push(new Shooter(start_position, driftAngle));
		} else {
			this.myNPCs.push(new Boat(start_position, driftAngle));
		}
		
	}
	
	this.detectedHit = function(object1, object2) {
		var wiggleRoom = object1.hitRad + object2.hurtRad;
		return (Vector.distance(object1.getPosition(), object2.getPosition()) < wiggleRoom);
	}
	
}


