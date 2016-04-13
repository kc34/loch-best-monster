var Entity = function(x, y) {
	
	this.position_v = Vector.fromComponents(x, y);
	this.speed = 50;

}

Entity.prototype.update = function(delta_time) {
	this.chase(delta_time, target);
}

Entity.prototype.getPosition = function() {
	return this.position_v;
}

/**
 * Moves the entity closer to its target.
 */
Entity.prototype.chase = function(delta_time, target) {
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
