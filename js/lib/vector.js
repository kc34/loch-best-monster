Vector = function(vector) {
	this.x = vector.x;
	this.y = vector.y;
}

Vector.fromComponents = function(x, y) {
	return new Vector({x : x, y : y});
}

Vector.fromPolar = function(r, theta) {
	return new Vector({x : r * Math.cos(theta), y : r * Math.sin(theta)});
}

Vector.prototype.add = function(vector) {
	return Vector.fromComponents(this.x + vector.x, this.y + vector.y);
}

Vector.prototype.subtract = function(vector) {
	return new Vector.fromComponents(this.x - vector.x, this.y - vector.y);
}

Vector.prototype.scMult = function(scalar) {
	return new Vector.fromComponents(this.x * scalar, this.y * scalar);
}

Vector.distance = function(vectorA, vectorB) {
	return vectorA.subtract(vectorB).norm();
}

Vector.prototype.norm = function() {
	return Math.pow(Math.pow(this.x, 2) + Math.pow(this.y, 2), 0.5);
}

Vector.prototype.unit = function() {
	if (this.norm() == 0) {
		return Vector.ZERO;
	} else {
		return this.scMult(1 / this.norm());
	}
}

Vector.prototype.transform = function(tMatrix) {
	var new_x = this.x * tMatrix[0][0] + this.y * tMatrix[0][1];
	var new_y = this.x * tMatrix[0][1] + this.y * tMatrix[1][1];
	return Vector.fromComponents(new_x, new_y);
}

Vector.prototype.getAngle = function() {
	return Math.atan2(this.y, this.x);
}

Vector.ZERO = Vector.fromComponents(0, 0);
Vector.NULL = Vector.fromComponents(null, null);
