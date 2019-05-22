var Client = new Client();

function Client() {
	var clientPlayer;
	var controlEnabled = false;
	var name;
	var currentBlockId = 1;
	var blockMaterial = new THREE.MeshBasicMaterial({
    	color: 0xffffff,
    	wireframe: true
	});
	var blockGeometry = new THREE.BoxGeometry(1, 1, 1);
	var block;

	this.setName = function(n) {
		name = n;
	}
	this.getName = function() {
		return name;
	}

	this.load = function() {
		clientPlayer = new ClientPlayer();
		clientPlayer.setX(20);
		clientPlayer.setY(60);
		clientPlayer.setZ(20);
		block = new THREE.Mesh( blockGeometry, blockMaterial );
		block.visible = false;
		scene.add(block);
		return clientPlayer;
	}

	this.enableControls = function() {
		controlEnabled = true;
		document.addEventListener('keydown', onKeyDown, false);
		document.addEventListener('keyup', onKeyUp, false);
		document.addEventListener('keypress', onKeyPress, false);
		document.addEventListener('mousemove', clientPlayer.onMouseMove, false);
		document.addEventListener('mousedown', onMouseDown, false);
		document.addEventListener('mousewheel', onMouseWheel, false);

	}

	this.disableControls = function() {
		controlEnabled = false;
		document.removeEventListener('keydown', onKeyDown, false);
		document.removeEventListener('keyup', onKeyUp, false);
		document.removeEventListener('keypress', onKeyPress, false);
		document.removeEventListener('mousemove', clientPlayer.onMouseMove, false);
		document.removeEventListener('mousedown', onMouseDown, false);
		document.removeEventListener('mousewheel', onMouseWheel, false);
		clearKeys();
	}

	this.getClientPlayer = function(){
		return clientPlayer;
	}
	this.getX = function() {
		return clientPlayer.getX();
	}
	this.getY = function() {
		return clientPlayer.getY();
	}
	this.getZ = function() {
		return clientPlayer.getZ();
	}
	this.getYaw = function() {
		return clientPlayer.getYaw();
	}
	this.getPitch = function() {
		return clientPlayer.getPitch();
	}
	this.getCamera = function() {
		return clientPlayer.getCamera();
	}
	this.getEyesHeight = function() {
		return clientPlayer.getEyesHeight();
	}
	this.getCurrentBlockId = function() {
		return currentBlockId;
	}

	var keyW = false;
	var keyA = false;
	var keyS = false;
	var keyD = false;
	var keySpacebar = false;
	var keyShift = false;
	var keyC = false;

	var keyBlock = false;
	var keyFly = true;

	var velocity = new THREE.Vector3();
	var canJump = true;

	this.move = function() {
		if (delta > 0.5) {
			return;
		}
		velocity.x -= velocity.x * 10.0 * delta;
		velocity.z -= velocity.z * 10.0 * delta;
		if (keyFly) {
			velocity.y -= velocity.y * 10.0 * delta;
		} else {
			velocity.y -= 25.0 * delta;
		}

		var g = 53.0;
		var m = 5.612;

		if (keyC) {
			g = 140.0;
		}

		if ( keyW ) velocity.z = -m;
		if ( keyS ) velocity.z = +m;

		if ( keyA ) velocity.x = -m;
		if ( keyD ) velocity.x = +m;
		if ( keyFly ) {
			if ( keyShift ) velocity.y -= 1;
			if ( keySpacebar ) velocity.y += 1;
		} else {
			if (keySpacebar && canJump) {
				canJump = false;
				velocity.y += 8.0;
			}
		}

		if (velocity.x < 0.01 && velocity.x > -0.01) {
			velocity.x = 0;
		}
		if (velocity.y < 0.01 && velocity.y > -0.01) {
			velocity.y = 0;
		}
		if (velocity.z < 0.01 && velocity.z > -0.01) {
			velocity.z = 0;
		}

		if (keyW || keyS || keyA || keyD || keySpacebar || keyShift) {
		}

		if (velocity.x != 0 || velocity.y != 0 || velocity.z != 0) {
			/*console.log('---xx---');
			console.log(velocity.x);
			console.log(velocity.y);
			console.log(velocity.z);*/
			//sendMovePacket(this.getX(), this.getY(), this.getZ(), this.getYaw(), this.getPitch());
		}

		var _x = clientPlayer.getX();
		var _y = clientPlayer.getY();
		var _z = clientPlayer.getZ();
		var x = _x + (velocity.x * Math.sin(clientPlayer.getYaw()+Math.PI/2)) * delta + (velocity.z * Math.sin(clientPlayer.getYaw())) * delta;
		var y = _y + velocity.y * delta;
		var z = _z + (velocity.x * Math.cos(clientPlayer.getYaw()+Math.PI/2)) * delta + (velocity.z * Math.cos(clientPlayer.getYaw())) * delta;



		var _roundedX = Math.round(_x);
		var _roundedY = Math.round(_y);
		var _roundedZ = Math.round(_z);
		var roundedX = Math.round(x);
		var roundedY = Math.round(y);
		var roundedZ = Math.round(z);
		var _parsedX = parseInt(_x);
		var _parsedY = parseInt(_y);
		var _parsedZ = parseInt(z);
		var parsedX = parseInt(x);
		var parsedY = parseInt(y);
		var parsedZ = parseInt(z);
		if (isBlockA(parsedX, parsedY, parsedZ)) {
			y = _parsedY;
			velocity.y = 0;
			canJump = true;
		}
		if (isBlockA(parsedX, parseInt(y+1.8), parsedZ)) {
			velocity.y = 0;
			console.log('a');
			y = parseInt(y+2)-1.83;
		}
		if (isBlockA(parseInt(x+0.3), parseInt(y), parseInt(z))) {
			x = parseInt(x+0.3)-0.3;
		}
		if (isBlockA(parseInt(x-0.3), parseInt(y), parseInt(z))) {
			x = parseInt(x-0.3)+1.3;
		}
		if (isBlockA(parseInt(x), parseInt(y), parseInt(z+0.3))) {
			z = parseInt(z+0.3)-0.3;
		}
		if (isBlockA(parseInt(x), parseInt(y), parseInt(z-0.3))) {
			z = parseInt(z-0.3)+1.3;
		}

		if (isBlockA(parseInt(x+0.3), parseInt(y)+1, parseInt(z))) {
			x = parseInt(x+0.3)-0.3;
		}
		if (isBlockA(parseInt(x-0.3), parseInt(y)+1, parseInt(z))) {
			x = parseInt(x-0.3)+1.3;
		}
		if (isBlockA(parseInt(x), parseInt(y)+1, parseInt(z+0.3))) {
			z = parseInt(z+0.3)-0.3;
		}
		if (isBlockA(parseInt(x), parseInt(y)+1, parseInt(z-0.3))) {
			z = parseInt(z-0.3)+1.3;
		}
		clientPlayer.setX(x);
		clientPlayer.setY(y);
		clientPlayer.setZ(z);
		var blockDistance = 0;
		for (; blockDistance < 3; blockDistance += 0.5) {
			var blockX = Math.floor(this.getX() + Math.cos(-this.getYaw()-Math.PI/2)*Math.cos(this.getPitch())*blockDistance);
			var blockZ = Math.floor(this.getZ() + Math.sin(-this.getYaw()-Math.PI/2)*Math.cos(this.getPitch())*blockDistance);
			var blockY = Math.floor(this.getY()+clientPlayer.getEntity().getEyesHeight() + Math.sin(this.getPitch())*blockDistance);
			if (isBlockA(blockX, blockY, blockZ)) {
				break;
			}
		}
		if (blockDistance == 3) {
			blockDistance = 3;
		}
		block.position.x = Math.floor(this.getX() + Math.cos(-this.getYaw()-Math.PI/2)*Math.cos(this.getPitch())*blockDistance)+0.5;
		block.position.z = Math.floor(this.getZ() + Math.sin(-this.getYaw()-Math.PI/2)*Math.cos(this.getPitch())*blockDistance)+0.5;
		block.position.y = Math.floor(this.getY()+clientPlayer.getEntity().getEyesHeight() + Math.sin(this.getPitch())*blockDistance)+0.5;
		if (clientPlayer.getY() < 0) {
			//clientPlayer.setY(0);
		}
		sendMovePacket(this.getX(), this.getY(), this.getZ(), this.getYaw(), this.getPitch());
	}

	clearKeys = function() {
    	keyW = false;
    	keyA = false;
    	keyS = false;
    	keyD = false;
    	keyC = false;
    	keySpacebar = false;
    	keyShift = false;
	}

	onKeyDown = function(event) {
	    var keyCode = event.which;
	    switch (keyCode) {
	    case 87: //W
	    	keyW = true;
	    	break;
	    case 65: //A
	    	keyA = true;
	    	break;
	    case 83: //S
	    	keyS = true;
	    	break;
	    case 68: //D
	    	keyD = true;
	    	break;
	    case 32: //SPACEBAR
	    	keySpacebar = true;
	    	break;
	    case 16: //SHIFT
	    	keyShift = true;
	    	break;
	    case 67: //C
	    	keyC = true;
	    	break;
	    case 9:
	    	keyW = false;
	    	keyA = false;
	    	keyS = false;
	    	keyD = false;
	    	keySpacebar = false;
	    	keyShift = false;
	    	keyC = false;
			document.exitPointerLock();
	    	break;
	    default:
	    	console.log('Key: ' + keyCode);
	    }
	};
	onKeyUp = function(event) {
	    var keyCode = event.which;
	    switch (keyCode) {
	    case 87: //W
	    	keyW = false;
	    	break;
	    case 65: //A
	    	keyA = false;
	    	break;
	    case 83: //S
	    	keyS = false;
	    	break;
	    case 68: //D
	    	keyD = false;
	    	break;
	    case 32: //SPACEBAR
	    	keySpacebar = false;
	    	break;
	    case 67: //C
	    	keyC = false;
	    	break;
	    case 16: //SHIFT
	    	keyShift = false;
	    	break;
	    }
	};
	onKeyPress = function(event) {
	    var keyCode = event.which;
	    switch (event.keyCode) {
	    case 114: //R
	    	keyBlock = !keyBlock;
			block.visible = keyBlock;
	    	break;
	    case 102: //F
	    	keyFly = !keyFly;
	    	break;
	    }
	};
	onMouseDown = function(event) {
		if (keyBlock) {
			if (event.which == 1) {
				sendBlockPacket(block.position.x, block.position.y, block.position.z, 0);
				//setBlockAndUpdate(parseInt(block.position.x), parseInt(block.position.y), parseInt(block.position.z), 0);
			}
			if (event.which == 3) {
				//var f = new Foundation(foundation.getX(), foundation.getY(), foundation.getZ(), foundation.getYaw());
				//f.create();
				//foundations.push(f.getObject());
				//setBlockAndUpdate(parseInt(block.position.x), parseInt(block.position.y), parseInt(block.position.z), 2);
				sendBlockPacket(block.position.x, block.position.y, block.position.z, parseInt(currentBlockId));
			}
		}
	};
	onMouseWheel = function(event) {
		var deltaY = event.deltaY;
		if (deltaY >= +100) {
			currentBlockId-=0.5;
		}
		if (deltaY <= -100) {
			currentBlockId+=0.5;
		}
		if (currentBlockId < 1) {
			currentBlockId = 1;
		}
		if (currentBlockId > textureSrc.length) {
			currentBlockId = textureSrc.length;
		}
	};

	ClientPlayer = function() {
		var entity = new PlayerEntity(1000, "You");
		entity.create();
	    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000000);
	    camera.useTarget = false;

		camera.rotation.set( 0, 0, 0 );

		var pitchObject = new THREE.Object3D();
		pitchObject.add(camera);

		var yawObject = new THREE.Object3D();
		yawObject.position.y = 0;
		yawObject.add( pitchObject );

	    scene.add(yawObject);

	    yawObject.position.y = entity.getEyesHeight();

		var PI_2 = Math.PI / 2;

		this.onMouseMove = function(event) {
			var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
			var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

			yawObject.rotation.y -= movementX * 0.002;
			pitchObject.rotation.x -= movementY * 0.002;

			pitchObject.rotation.x = Math.max(- PI_2, Math.min( PI_2, pitchObject.rotation.x ));
		};

		this.getObject = function() {
			return yawObject;
		};
		this.getEntity = function() {
			return entity;
		};

		this.translateXYZ = function(x, y, z) {
			yawObject.translateX(x);
			yawObject.translateY(y);
			yawObject.translateZ(z);
		}
		this.getX = function() {
			return yawObject.position.x;
		}
		this.getY = function() {
			return yawObject.position.y-entity.getEyesHeight();
		}
		this.getZ = function() {
			return yawObject.position.z;
		}
		this.getYaw = function() {
			return yawObject.rotation.y;
		}
		this.getPitch = function() {
			return pitchObject.rotation.x;
		}
		this.setX = function(x) {
			yawObject.position.x = x;
		}
		this.setY = function(y) {
			yawObject.position.y = y+entity.getEyesHeight();
		}
		this.setZ = function(z) {
			yawObject.position.z = z;
		}
		this.setYaw = function(yaw) {
			yawObject.rotation.y = yaw;
		}
		this.setPitch = function(pitch) {
			pitchObject.rotation.x = pitch;
		}

		this.getCamera = function() {
		    return camera;
		};

	};
}