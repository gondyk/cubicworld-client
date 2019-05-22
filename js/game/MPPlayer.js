var players = {};

function getPlayer(id) {
	if (players[id] == undefined) {
		players[id] = new MPPlayer(id);
	}
	return players[id];
}

function MPPlayer(id) {
	players[id] = this;
	var playerEntity = new PlayerEntity();
	playerEntity.create();
	console.log('New player: ' + id);

	this.setName = function(name) {
		playerEntity.setName(name);
	}

	this.getPlayerEntity = function() {
		return playerEntity;
	}

}