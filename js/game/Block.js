var textureSrc = ['stone','dirt','grass','cobblestone','sand','gravel','brick','bedrock','obsidian', 'planks_oak', 'planks_birch', 'planks_spruce', 'planks_jungle', 'log_oak', 'log_birch', 'log_spruce', 'log_jungle', 'leaves_oak'];
var textures = [];
var materials;

var chunks = [];

function BlockLocation(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;

	this.getX = function() {
		return x;
	}

	this.getY = function() {
		return y;
	}

	this.getZ = function() {
		return z;
	}
}

function Chunk(x, z) {
	var x = x;
	var z = z;
	var blocks = [];
	var needUpdate = false;
	chunks.push(this);
	this.mesh = undefined;
	var isLoaded = false;
	for (var i = 0; i < 16*16*256; i++) {
		blocks[i] = 0;
	}
	this.getX = function() {
		return x;
	}
	this.getZ = function() {
		return z;
	}
	this.isChunk = function(x, z) {
		return this.getX() == x && this.getZ() == z;
	}
	this.setBlock = function(x, y, z, material) {
		if (x > 15 || x < 0 || y > 255 || y < 0 || z > 15 || z < 0) {
			return;
		}
		blocks[x + (z << 4) + (y << 8)] = material;
		needUpdate = true;
	}
	this.getBlock = function(x, y, z) {
		if (!isLoaded) {
			return 0;
		}
		if (x > 15 || x < 0 || y > 255 || y < 0 || z > 15 || z < 0) {
			return 0;
		}
		return blocks[x + (z << 4) + (y << 8)];
	}
	this.getBlockIgnoreLoaded = function(x, y, z) {
		if (x > 15 || x < 0 || y > 255 || y < 0 || z > 15 || z < 0) {
			return 0;
		}
		return blocks[x + (z << 4) + (y << 8)];
	}
	this.isBlock = function(x, y, z) {
		if (!isLoaded) {
			return false;
		}
		if (x > 15 || x < 0 || y > 255 || y < 0 || z > 15 || z < 0) {
			return false;
		}
		return blocks[x + (z << 4) + (y << 8)] > 0;
	}
	this.setBlocks = function(_blocks) {
		for (var i = 0; i < 16*16*256; i++) {
			blocks[i] = _blocks[i];
		}
		needUpdate = true;
	}
	this.update = function() {
		updateChunk(x, z);
		needUpdate = false;
	}
	this.isLoaded = function() {
		return loaded;
	}
	this.setLoaded = function(_isLoaded) {
		isLoaded = _isLoaded;
	}
	this.isNeedUpdate = function() {
		return needUpdate;
	}
	this.setNeedUpdate = function() {
		needUpdate = true;
	}
}

function updateChunks() {
	for (var i in chunks) {
		var chunk = chunks[i];
		if (chunk.isNeedUpdate()) {
			chunk.update();
		}
	}
}

function isChunkExist(x, z) {
	for (var i in chunks) {
		var chunk = chunks[i];
		if (chunk.isChunk(x, z)) {
			return true;
		}
	}
	return false;
}

function getChunk(x, z) {
	for (var i in chunks) {
		var chunk = chunks[i];
		if (chunk.isChunk(x, z)) {
			return chunk;
		}
	}
	return new Chunk(x, z);
}


function setBlock(x, y, z, material) {
	var chunk_x = parseInt(x / 16);
	var chunk_z = parseInt(z / 16);
	x = x % 16;
	z = z % 16;
	getChunk(chunk_x, chunk_z).setBlock(x, y, z, material);
}
function setBlockAndUpdate(x, y, z, material) {
	setBlock(x, y, z, material);
	updateChunk(parseInt(x/16), parseInt(z/16));
}

function isBlockA(x, y, z) {
	return isBlock(parseInt(x/16), parseInt(z/16), x%16, y, z%16);
}
function isBlock(chunk_x, chunk_z, x, y, z) {
	if (!isChunkExist(chunk_x, chunk_z)) {
		return false;
	}
	return getChunk(chunk_x, chunk_z).getBlock(x, y, z) > 0;
}
function getBlock(chunk_x, chunk_z, x, y, z) {
	if (!isChunkExist(chunk_x, chunk_z)) {
		return 0;
	}
	return getChunk(chunk_x, chunk_z).getBlock(x, y, z);
}

