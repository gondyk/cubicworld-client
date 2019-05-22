var testMesh = new TestMesh();

function TestMesh() {

	var geometry;
	var mesh;

	this.create = function() {
		geometry = new THREE.Geometry();
	    var mat1 = new THREE.MeshBasicMaterial();
	    mat1.color = new THREE.Color( 0x00ff00 );
	    mat1.side = THREE.DoubleSide;
   		mesh = new THREE.Mesh(geometry, THREE.MeshFaceMaterial(mat1));
    	mesh.position.x = 0;
    	mesh.position.y = 0;
   		mesh.position.z = 0;
   		scene.add(mesh);
	}
	this.addObject = function(object) {

	}
	this.addVertice = function(x, y, z) {

	}
}
function Foundation(x, y, z, yaw) {

	var obj = new THREE.Object3D();
    obj.position.x = x;
    obj.position.y = y;
    obj.position.z = z;
    obj.rotation.y = yaw;

	this.create = function () {
	    var geometryLeg = new THREE.BoxGeometry(0.1, 30, 0.1);
	    var geometryPlate = new THREE.BoxGeometry(2, 0.2, 2);

	    var textureLoader = new THREE.TextureLoader();
    	var texture = textureLoader.load('block.png');

		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( 1, 1 );
    	var material = new THREE.MeshPhongMaterial( { color: 0x999999, map: texture } );

	    //Legs
    	var plateObject = new THREE.Mesh(geometryPlate, material);
    	plateObject.position.x = 0;
    	plateObject.position.y = 0;
    	plateObject.position.z = 0;
    	var legObject1 = new THREE.Mesh(geometryLeg, material);
    	var legObject2 = new THREE.Mesh(geometryLeg, material);
    	var legObject3 = new THREE.Mesh(geometryLeg, material);
    	var legObject4 = new THREE.Mesh(geometryLeg, material);
    	legObject1.position.x = +geometryPlate.parameters.width/2 - (geometryLeg.parameters.width/2 + 0.01);
    	legObject1.position.z = +geometryPlate.parameters.depth/2 - (geometryLeg.parameters.depth/2 + 0.01);
    	legObject2.position.x = -geometryPlate.parameters.width/2 + (geometryLeg.parameters.width/2 + 0.01);
    	legObject2.position.z = -geometryPlate.parameters.depth/2 + (geometryLeg.parameters.depth/2 + 0.01);
    	legObject3.position.x = +geometryPlate.parameters.width/2 - (geometryLeg.parameters.width/2 + 0.01);
    	legObject3.position.z = -geometryPlate.parameters.depth/2 + (geometryLeg.parameters.depth/2 + 0.01);
    	legObject4.position.x = -geometryPlate.parameters.width/2 + (geometryLeg.parameters.width/2 + 0.01);
    	legObject4.position.z = +geometryPlate.parameters.depth/2 - (geometryLeg.parameters.depth/2 + 0.01);
    	legObject1.position.y = -geometryLeg.parameters.height/2 - 0.01;
    	legObject2.position.y = -geometryLeg.parameters.height/2 - 0.01;
    	legObject3.position.y = -geometryLeg.parameters.height/2 - 0.01;
    	legObject4.position.y = -geometryLeg.parameters.height/2 - 0.01;

    	obj.add(plateObject);
    	obj.add(legObject1);
    	obj.add(legObject2);
    	obj.add(legObject3);
    	obj.add(legObject4);
    	console.log(obj);
    	scene.add(obj);
	};

	this.setLocation = function(x, y, z) {
    	obj.position.x = x;
    	obj.position.y = y;
    	obj.position.z = z;
	};
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
	this.getYaw = function() {
    	return obj.rotation.y;
	}
	this.setYaw = function(angle) {
		angle = Math.normalizeRadians(angle);
    	obj.rotation.y = angle;
	}
	this.setVisible = function(isVisible) {
		obj.visible = isVisible;
	}
	this.getObject = function() {
		return obj;
	}
};