importScripts('/js/three.js');  
onmessage = function(e) {
				var fontLoader = new THREE.FontLoader();
				fontLoader.load('/fonts/font_default.json', function (font) {
					var text = new THREE.TextBufferGeometry(e.data[0], {
						font: font,
						size: 0.1,
						height: 0,
						curveSegments: 0,
						bevelEnabled: false
					});
					console.log(text.buffer);
    				postMessage(text, [text.buffer]);
				});
  			}