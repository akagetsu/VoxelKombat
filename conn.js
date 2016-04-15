// conn.js
// This whole things needs some serious refactoring and modularity BRO
pc.script.attribute('serverip', 'string', "http://localhost:3000");
pc.script.create("conn", function(app) {
	var Conn = function(entity) {
		this.entity = entity;
		this.gameMan = {};
	};
	Conn.prototype = {
		initialize: function() {},
		update: function(dt) {},
		playerConn: function() {
			this.gameMan = this.entity.script.gameMan;
			var socket = this.socket = io.connect(this.serverip);

			if (localStorage) {
				var playerData = JSON.parse(localStorage.getItem("playerData"));
				if (playerData) {
					socket.emit('request_join', playerData);
				} else {
					socket.emit('request_join');
				}
			}

			// Create player locally
			socket.on('accept_join', function(data) {
				this.gameMan.playerCreation(data);
			}.bind(this));

			// Perform updates on opponents
			socket.on('user_update', function(data) {
				this.gameMan.opponentUpdate(data);
			}.bind(this));

			socket.on('player_state', function(data) {
				this.gameMan.stateDealer(data);
			}.bind(this));

			// Remove opponent upon disconnect
			socket.on('remove_user', function(data) {
				this.gameMan.opponentRemove(data);
			}.bind(this));

			// Deal with refusal if server doesn't like you
			socket.on('refuse_join', function(res) {
				if (res.status === "Error") {
					console.error(res.msg);
				}
			});
		},
		sendPlayerData: function(data) {
			this.socket.emit('player_update', data);
		},
		sendCollision: function(data) {
			this.socket.emit('collision', data);
		},
		sendState: function(data) {
			this.socket.emit('player_state', data);
		}
	};

	return Conn;
});