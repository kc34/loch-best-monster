/**
 * The basic entity. It ... exists?
 */
var Entity = function(pos_vec) {
	
	this.position_v = pos_vec;
	this.size = 1;
	this.type = "ENTITY";

}

Entity.prototype.act = function(delta_time, target) {
	
}

Entity.prototype.getPosition = function() {
	return this.position_v;
}

/**
 * Fish don't do anything, but carry the FISH name. Possibly extraneous?
 */ 

var Fish = function(pos_vec) {
	Entity.call(this, pos_vec);
	this.type = "FISH";
}
Fish.prototype = Object.create(Entity.prototype);

/**
 * Movers can move around in the water and chase. Like Nessie + Boats.
 */
 
var Mover = function(pos_vec) {
	Entity.call(this, pos_vec);
	this.speed = 5 + Math.random() * 20;
	this.type = "MOVER";
}
Mover.prototype = Object.create(Entity.prototype);

Mover.prototype.act = function(delta_time, target) {
	this.chase(delta_time, target);
}

Mover.prototype.chase = function(delta_time, target) {
	var vectorToTarget = target.subtract(this.position_v);
	var distanceToTarget = vectorToTarget.norm();
	if (distanceToTarget == 0) {
		return;
	}
	if (this.speed * delta_time >= distanceToTarget) {
		this.position_v = new Vector(target);
	} else {
		this.position_v = this.position_v.add(vectorToTarget.scMult(this.speed * delta_time / distanceToTarget))
	}
}

/**
 * Drifters start with a velocity vector and just kind of drift around bumping into stuff.
 */
/*
var Drifter = function(pos_vec) {
	Mover.call(this, pos_vec);
	this.type = "DRIFTER";
	this.dir_vector = null;
}
Drifter.prototype = Object.create(Mover.prototype);

Drifter.prototype.act = function(delta_time, target) {
	this.drift(delta_time); // Told you!
}

Drifter.prototype.drift = function(delta_time) {
	if (this.dir_vector == null) {
		this.getNewVelVector(0, 2 * Math.PI);
	}
	this.position_v = this.position_v.add(this.dir_vector.scMult(this.speed * delta_time));
	
	if (this.position_v.x < 0) {
		this.position_v.x = 0;
		this.getNewVelVector(-0.5 * Math.PI, 0.5 * Math.PI);
	} else if (this.position_v.x > 100) {
		this.position_v.x = 100;
		this.getNewVelVector(0.5 * Math.PI, 1.5 * Math.PI);
	} else if (this.position_v.y < 0) {
		this.position_v.y = 0;
		this.getNewVelVector(0 * Math.PI, 1 * Math.PI);
	} else if (this.position_v.y > 100) {
		this.position_v.y = 100;
		this.getNewVelVector(1 * Math.PI, 2 * Math.PI);
	}
}

Drifter.prototype.getNewVelVector = function(low, high) {
	var angle = low + (high - low) * Math.random();
	this.dir_vector = Vector.fromComponents(Math.cos(angle), Math.sin(angle));

}*/


/**
 * Boats are movers with limited sight range, states, and drifts.
 */
var Boat = function(pos_vec) {
	Mover.call(this, pos_vec);
	this.speed = 5 + Math.random() * 20;
	this.type = "BOAT";
	this.sight = Math.random() * 50;
	this.dir_vector = null;
}

Boat.prototype = Object.create(Mover.prototype);

Boat.prototype.act = function(delta_time, target) {
	if (Vector.distance(this.getPosition(), target) <= this.sight) {
		this.chase(delta_time, target);
	} else {
		this.drift(delta_time);
	}
}

Boat.prototype.drift = function(delta_time) {
	if (this.dir_vector == null) {
		this.getNewVelVector(0, 2 * Math.PI);
	}
	this.position_v = this.position_v.add(this.dir_vector.scMult(this.speed * delta_time));
	
	if (this.position_v.x < 0) {
		this.position_v.x = 0;
		this.getNewVelVector(-0.5 * Math.PI, 0.5 * Math.PI);
	} else if (this.position_v.x > 100) {
		this.position_v.x = 100;
		this.getNewVelVector(0.5 * Math.PI, 1.5 * Math.PI);
	} else if (this.position_v.y < 0) {
		this.position_v.y = 0;
		this.getNewVelVector(0 * Math.PI, 1 * Math.PI);
	} else if (this.position_v.y > 100) {
		this.position_v.y = 100;
		this.getNewVelVector(1 * Math.PI, 2 * Math.PI);
	}
}

Boat.prototype.getNewVelVector = function(low, high) {
	var angle = low + (high - low) * Math.random();
	this.dir_vector = Vector.fromComponents(Math.cos(angle), Math.sin(angle));

}
