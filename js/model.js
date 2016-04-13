
/**
 * The Model is a container for a set of bodies. You'll be able to 
 * manipulate them through here!
 */
 
var Model = function() {
	
	this.nessie = null;
	
	this.myNPCs = null;
	
	this.start = function() {
		this.nessie = new Mover(new Vector.fromComponents(50, 50));
		this.nessie.speed = 250
		
		this.myNPCs = [];
		this.spawnFish();
		
		this.spawnBoat();
	}
	
	this.update = function(delta_time) {
		
		this.nessie.act(delta_time, myController.getTarget());
		
		for (idx in this.myNPCs) {
			this.myNPCs[idx].act(delta_time, this.getNessie());
		}
		
		for (idx in this.myNPCs) {
			if (this.detectedCollision(this.myNPCs[idx], this.nessie)) {
				if (this.myNPCs[idx].type == "FISH") {
					this.myNPCs.splice(idx, 1);
					idx -= 1;
					this.spawnFish();
					this.spawnBoat();
				} else {
					this.start();
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
		var newFish = new Fish(Vector.fromComponents(xPos, yPos));
		this.myNPCs.push(newFish);
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
		
		this.myNPCs.push(new Boat(start_position));
	}
	
	this.detectedCollision = function(object1, object2) {
		var wiggleRoom = object1.size + object2.size;
		return (Vector.distance(object1.getPosition(), object2.getPosition()) < wiggleRoom);
	}
	
}


