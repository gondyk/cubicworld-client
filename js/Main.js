var scene;
var renderer;
var geometry, material, mesh;
var socket;
var version = "ALFA 1.5";

var isUsernameSet = false;
var clock;
var delta;

$( document ).ready(function() {

	$('#chat').hide();

	document.getElementById('username-input').addEventListener( 'keypress', function ( event ) {
		if (isUsernameSet) {
			return;
		}
		var keyCode = event.which;
		if (keyCode == 13) {
			var username = $('#username-input').val();
			if (username == '') {
				return;
			}
			$('#login').hide();
			console.log('Username: ' + username)
    		Client.setName(username);
    		isUsernameSet = true;
			Assets.load(init0);
		}
	}, false );

});

function init0() {
	clock = new THREE.Clock();
	clock.start();
	scene = new THREE.Scene();
	$('#chat').show();
	registerSocket();
	var o = setInterval(function() {
		if (socket.readyState == 1) {
			window.clearInterval(o);
			console.log('Connected :)');
			init1();
			return;
		}
		console.log('Connecting to server...');
	}, 200);
}

function init1() {
	if (!Controls.isPointerLockSupported) {
		console.log('No Pointer Lock :(');
		return;
	}
	Controls.loadEvents();
	test2();
	init2();
	animate();
}

function init2() {

	Client.load();
	sendRegisterPacket();

	var sky = new THREE.Sky();
	var uniforms = sky.uniforms;
	uniforms.turbidity.value = 10;
	uniforms.rayleigh.value = 1;
	uniforms.luminance.value = 1;
	uniforms.mieCoefficient.value = 0.005;
	uniforms.mieDirectionalG.value = 0.8;

	scene.add(sky.mesh);

	var sunSphere = new THREE.Mesh(
					new THREE.SphereBufferGeometry( 50, 16, 8 ),
					new THREE.MeshBasicMaterial( { color: 0xffffff } )
				);

	
	var distance = 1000;
	var inclination = -0.1; 
	var azimuth = 0.25;

	var theta = Math.PI * (inclination - 0.5);
	var phi = 2 * Math.PI * (azimuth - 0.5);
	sunSphere.position.x = distance * Math.cos( phi );
	sunSphere.position.y = distance * Math.sin( phi ) * Math.sin( theta );
	sunSphere.position.z = distance * Math.sin( phi ) * Math.cos( theta );




	var ambientLight = new THREE.AmbientLight(0x888888);
	scene.add(ambientLight);
	
	var dayCycle = 0;
	setInterval(function() {
		var inclination = dayCycle; 
		var azimuth = 0.25;
		var theta = Math.PI * (inclination - 0.5 );
		var phi = 2 * Math.PI * (azimuth - 0.5 );
		sunSphere.position.x = distance * Math.cos( phi );
		sunSphere.position.y = distance * Math.sin( phi ) * Math.sin( theta );
		sunSphere.position.z = distance * Math.sin( phi ) * Math.cos( theta );
		sky.uniforms.sunPosition.value.copy(sunSphere.position);
		var col = Math.sin(Math.PI*(dayCycle+0.5));
		if (col < 0.2) {
			col = 0.2;
		}
		ambientLight.color.r = col;
		ambientLight.color.g = col;
		ambientLight.color.b = col;
	}, 500);

	sunSphere.visible = true;

	scene.add(sunSphere);

    geometry = new THREE.BoxGeometry(1, 1, 1);

    material = new THREE.MeshBasicMaterial({
        color: 0x42f468,
        wireframe: false
    });

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;

    document.getElementById("game").appendChild(renderer.domElement);
	window.addEventListener('resize', onWindowResize, false );
	loadBlockTextureMap();
	loadBlockMaterialMap();
	setInterval(function() {
		updateChunks();
	}, 2000);
}



var frames = 0;
var lastTime = new Date().getTime();
var fps = 0;

