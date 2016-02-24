// conn.js
// This whole things needs some serious refactoring and modularity BRO
pc.script.create("conn", function(app) {
	var Conn = function(entity) {
		this.entity = entity;
		this.playerControls = null;
		this.player = null;
		this.otherPlayers = {};
		this.gameState = null;
	};
	Conn.prototype = {
		initialize: function() {},
		update: function(dt) {},
		connectPlayer: function() {
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
			socket.on('accept_join', this.playerCreation.bind(this));

			// Perform updates on opponents
			socket.on('user_update', this.opponentUpdate.bind(this));

			// Remove opponent upon disconnect
			socket.on('remove_user', this.opponentRemove.bind(this));

			// Deal with refusal if server doesn't like you
			socket.on('refuse_join', function(res) {
				if (res.status === "Error") {
					console.error(res.msg);
				}
			});
		},
		playerCreation: function(userData) {
			if (localStorage) {
				localStorage.setItem("playerData", JSON.stringify(userData, 2, null));
			}
			app.root.findByName('StartupCamera').enabled = false;
			var camera = app.root.findByName('PlayerCamera').clone();
			this.player = app.root.findByName('Player').clone();

			camera.script.cameraControls.init(this.player);
			this.playerControls = app.root.findByName('Root').script.playerControls;
			this.playerControls.init(this.player, camera);
			this.player.script.playerData.data.uuid = userData.uuid;
			this.player.script.playerData.data.color = userData.color;
			this.player.script.playerData.data.gameId = userData.gameId;
			this.player.model.materialAsset = this.getMaterialOfColour(userData.color);
			this.player.script.playerData.setColorPosition(userData.color);
			camera.enabled = true;
			this.player.enabled = true;

			app.root.addChild(this.player);
			app.root.addChild(camera);


			document.getElementById('start-ui').remove();

			this.sendPlayerData();
		},
		opponentUpdate: function(users) {
			if (!this.player)
				return;
			if (Object.keys(users).length === 0)
				return;
			for (var uuid in users) {
				var playerData = users[uuid];

				var alreadyHere = this.otherPlayers[uuid];

				if (!alreadyHere && uuid !== this.player.script.playerData.data.uuid) {
					var newPlayer = {};
					try {
						newPlayer = app.root.findByName('Player').clone();
						newPlayer.enabled = true;
						newPlayer.rigidbody.linearFactor = new pc.Vec3(0, 0, 0);
						newPlayer.model.materialAsset = this.getMaterialOfColour(playerData.color);
						newPlayer.name = 'Other Player';
					} catch (e) {
						console.error(e);
					}

					newPlayer.script.playerData.data = playerData;
					app.root.addChild(newPlayer);
					this.otherPlayers[uuid] = newPlayer;
				} else if (alreadyHere && uuid !== this.player.script.playerData.data.uuid) {
					alreadyHere.script.playerData.data = playerData;
					this.updateOtherPlayer(alreadyHere);
				}
			}
		},
		opponentRemove: function(id) {
			if (this.otherPlayers[id]) {
				this.otherPlayers[id].destroy();
				delete this.otherPlayers[id];
			}
		},
		sendPlayerData: function() {
			var data = this.player.script.playerData.data;
			this.socket.emit('player_update', data);
			setTimeout(this.sendPlayerData.bind(this), 100);
		},
		getMaterialOfColour: function(color) {
			return app.assets.find(color[0].toUpperCase() + color.slice(1));
		},
		}
	};
	return Conn;
});