// Main game manager script
pc.script.create("gameMan", function(app) {
	var GameMan = function(entity) {
		this.entity = entity;
		this.player = null;
		this.otherPlayers = {};
		this.gameState = null;
	};
	GameMan.prototype = {
		initialize: function() {
			this.entity.script.ui.showStart();
		},
		update: function(dt) {},
		playerCreation: function(userData) {
			if (localStorage) {
				localStorage.setItem("playerData", JSON.stringify(userData, 2, null));
			}
			app.root.findByName('StartupCamera').enabled = false;
			var camera = app.root.findByName('PlayerCamera').clone();
			this.player = app.root.findByName('Player').clone();

			camera.script.controls.init(this.player);
			this.player.script.playerData.setup(userData);
			camera.enabled = true;
			this.player.enabled = true;

			app.root.addChild(this.player);
			app.root.addChild(camera);

			this.entity.script.ui.removeStart();
			this.entity.script.ui.showHUD(camera.script.controls);

			this.playerUpdate();
		},
		opponentUpdate: function(users) {
			if (!this.player)
				return;
			if (Object.keys(users).length === 0)
				return;
			for (var uuid in users) {
				var playerData = users[uuid];

				var alreadyHere = this.otherPlayers[uuid];

				if (!alreadyHere && !this.player.script.playerData.checkUUID(uuid)) {
					var newPlayer = {};
					try {
						newPlayer = app.root.findByName('Player').clone();
						newPlayer.enabled = true;
						newPlayer.rigidbody.linearFactor = new pc.Vec3(0, 0, 0);
						newPlayer.name = 'Other Player';
						newPlayer.script.playerData.setup(playerData);
					} catch (e) {
						console.error(e);
					}
					app.root.addChild(newPlayer);
					this.otherPlayers[uuid] = newPlayer;
				} else if (alreadyHere && !this.player.script.playerData.checkUUID(uuid)) {
					alreadyHere.script.playerData.setData(playerData);
				} else if (uuid === this.player.script.playerData.data.uuid) {
					if (playerData.dead) {
						if (!this.player.enabled) {
							return;
						}
						this.player.enabled = false;
						return;
					} else {
						if (!this.player.enabled) {
							this.player.enabled = true;
						}
					}
				}
			}
		},
		opponentRemove: function(id) {
			if (this.otherPlayers[id]) {
				this.otherPlayers[id].destroy();
				delete this.otherPlayers[id];
			}
		},
		playerUpdate: function() {
			var data = this.player.script.playerData.getData();
			this.entity.script.conn.sendPlayerData(data);
			setTimeout(this.playerUpdate.bind(this), 10);
		}

	};

	return GameMan;
});