// conn.js
// This whole things needs some serious refactoring and modularity BRO
pc.script.create("conn", function(app) {
	var Conn = function(entity) {
		this.gameMan = this.entity.script.gameMan;
	};
	Conn.prototype = {
		initialize: function() {},
		update: function(dt) {},
		playerConn: function() {
			var socket = this.socket = io.connect("http://localhost:3000");

			if (localStorage) {
				var playerData = JSON.parse(localStorage.getItem("playerData"));
				if (playerData) {
					socket.emit('request_join', playerData);
				} else {
					socket.emit('request_join');
				}
			}

			// Create player locally
			socket.on('accept_join', this.gameMan.playerCreation);

			// Perform updates on opponents
			socket.on('user_update', this.gameMan.opponentUpdate);

			// Remove opponent upon disconnect
			socket.on('remove_user', this.gameMan.opponentRemove);

			// Deal with refusal if server doesn't like you
			socket.on('refuse_join', function(res) {
				if (res.status === "Error") {
					console.error(res.msg);
				}
			});
		},
		sendPlayerData: function() {
			var data = this.player.script.playerData.getData();
			this.socket.emit('player_update', data);
			setTimeout(this.sendPlayerData.bind(this), 100);
		}
	};

	return Conn;
});