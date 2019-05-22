function Reader(bytes) {
  	var i = 0;
	var d = new DataView(bytes.buffer);
	this.readBytes = function(size) {
		console.log('A1: ' + size);
		var a = [];
		for (var j = 0; j < size; j++) {
			a[j] = d.getUint8(j+i);
		}
		i+=size;
		return a;
	}
	this.readByte = function(size) {
	    var a = d.getUint8(i);
	    i+=1;
	    return a;
	}
  	this.readInt = function() {
	    var a = d.getInt32(i);
	    i+=4;
	    return a;
  	}
  	this.readDouble = function() {
  		var a = d.getInt64(i);
	    i+=8;
	    return a;
  	}
  	this.readFloat = function() {
	    var a = d.getFloat32(i);
	    i+=4;
	    return a;
  	}
  	this.readDouble = function() {
	    var a = d.getFloat64(i);
	    i+=8;
	    return a;
  	}
  	this.readString = function() {
	    var length = this.readInt();
	    var a = String.fromCharCode.apply(null, new Uint8Array(bytes.slice(i, i+length)));
	    var b = decodeURIComponent(escape(a));
	    i+=length;
	    return b;
  	}
}
function Writer() {

	var data = new Array();
	var i = 0;

  	this.writeInt = function(a) {
		var arr = new Uint8Array(4);
		var v = new DataView(arr.buffer);
		v.setInt32(0, a);
	    this.fa(i, arr);
	    i+=4;
  	}
  	this.writeLong = function(a) {
		var arr = new Uint8Array(8);
		var v = new DataView(arr.buffer);
		v.setInt64(0, a);
	    this.fa(i, arr);
	    i+=8;
  	}
  	this.writeFloat = function(a) {
		var arr = new Uint8Array(4);
		var v = new DataView(arr.buffer);
		v.setFloat32(0, a);
	    this.fa(i, arr);
	    i+=4;
  	}
  	this.writeDouble = function(a) {
		var arr = new Uint8Array(8);
		var v = new DataView(arr.buffer);
		v.setFloat64(0, a);
	    this.fa(i, arr);
	    i+=8;
  	}
  	this.writeString = function(a) {
    	var b = unescape(encodeURIComponent(a));
        var charList = b.split('');
        var uintArray = [];
  		var length = charList.length;
  		this.writeInt(length);
    	for (var j = 0; j < charList.length; j++) {
        	uintArray.push(charList[j].charCodeAt(0));
    	}
	    this.fa(i, new Uint8Array(uintArray));
	    i+=length;
  	}

  	this.getBytes = function() {
  		var bytes = new Uint8Array(data.length);
  		for (var i=0; i<data.length; i++) {
    		bytes[i] = data[i];
		}
		return bytes;
  	}

  	this.fa = function(x, arr) {
  		for (var j = 0; j < arr.length; j++) {
  			data[j+x] = arr[j];
  		}
  	}
}