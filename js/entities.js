/**
 * Entity
 *  - Fish
 *  - Mover
 *     - Nessie
 *     - Boat
 *        - Shooter
 *        - Bullet
 */

/**
 * The basic entity. It ... exists?
 */
var Entity = function(pos_vec) {
	
	this.position = pos_vec;
	this.size = 1;
	this.type = "ENTITY";

}

Entity.prototype.act = function(delta_time, target) {
	// Do nothing!
}

Entity.prototype.getPosition = function() {
	return this.position;
}

Entity.prototype.movePosition = function(deltaVector) {
	this.setPosition(this.getPosition().add(deltaVector));
}

Entity.prototype.setPosition = function(positionVector) {
	this.position = positionVector;
}

/**
 * Boats are movers with limited sight range, states, and drifts.
 */
var Boat = function(pos_vec, driftAngle, speed) {
	Entity.call(this, pos_vec);
	this.size = 1.0
	
	if (speed == null) {
		this.speed = (5 + Math.random() * 20) / 2;
	} else {
		this.speed = speed;
	}
	
	this.type = "BOAT";
	this.sight = Math.random() * 50;
	this.velocity = Vector.fromPolar(this.speed, driftAngle);
}

Boat.prototype = Object.create(Entity.prototype);

Boat.prototype.act = function(delta_time, target) {
	if (Vector.distance(this.getPosition(), target) <= this.sight) {
		this.chase(delta_time, target);
	} else {
		this.drift(delta_time);
	}
}

Boat.prototype.drift = function(delta_time) {
	
	this.movePosition(this.velocity.scMult(delta_time));
	
	if (this.getPosition().x < 0 || this.getPosition().x > 100) {
		this.position.x = Math.max(0, Math.min(this.position.x, 100));
		this.velocity = this.velocity.transform([[-1, 0], [0, 1]]);
	} else if (this.position.y < 0 || this.position.y > 100) {
		this.position.y = Math.max(0, Math.min(this.position.y, 100));
		this.velocity = this.velocity.transform([[1, 0], [0, -1]]);
	}
}

Boat.prototype.chase = function(delta_time, target) {
	var vectorToTarget = target.subtract(this.getPosition());
	var distanceToTarget = vectorToTarget.norm();
	if (distanceToTarget == 0) {
		return;
	}
	if (this.speed * delta_time >= distanceToTarget) {
		this.setPosition(new Vector(target));
	} else {
		this.movePosition(vectorToTarget.unit().scMult(this.speed * delta_time));
	}
}

var Shooter = function(pos_vec, driftAngle, speed) {
	Boat.call(this, pos_vec, driftAngle, speed);
	this.type = "SHOOTER"
	this.sight = 0; // Shooters are blind.
	this.patternActive = false;
	this.timeBetweenPatterns = 1;
	this.patternTimer = this.timeBetweenPatterns;
	this.firedBullets = [];
}
Shooter.prototype = Object.create(Boat.prototype);

Shooter.prototype.act = function(delta_time) {
	this.patternTimer-= delta_time;
	
	if (this.patternTimer < 0) {
		this.patternTimer += this.timeBetweenPatterns;
		this.patternActive = true;
	}
	
	if (this.patternActive) {
		this.firePattern(delta_time);
	}
	
	this.drift(delta_time);
}

Shooter.prototype.firePattern = function(delta_time) {
	var driftAngle = Math.random() * Math.PI * 2;
	this.firedBullets.push(new Bullet(this.getPosition(), driftAngle));
	this.patternActive = false;
}

var Bullet = function(pos_vec, dir_vec, speed) {
	Boat.call(this, pos_vec);
	this.type = "BULLET"
	this.sight = 0;
	if (speed == null) {
		this.speed = 10;
	} else {
		this.speed = speed;
	}
	this.dirVec = dir_vec;
	this.velocity = Vector.fromPolar(this.speed, this.dirVec);
	this.size = 0.5;
	this.bullet_life = 0;
}
Bullet.prototype = Object.create(Boat.prototype);

Bullet.prototype.act = function(delta_time) {
	this.movePosition(this.velocity.scMult(delta_time));
	this.bullet_life += delta_time;
	this.patternActive = false;
}

var Blaster = function(pos_vec, driftAngle) {
	this.speed = 2;
	Shooter.call(this, pos_vec, driftAngle, this.speed);
	this.type = "BLASTER";
	
	this.patternActive = false;
	this.timeBetweenPatterns = 5;
	this.patternTimer = this.timeBetweenPatterns;
	
	this.shotsInPattern = 4;
	this.shotsFired = 0;
	this.timeBetweenShots = 0.125
	this.shotTimer = 0;
	
	this.offset = 0;
}
Blaster.prototype = Object.create(Shooter.prototype);

Blaster.prototype.firePattern = function(delta_time) {
	this.shotTimer -= delta_time;
	if (this.shotTimer <= 0) {
		 this.shotTimer += this.timeBetweenShots;
		 var bulletSpeed = 20 - 1.25 * this.shotsFired;
		 this.fireShots(delta_time, bulletSpeed);
		 this.shotsFired += 1;
	 } 
	 
	 if (this.shotsFired >= this.shotsInPattern) {
		 this.shotsFired = 0;
		 this.patternActive = false;
	 }
}

Blaster.prototype.fireShots = function(delta_time, bulletSpeed) {
	for (i = 0; i < 5; i++) {
		var driftAngle = (i / 5 + this.offset / 20) * Math.PI * 2;
		this.firedBullets.push(new Bullet(this.getPosition(), driftAngle, bulletSpeed));
	}
	this.offset += 1;

}

var SuperBlaster = function(pos_vec, driftAngle) {
	Blaster.call(this, pos_vec, driftAngle, this.speed);
	this.size = 2;
	
	this.patternActive = false;
	this.timeBetweenPatterns = 10;
	this.patternTimer = this.timeBetweenPatterns;
	
	this.shotsInPattern = 120;
	this.shotsFired = 0;
	this.timeBetweenShots = 1.0/12o;
	this.shotTimer = 0;
}

SuperBlaster.prototype = Object.create(Blaster.prototype);


