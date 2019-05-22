var Joint2D = function() {
	var pitchAndRollObject = new THREE.Object3D();
	this.add = function(object) {
		pitchAndRollObject.add(object);
	}
	this.getPitch = function() {
		return pitchAndRollObject.rotation.x;
	}
	this.getRoll = function() {
		return pitchAndRollObject.rotation.z;
	}
	this.getX = function() {
		return pitchAndRollObject.position.x;
	}
	this.getY = function() {
		return pitchAndRollObject.position.y;
	}
	this.getZ = function() {
		return pitchAndRollObject.position.z;
	}
	this.setPitch = function(pitch) {
		pitchAndRollObject.rotation.x = pitch;
	}
	this.setRoll = function(roll) {
		pitchAndRollObject.rotation.z = roll;
	}
	this.setX = function(x) {
		pitchAndRollObject.position.x = x;
	}
	this.setY = function(y) {
		pitchAndRollObject.position.y = y;
	}
	this.setZ = function(z) {
		pitchAndRollObject.position.z = z;
	}
	this.getObject = function() {
		return pitchAndRollObject;
	}
}

var Joint3D = function() {
	var yawObject = new THREE.Object3D();
	var pitchAndRollObject = new Joint2D();
	yawObject.add(pitchAndRollObject.getObject());

	this.add = function(object) {
		pitchAndRollObject.add(object);
	}
	this.getYaw = function() {
		return yawObject.rotation.y;
	}
	this.getPitch = function() {
		return pitchAndRollObject.getPitch();
	}
	this.getRoll = function() {
		return pitchAndRollObject.getRoll();
	}
	this.getX = function() {
		return yawObject.position.x;
	}
	this.getY = function() {
		return yawObject.position.y;
	}
	this.getZ = function() {
		return yawObject.position.z;
	}
	this.setYaw = function(yaw) {
		yawObject.rotation.y = yaw;
	}
	this.setPitch = function(pitch) {
		pitchAndRollObject.setPitch(pitch);
	}
	this.setRoll = function(roll) {
		pitchAndRollObject.setRoll(roll);
	}
	this.setX = function(x) {
		yawObject.position.x = x;
	}
	this.setY = function(y) {
		yawObject.position.y = y;
	}
	this.setZ = function(z) {
		yawObject.position.z = z;
	}
	this.getObject = function() {
		return yawObject;
	}
}