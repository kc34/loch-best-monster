/**
 * The basic entity. It ... exists?
 */
var Entity = function(pos_vec) {
	
	this.position_v = pos_vec;
	this.size = 1;
	this.type = "ENTITY";

}

Entity.prototype.update = function(delta_time, target) {
	
}

Entity.prototype.getPosition = function() {
	return this.position_v;
}

Entity.prototype.collidedWith = function(otherEntity) {
	var wiggleRoom = this.size + otherEntity.size;
	if (Vector.distance(otherEntity.getPosition(), this.getPosition()) < wiggleRoom) {
		return true;
	} else {
		return false;
	}
}

var Fish = function(pos_vec) {
	Entity.call(this, pos_vec);
	this.type = "FISH";
}

Fish.prototype = Object.create(Entity.prototype);

var Boat = function(pos_vec) {
	Entity.call(this, pos_vec);
	this.speed = Math.random() * 30;
	this.type = "BOAT";
}

Boat.prototype = Object.create(Entity.prototype);

Boat.prototype.update = function(delta_time, target) {
	this.chase(delta_time, target);
}

/**
 * Moves the entity closer to its target.
 */
Boat.prototype.chase = function(delta_time, target) {
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
