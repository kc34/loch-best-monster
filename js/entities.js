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
	this.hitRadius = 1;
	this.hurtRadius = 1;
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
	
	if (speed == null) {
		this.speed = (5 + Math.random() * 5) / 2;
	} else {
		this.speed = speed;
	}
	
	this.type = "BOAT";
	this.sight = 25;
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
	this.loadedBullets = [];
	this.firedBullets = [];
}
Shooter.prototype = Object.create(Boat.prototype);

Shooter.prototype.act = function(delta_time, target) {
	this.patternTimer-= delta_time;
	
	if (this.patternTimer < 0) {
		this.patternTimer += this.timeBetweenPatterns;
		this.patternActive = true;
		this.loadPattern(delta_time, target);
	}
	
	this.fireBullets(delta_time);
	if (this.loadedBullets.length == 0)
		this.drift(delta_time);
}

Shooter.prototype.loadPattern = function(delta_time) {
	var driftAngle = Math.random() * Math.PI * 2;
	this.loadedBullets.push([0, new Bullet(this.getPosition(), driftAngle)]);
	this.patternActive = false;
}

Shooter.prototype.fireBullets = function(delta_time) {
	var idx = this.loadedBullets.length;
	while (idx - 1 >= 0) {
		idx -= 1;
		var bullet = this.loadedBullets[idx];
		if (bullet[0] <= 0) {
			this.loadedBullets.splice(idx, 1);
			this.firedBullets.push(bullet[1]);
		} else {
			bullet[0] -= delta_time;
		}
	}
}

var Bullet = function(pos_vec, dir_vec, speed) {
	Boat.call(this, pos_vec);
	this.type = "BULLET"
	this.sight = 0;
	if (speed == null) {
		this.speed = 5;
	} else {
		this.speed = speed;
	}
	this.dirVec = dir_vec;
	this.velocity = Vector.fromPolar(this.speed, this.dirVec);
	this.hitRadius = 0.5;
	this.hurtRadius = 0.5;
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
	
}
Blaster.prototype = Object.create(Shooter.prototype);

Blaster.prototype.loadPattern = function(delta_time) {
	var timeOffset = 0;
	for (var i = 0; i < this.shotsInPattern; i++) {
		var bulletSpeed = (20 - 1.25 * i) / 2;
		for (var j = 0; j < 5; j++) {
			var driftAngle = (j / 5 + i / 20) * Math.PI * 2;
			this.loadedBullets.push([i * this.timeBetweenShots, new Bullet(this.getPosition(), driftAngle, bulletSpeed)]);
		}
	}
}

var SuperBlaster = function(pos_vec, driftAngle) {
	Blaster.call(this, pos_vec, driftAngle, this.speed);
	this.hitRadius = 2;
	this.hurtRadius = 2;
	
	this.patternActive = false;
	this.timeBetweenPatterns = 10;
	this.patternTimer = this.timeBetweenPatterns;
	
	this.shotsInPattern = 40;
	this.shotsFired = 0;
	this.timeBetweenShots = 1.0/40;
	this.shotTimer = 0;
}

SuperBlaster.prototype = Object.create(Blaster.prototype);

SuperBlaster.prototype.loadPattern = function(delta_time) {
	var timeOffset = 0;
	for (var k = 0; k < 5; k++) {
		for (var i = 0; i < 8; i++) {
			var bulletSpeed = (20 - 1.25 * i) / 2;
			for (var j = 0; j < 5; j++) {
				var driftAngle = (j / 5 + i / 20 + k / 100) * Math.PI * 2;
				var newBullet = new Bullet(this.getPosition(), driftAngle, bulletSpeed);
				newBullet.type = "BULLET1";
				this.loadedBullets.push([i * this.timeBetweenShots + k * 0.5, newBullet]);
			}
		}
	}
}

var Sprayer = function(pos_vec, driftAngle) {
	this.speed = 2;
	Shooter.call(this, pos_vec, driftAngle, this.speed);
	this.hitRadius = 2;
	this.hurtRadius = 2;
	
	this.timeBetweenPatterns = 10;
	this.patternTimer = this.timeBetweenPatterns;
	this.timeBetweenShots = 1.0/120;
	this.shotsInPattern = 150;
}

Sprayer.prototype = Object.create(Shooter.prototype);

Sprayer.prototype.loadPattern = function(delta_time, target) {
	var baseAngle = target.subtract(this.getPosition()).getAngle();
	for (var i = 0; i < this.shotsInPattern; i++) {
		var bulletSpeed = 5 + Math.random() * 5;
		var loadingTime = 2 * Math.random();
		var bulletAngle = baseAngle + (-1/3 + Math.random() * 2/3) * Math.PI;
		var newBullet = new Bullet(this.getPosition(), bulletAngle, bulletSpeed);
		newBullet.type = "BULLET1";
		this.loadedBullets.push([loadingTime, newBullet]);
	}
			
}

