Math.radians = function(degrees) {
  	return degrees * Math.PI / 180;
};
Math.angleDifference = function(x, y) {
	return Math.min((2 * Math.PI) - Math.abs(x - y), Math.abs(x - y));
}
Math.PI_TIMES_2 = Math.PI*2;
Math.normalizeRadians = function(angle) {
  	while (angle > Math.PI) {
  		angle -= Math.PI_TIMES_2;
  	}
 	while (angle <= -Math.PI) {
    	angle += Math.PI_TIMES_2;
  	}
  	return angle;
};