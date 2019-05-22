var Assets = new Assets();

function Assets() {

	var fontLoader = new THREE.FontLoader();

	var fontMain;

	this.load = function(func) {
		loadFonts();

		var o = setInterval(function() {
			if (fontMain) {
				window.clearInterval(o);
				console.log('Assets loaded!');
				func();
				return;
			}
		}, 100);
	}
	var loadFonts = function() {
		var font;
		fontLoader.load('fonts/font_default.json', function (font) {
			fontMain = font;
		});
	}
	this.getFontMain = function() {
		return fontMain;
	}

}