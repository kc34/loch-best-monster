
/**
 * The Model is a container for a set of bodies. You'll be able to 
 * manipulate them through here!
 */
 
var Model = function() {
	
	this.nessie = null;
	
	this.enemies = null;
	this.bullets = null;
	
	this.score = 0;
	this.highscore = 0;
	
	this.state = null;
	this.stateTimer = 0.0;
	
	this.MAX_ENEMIES = 25;
	
	this.start = function() {
		this.state = "RUNNING";
		
		this.score = 0;
		this.nessie = new Boat(new Vector.fromComponents(50, 50));
		this.nessie.speed = 250
		this.nessie.hurtRadius = 0.5
		
		this.enemies = [];
		this.bullets = [];
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
		
		this.enemies.concat(this.bullets).forEach(function(object) {
			object.act(delta_time, this.getNessie());
		}, this);
		
		this.enemies.forEach(function(object) {
			if (object.type == "SHOOTER" || object.type == "BLASTER") {
				this.bullets = this.bullets.concat(object.firedBullets);
				object.firedBullets = [];
			}
		}, this);
		
		if (this.detectedHit(this.nessie, this.fish)) {
			this.score += 1;
			this.highscore = Math.max(this.highscore, this.score);
			this.spawnFish();
			this.spawnBoat();
		}
		
		var killed = this.enemies.concat(this.bullets).some(function(hazard) {
			return (this.detectedHit(hazard, this.nessie));
		}, this);
		
		if (killed) {
			this.state = "KILLED";
			this.stateTimer = 1.0;
		}
		
		this.bullets = this.bullets.filter(function(bullet) {
			var pos = myViewer.gameToScreen(bullet.getPosition());
			return (pos.x >= 0 && pos.x < window.innerWidth &&
					pos.y >= 0 && pos.y < window.innerHeight);
		}, this);
		
		for (var i = this.enemies.length - 1; i >= 0; i--) {
			if (this.enemies.length - i > this.MAX_ENEMIES) {
				this.enemies.splice(i, 1);
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
	
	this.getBorderSpawnPosition = function() {
		
		var position = Math.random() * 100;
		var start_position = null;
		
		if (Math.random() < 0.5) {
		
			if (this.getNessie().x < 50) {
				start_position = (new Vector.fromComponents(100, position));
			} else {
				start_position = (new Vector.fromComponents(0, position));
			}
		} else {
		
			if (this.getNessie().y < 50) {
				start_position = (new Vector.fromComponents(position, 100));
			} else {
				start_position = (new Vector.fromComponents(position, 0));
			}
		}
		
		return start_position;
	}
	
	this.spawnBoat = function() {
		
		var start_position = this.getBorderSpawnPosition();
		
		var driftAngle = Math.random(2 * Math.PI);
		
		if (this.score > 0 && this.score % 50 == 0) {
			this.enemies.push(new SuperBlaster(start_position, driftAngle));
			return;
		}
		
		if (this.score % 50 == 25) {
			this.enemies.push(new Sprayer(start_position, driftAngle));
			return;
		}
		
		var myRand = Math.random() + Math.random() - 1 + this.score * 0.01;
		
		if (myRand > 1) {
			this.enemies.push(new Blaster(start_position, driftAngle));
		} else if (myRand < 0) {
			this.enemies.push(new Boat(start_position, driftAngle));
		} else {
			this.enemies.push(new Shooter(start_position, driftAngle));
		}
		
	}
	
	this.detectedHit = function(object1, object2) {
		var wiggleRoom = object1.hitRadius + object2.hurtRadius;
		return (Vector.distance(object1.getPosition(), object2.getPosition()) < wiggleRoom);
	}
	
}