function animate() {
	delta = clock.getDelta();
	var time = new Date().getTime();
	if (time - lastTime > 1000) {
		fps = frames;
		lastTime = time;
		frames = 0;
	}
	frames++
   	requestAnimationFrame(animate);
    Client.move();
    $('#debug').html(
    	'X: ' + Client.getX() + '<br>' +
    	'Y: ' + Client.getY() + '<br>' +
    	'Z: ' + Client.getZ() + '<br>' +
    	'Yaw: ' + Client.getYaw() + '<br>' +
    	'Pitch: ' + Client.getPitch() + '<br>' +
    	'FPS: ' + fps + '<br>' +
    	'Delta ' + delta + '<br>' +
    	'Name: ' + Client.getName() + '<br>' +
    	'Version: ' + version + '<br>' +
    	'Current Block: ' + textureSrc[parseInt(Client.getCurrentBlockId())-1] + '<br>' +
    	'');
    renderer.render(scene, Client.getCamera());

}

function sendMovePacket(x, y, z, yaw, pitch) {
	var writer = new Writer();
	writer.writeInt(0x02);
	writer.writeFloat(x);
	writer.writeFloat(y);
	writer.writeFloat(z);
	writer.writeFloat(yaw);
	writer.writeFloat(pitch);
	sendPacket(writer);
}
function sendChatPacket(msg) {
	var writer = new Writer();
	writer.writeInt(0x03);
	writer.writeString(msg);
	sendPacket(writer);
}
function sendRegisterPacket(msg) {
	var writer = new Writer();
	writer.writeInt(0x00);
	writer.writeString(Client.getName());
	sendPacket(writer);
}
function sendBlockPacket(x, y, z, material) {
	var writer = new Writer();
	writer.writeInt(0x01);
	writer.writeInt(x);
	writer.writeInt(y);
	writer.writeInt(z);
	writer.writeInt(material);
	sendPacket(writer);
}

function onWindowResize() {

	Client.getCamera().aspect = window.innerWidth / window.innerHeight;
	Client.getCamera().updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );

}

function onPacketReceive(reader) {
	var id = reader.readInt();
	console.log('In Packet: ' + id);
	if (id == 0x00) {
		var x = reader.readInt();
		var z = reader.readInt();
		var blocks = reader.readBytes(16*16*256);
		setTimeout(function() {
			var chunk = getChunk(x, z);
			chunk.setBlocks(blocks);
			//chunk.update();
		}, 200);
	}
	if (id == 0x01) {
		var x = reader.readInt();
		var y = reader.readInt();
		var z = reader.readInt();
		var material = reader.readInt();
		setBlockAndUpdate(x, y, z, material);
	}
	if (id == 0x02) {
		var playerId = reader.readInt();
		var name = reader.readString();
		var mpPlayer = getPlayer(playerId);
		mpPlayer.setName(name);
	}
	if (id == 0x03) {
		var playerId = reader.readInt();
		var x = reader.readFloat();
		var y = reader.readFloat();
		var z = reader.readFloat();
		var yaw = reader.readFloat();
		var pitch = reader.readFloat();
		var mpPlayer = getPlayer(playerId);
		var playerEntity = mpPlayer.getPlayerEntity();
		playerEntity.setX(x);
		playerEntity.setY(y);
		playerEntity.setZ(z);
		playerEntity.setHeadYaw(yaw);
		playerEntity.setHeadPitch(pitch);
		var headYaw = Math.normalizeRadians(yaw);
		var bodyYaw = playerEntity.getBodyYaw();
		var x1 = Math.normalizeRadians(Math.atan2(Math.sin(headYaw), Math.cos(headYaw)) - Math.atan2(Math.sin(bodyYaw), Math.cos(bodyYaw))) > 0;
		var max = Math.PI/4;
		bodyYaw += (x1 ? 1 : -1) * Math.max(Math.angleDifference(headYaw, bodyYaw)-max, 0);
		playerEntity.setBodyYaw(bodyYaw);
		playerEntity.setNameYaw(Client.getYaw());
	}
	if (id == 0x04) {
		var text = reader.readString();
		var str = text + '<br/>';
		$('#chat-history').append(str);
		$('#chat-history').scrollTop(10000000000);
	}
}

var sendPacket = function(writer) {
	socket.send(writer.getBytes().buffer);
}

var registerSocket = function() {
	socket = new WebSocket("ws://localhost:35564");
	socket.binaryType = "arraybuffer";
	socket.onmessage = function(e) {
  		var data = e.data;
  		var bytes = new Uint8Array(data);
		onPacketReceive(new Reader(bytes));
	};
}