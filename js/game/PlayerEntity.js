function PlayerEntity(entityId) {
	var name = "";
	var obj = new THREE.Object3D();
	var body = new THREE.Object3D();
	var rightLegJoint;
	var leftLegJoint;
	var rightArmJoint;
	var leftArmJoint;
	var nameJoint;
	var headJoint;
	var chestObject;
	var eyesHeight;

	this.create = function () {
	    var geometryLegs = new THREE.BoxGeometry(0.2, 0.7, 0.2);
	    var geometryArms = new THREE.BoxGeometry(0.2, 0.7, 0.2);
	    var geometryBody = new THREE.BoxGeometry(0.5, 0.7, 0.2);
	    var geometryHead = new THREE.BoxGeometry(0.5, 0.5, 0.5);

	    var textureLoader = new THREE.TextureLoader();
    	var texture = textureLoader.load('block1.png');

		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( 1, 1 );
    	var material = new THREE.MeshPhongMaterial( { color: 0x999999, map: texture } );

	    //Legs
    	var leftLegObject = new THREE.Mesh(geometryLegs, material);
    	var rightLegObject = new THREE.Mesh(geometryLegs, material);
		leftLegJoint = new Joint2D();
		rightLegJoint = new Joint2D();
    	leftLegJoint.add(leftLegObject);
    	rightLegJoint.add(rightLegObject);
    	leftLegObject.position.y = -geometryLegs.parameters.height/2;
    	rightLegObject.position.y = -geometryLegs.parameters.height/2;
    	leftLegObject.position.x = -0.15;
    	rightLegObject.position.x = 0.15;
    	leftLegJoint.setY(geometryLegs.parameters.height);
    	rightLegJoint.setY(geometryLegs.parameters.height);
    	//Chest
    	chestObject = new THREE.Mesh(geometryBody, material);
    	chestObject.position.y = geometryLegs.parameters.height+geometryBody.parameters.height/2;
    	//Arms
    	var leftArmObject = new THREE.Mesh(geometryArms, material);
    	var rightArmObject = new THREE.Mesh(geometryArms, material);
		leftArmJoint = new Joint2D();
		rightArmJoint = new Joint2D();
    	leftArmJoint.add(leftArmObject);
    	rightArmJoint.add(rightArmObject);
    	leftArmObject.position.y = -geometryArms.parameters.height/2;
    	rightArmObject.position.y = -geometryArms.parameters.height/2;
    	leftArmObject.position.x = -geometryArms.parameters.width/2;
    	rightArmObject.position.x = geometryArms.parameters.width/2;
    	leftArmJoint.setY(geometryLegs.parameters.height+geometryBody.parameters.height);
    	rightArmJoint.setY(geometryLegs.parameters.height+geometryBody.parameters.height);
    	leftArmJoint.setX(-geometryBody.parameters.width/2);
    	rightArmJoint.setX(geometryBody.parameters.width/2);
    	//Head
    	var headObject = new THREE.Mesh(geometryHead, material);
		headJoint = new Joint3D();
		headJoint.add(headObject);
		headObject.position.y = geometryHead.parameters.height/2;
    	nameJoint = new Joint3D();
		headJoint.setY(geometryLegs.parameters.height+geometryBody.parameters.height);
		eyesHeight = geometryLegs.parameters.height+geometryBody.parameters.height+geometryHead.parameters.height/2;
    	nameJoint.setY(2.1);
		obj.add(nameJoint.getObject());

    	body.add(leftLegJoint.getObject());
    	body.add(rightLegJoint.getObject());
    	body.add(leftArmJoint.getObject());
    	body.add(rightArmJoint.getObject());
    	body.add(chestObject);
    	obj.add(body);
    	obj.add(headJoint.getObject());
    	scene.add(obj);
	};
	this.remove = function() {
		scene.remove(obj);
	}
	this.setName = function(_name) {
		name = _name;
    	var text = new THREE.TextBufferGeometry(name, {
        	font: Assets.getFontMain(),
        	size: 0.1,
        	height: 0,
        	curveSegments: 0,
        	bevelEnabled: false
        });
    	text.computeBoundingBox();
    	var textMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff } );
    	var fontMesh = new THREE.Mesh( text, textMaterial );
    	var x = text.boundingBox.max.x - text.boundingBox.min.x;
    	fontMesh.position.set(0-x/2, 0, 0);
    	nameJoint.add(fontMesh);
	}
	this.getName = function() {
		return name;
	}

	this.setLocation = function(x, y, z) {
    	obj.position.x = x;
    	obj.position.y = y;
    	obj.position.z = z;
	};

	this.setHeadYaw = function(angle) {
		angle = Math.normalizeRadians(angle);
		//angle = Math.min(Math.PI/2, Math.max(angle, -Math.PI/2));
    	headJoint.setYaw(angle);
	}
	this.setHeadPitch = function(angle) {
		angle = Math.normalizeRadians(angle);
		angle = Math.min(Math.PI/2, Math.max(angle, -Math.PI/2));
    	headJoint.setPitch(angle);
	}
	this.setBodyYaw = function(angle) {
		angle = Math.normalizeRadians(angle);
		//angle = Math.min(Math.PI/2, Math.max(angle, -Math.PI/2));
    	body.rotation.y = angle;
	}
	this.setNameYaw = function(angle) {
		if (nameJoint == undefined) {
			return;
		}
		angle = Math.normalizeRadians(angle);
		//angle = Math.min(Math.PI/2, Math.max(angle, -Math.PI/2));
    	nameJoint.setYaw(angle);
	}
	this.getBodyYaw = function() {
    	return body.rotation.y;
	}
	this.setRightLeg = function(angle) {
		angle = Math.normalizeRadians(angle);
		angle = Math.min(Math.PI/2, Math.max(angle, -Math.PI/2));
    	rightLegJoint.setPitch(-angle);
	}
	this.setLeftLeg = function(angle) {
		angle = Math.normalizeRadians(angle);
		angle = Math.min(Math.PI/2, Math.max(angle, -Math.PI/2));
    	leftLegJoint.setPitch(-angle);
	}

	this.getX = function() {
		return obj.position.x;
	}
	this.getY = function() {
		return obj.position.y;
	}
	this.getZ = function() {
		return obj.position.z;
	}
	this.setX = function(x) {
		obj.position.x = x;
	}
	this.setY = function(y) {
		obj.position.y = y;
	}
	this.setZ = function(z) {
		obj.position.z = z;
	}
	this.getEyesHeight = function() {
		return eyesHeight;
	}
};