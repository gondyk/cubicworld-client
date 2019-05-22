var Controls = new Controls();

function Controls() {
	var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

	this.isPointerLockSupported = function() {
		return havePointerLock;
	}

	this.loadEvents = function() {
		var element = document.body;
		onPointerLockChange = function (event) {
			if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
				Client.enableControls();
			} else {
				Client.disableControls();
			}
		};
		onPointerLockError = function (event) {
			console.log(event);
		};
		// Hook pointer lock state change events
		document.addEventListener( 'pointerlockchange', onPointerLockChange, false );
		document.addEventListener( 'mozpointerlockchange', onPointerLockChange, false );
		document.addEventListener( 'webkitpointerlockchange', onPointerLockChange, false );

		document.addEventListener( 'pointerlockerror', onPointerLockError, false );
		document.addEventListener( 'mozpointerlockerror', onPointerLockError, false );
		document.addEventListener( 'webkitpointerlockerror', onPointerLockError, false );

		document.getElementById('game').addEventListener( 'click', function ( event ) {
			element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
			element.requestPointerLock();
		}, false );

		//CHAT
		document.getElementById('chat-input').addEventListener( 'keypress', function ( event ) {
			var keyCode = event.which;
			if (keyCode == 13) {
				var msg = $('#chat-input').val();
				$('#chat-input').val('');
				if (msg == '') {
					return;
				}
				sendChatPacket(msg);
			}
		}, false );
		document.addEventListener( 'keypress', function (event) {
			var keyCode = event.which;
			if (event.srcElement != document.body) {
				return;
			}
			if (keyCode == 116) {
				document.exitPointerLock();
				Client.disableControls();
				setTimeout(function() {
					$('#chat-input').val('');
				$('#chat-input').focus();
				$('#chat-input').select();
				}, 50);
			}
		}, false );
	}
}