function Block(x, y, z, material) {
	this.x = x;
	this.y = y;
	this.z = z;
	this.material = material;
};

function loadBlockTextureMap() {
	var textureLoader = new THREE.TextureLoader();
	for (var i = 0; i < textureSrc.length; i++) {
		textures[i] = textureLoader.load('/assets/textures/' + textureSrc[i] + '.png');
		console.log('/assets/textures/' + textureSrc[i] + '.png');
	}
}
function loadBlockMaterialMap() {
	var mats = [];
	for (var i = 0; i < textures.length; i++) {
		var mat = new THREE.MeshLambertMaterial();
	    mat.map = textures[i];
	    mat.color = new THREE.Color( 0xffffff );
	    mat.side = THREE.OneSide;
	    mat.map.repeat.set( 1, 1 );
	    mat.map.wrapS = mat.map.wrapT = THREE.RepeatWrapping;
	    //mat.wireframe = true;
		mats[i] = mat;
	}
	materials = THREE.MeshFaceMaterial(mats);
}

function updateChunk(chunk_x, chunk_z) {
	var chunk = getChunk(chunk_x, chunk_z);
	if (chunk.mesh == undefined)  {
		var geom = new THREE.Geometry();
		chunk.mesh = new THREE.Mesh(geom, materials);
	    var mesh = chunk.mesh;
	    var i = 0;
	    mesh.geometry.uvsNeedUpdate = true;
	    mesh.position.x = chunk_x*16;
	    mesh.position.y = 0;
	    mesh.position.z = chunk_z*16;
    	scene.add(mesh);
	}
	var chunkPlusX = getChunk(chunk_x+1, chunk_z);
	var chunkMinusX = getChunk(chunk_x-1, chunk_z);
	var chunkPlusZ = getChunk(chunk_x, chunk_z+1);
	var chunkMinusZ = getChunk(chunk_x, chunk_z-1);
	chunk.setLoaded(true);
	var geom = chunk.mesh.geometry;
    geom.faceVertexUvs[0] = [];
    geom.faces = [];
    geom.vertices = [];
    var t2 = geom.faceVertexUvs[0];

    testF(16, 256, 16, -1, function(z, y, x) {
    	if (z == -1) {
    		return chunkMinusZ.getBlockIgnoreLoaded(x, y, 15);
    	}
    	return chunk.getBlock(x, y, z);
    }, function(z, y, x, _y, _x, material) {
    	var a1 = getIndex(new THREE.Vector3(_x, _y, z));
   		var a2 = getIndex(new THREE.Vector3(_x, y, z));
   		var a3 = getIndex(new THREE.Vector3(x, y, z));
    	var a4 = getIndex(new THREE.Vector3(x, _y, z));
    	geom.faces.push(new THREE.Face3(a1, a2, a3, undefined, undefined, material-1));
    	geom.faces.push(new THREE.Face3(a1, a3, a4, undefined, undefined, material-1));
    	var uvX = _x - x;
    	var uvY = _y - y;
    	t2.push([
	        new THREE.Vector2( 0, 1*uvY ),
	        new THREE.Vector2( 0, 0 ),
	        new THREE.Vector2( 1*uvX, 0 ),
	    ]);
	    t2.push([
	        new THREE.Vector2( 0, 1*uvY ),
	        new THREE.Vector2( 1*uvX, 0 ),
	        new THREE.Vector2( 1*uvX, 1*uvY ),
	    ]);
    });

    testF(16, 256, 16, +1, function(z, y, x) {
    	if (z == 16) {
    		return chunkPlusZ.getBlockIgnoreLoaded(x, y, 0);
    	}
    	return chunk.getBlock(x, y, z);
    }, function(z, y, x, _y, _x, material) {
    	var a1 = getIndex(new THREE.Vector3(x, _y, z+1));
   		var a2 = getIndex(new THREE.Vector3(x, y, z+1));
   		var a3 = getIndex(new THREE.Vector3(_x, y, z+1));
    	var a4 = getIndex(new THREE.Vector3(_x, _y, z+1));
    	geom.faces.push(new THREE.Face3(a1, a2, a3, undefined, undefined, material-1));
    	geom.faces.push(new THREE.Face3(a1, a3, a4, undefined, undefined, material-1));
    	var uvX = _x - x;
    	var uvY = _y - y;
    	t2.push([
	        new THREE.Vector2( 0, 1*uvY ),
	        new THREE.Vector2( 0, 0 ),
	        new THREE.Vector2( 1*uvX, 0 ),
	    ]);
	    t2.push([
	        new THREE.Vector2( 0, 1*uvY ),
	        new THREE.Vector2( 1*uvX, 0 ),
	        new THREE.Vector2( 1*uvX, 1*uvY ),
	    ]);
    });

    testF(16, 256, 16, -1, function(x, y, z) {
    	if (x == -1) {
    		return chunkMinusX.getBlockIgnoreLoaded(15, y, z);
    	}
    	return chunk.getBlock(x, y, z);
    }, function(x, y, z, _y, _z, material) {
    	var a1 = getIndex(new THREE.Vector3(x, _y, _z));
   		var a2 = getIndex(new THREE.Vector3(x, y, _z));
   		var a3 = getIndex(new THREE.Vector3(x, y, z));
    	var a4 = getIndex(new THREE.Vector3(x, _y, z));
    	geom.faces.push(new THREE.Face3(a3, a2, a1, undefined, undefined, material-1));
    	geom.faces.push(new THREE.Face3(a3, a1, a4, undefined, undefined, material-1));
    	var uvZ = _z - z;
    	var uvY = _y - y;
    	t2.push([
	        new THREE.Vector2( 0, 0),
	        new THREE.Vector2( 1*uvZ, 0 ),
	        new THREE.Vector2( 1*uvZ, 1*uvY  ),
	    ]);
	    t2.push([
	        new THREE.Vector2( 0, 0 ),
	        new THREE.Vector2( 1*uvZ, 1*uvY ),
	        new THREE.Vector2( 0, 1*uvY ),
	    ]);
    });

    testF(16, 256, 16, +1, function(x, y, z) {
    	if (x == 16) {
    		return chunkPlusX.getBlockIgnoreLoaded(0, y, z);
    	}
    	return chunk.getBlock(x, y, z);
    }, function(x, y, z, _y, _z, material) {
    	var a1 = getIndex(new THREE.Vector3(x+1, _y, _z));
   		var a2 = getIndex(new THREE.Vector3(x+1, y, _z));
   		var a3 = getIndex(new THREE.Vector3(x+1, y, z));
    	var a4 = getIndex(new THREE.Vector3(x+1, _y, z));
    	geom.faces.push(new THREE.Face3(a1, a2, a3, undefined, undefined, material-1));
    	geom.faces.push(new THREE.Face3(a1, a3, a4, undefined, undefined, material-1));
    	var uvZ = _z - z;
    	var uvY = _y - y;
    	t2.push([
	        new THREE.Vector2( 0, 1*uvY ),
	        new THREE.Vector2( 0, 0 ),
	        new THREE.Vector2( 1*uvZ, 0 ),
	    ]);
	    t2.push([
	        new THREE.Vector2( 0, 1*uvY ),
	        new THREE.Vector2( 1*uvZ, 0 ),
	        new THREE.Vector2( 1*uvZ, 1*uvY ),
	    ]);
    });

    testF(255, 16, 16, -1, function(y, x, z) {
    	return chunk.getBlock(x, y, z);
    }, function(y, x, z, _x, _z, material) {
    	var a1 = getIndex(new THREE.Vector3(_x, y, _z));
   		var a2 = getIndex(new THREE.Vector3(x, y, _z));
   		var a3 = getIndex(new THREE.Vector3(x, y, z));
    	var a4 = getIndex(new THREE.Vector3(_x, y, z));
    	geom.faces.push(new THREE.Face3(a1, a2, a3, undefined, undefined, material-1));
    	geom.faces.push(new THREE.Face3(a1, a3, a4, undefined, undefined, material-1));
    	var uvX = _x - x;
    	var uvZ = _z - z;
    	t2.push([
	        new THREE.Vector2( 1*uvX, 0 ),
	        new THREE.Vector2( 0, 0 ),
	        new THREE.Vector2( 0, 1*uvZ ),
	    ]);
	    t2.push([
	        new THREE.Vector2( 1*uvX, 0 ),
	        new THREE.Vector2( 0, 1*uvZ ),
	        new THREE.Vector2( 1*uvX, 1*uvZ ),
	    ]);
    });

    testF(255, 16, 16, +1, function(y, x, z) {
    	return chunk.getBlock(x, y, z);
    }, function(y, x, z, _x, _z, material) {
		var a1 = getIndex(new THREE.Vector3(_x, y+1, _z));
   		var a2 = getIndex(new THREE.Vector3(x, y+1, _z));
   		var a3 = getIndex(new THREE.Vector3(x, y+1, z));
    	var a4 = getIndex(new THREE.Vector3(_x, y+1, z));
    	geom.faces.push(new THREE.Face3(a3, a2, a1, undefined, undefined, material-1));
    	geom.faces.push(new THREE.Face3(a3, a1, a4, undefined, undefined, material-1));
    	var uvX = _x - x;
    	var uvZ = _z - z;
    	t2.push([
	        new THREE.Vector2( 0, 1*uvZ ),
	        new THREE.Vector2( 0, 0 ),
	        new THREE.Vector2( 1*uvX, 0 ),
	    ]);
	    t2.push([
	        new THREE.Vector2( 0, 1*uvZ ),
	        new THREE.Vector2( 1*uvX, 0 ),
	        new THREE.Vector2( 1*uvX, 1*uvZ ),
	    ]);
    });

    function testF(rMax, sMax, tMax, rDelta, runnableGetBlock, runnableGenerate) {
    	var test2 = new Map();
	    for (var r = 0; r < rMax; r++) {
	    	for (var s = 0; s < sMax; s++) {
				for (var t = 0; t < tMax; t++) {
					var block = runnableGetBlock(r, s, t);
					if (runnableGetBlock(r+rDelta, s, t,) == 0 && block != 0) {
						test2[t + (s << 4)] = block;
					}
				}
			}
			for (var i in test2) {
				var a = test2[i];
				var t = i & 0xF;
				var s = (i >> 4) & 0xFF;
				var a = test2[t + (s << 4)];
				var o = [];
				if (a == -1) {
					continue;
				}
				var _s = s;
				var _t = t;
				for (; _t < 16; _t++) {
					if (test2[_t + (_s << 4)] != a) {
						break;
					}
				}
				for (; _s < 256; _s++) {
					var ok = true;
					for (__t=t; __t < _t; __t++) {
						if (test2[__t + (_s << 4)] != a) {
							ok = false;
						}
					}
					if (!ok) {
						break;
					}
					for (__t=t; __t < _t; __t++) {
						delete test2[__t + (_s << 4)];
					}
				}
				if (a != 0) {
					runnableGenerate(r, s, t, _s, _t, a);
				}
			}
	    }
    }
    geom.sortFacesByMaterialIndex();
	geom.mergeVertices();


	function getIndex(x) {
		/*for (var i in geom.vertices) {
			var y = geom.vertices[i];
			if (y.x == x.x && y.y == x.y && y.z == x.z) {
				return i;
			}
		}*/
		return geom.vertices.push(x)-1;
	}
	/*geom.groupsNeedUpdate = true;
	geom.normalsNeedUpdate = true;
	geom.elementsNeedUpdate = true;
	geom.verticesNeedUpdate = true;
	geom.uvsNeedUpdate = true;
	geom.computeFaceNormals();
	geom.computeBoundingBox();
	geom.computeBoundingSphere();*/
	geom.verticesNeedUpdate = true;
	geom.elementsNeedUpdate = true;
	geom.uvsNeedUpdate = true;
	geom.computeFaceNormals();
	geom.computeBoundingBox();
	geom.computeBoundingSphere();

}

