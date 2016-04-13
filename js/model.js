
/**
 * The Model is a container for a set of bodies. You'll be able to 
 * manipulate them through here!
 */
 
var Model = function() {
	
	//this.nessiePosition = Vector.fromComponents(50, 50);
	//this.nessieSpeed = 100; //One screen per second.
	//this.nessieTarget = Vector.fromComponents(50, 50);
	
	this.nessie = new Entity(50, 50);
	this.nessie.speed = 100
	
	this.myNPCs = [];
	
	this.update = function(delta_time) {
		this.nessie.chase(delta_time, myController.getTarget());
		for (idx in this.myNPCs) {
			this.myNPCs[idx].chase(delta_time, this.getNessie());
		}
	}
	
	this.getNessie = function() {
		return this.nessie.getPosition();
	}
	
	this.spawnBoat = function() {
		var newBoat = new Entity(50, 50);
		this.myNPCs.push(newBoat);
	}
}


