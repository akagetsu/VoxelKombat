// Main game manager script
pc.script.create("gameMan", function(app) {
	var GameMan = function(entity) {
		this.entity = entity;
		this.player = null;
		this.otherPlayers = {};
	};
	GameMan.prototype = {
		initialize: function() {
			this.entity.script.ui.showStart();
		},
		update: function(dt) {
			if(this.player)
				this.entity.script.conn.sendPlayerData(this.player.script.playerData.getData());
		},
		playerCreation: function(userData) {
			if (localStorage) {
				localStorage.setItem("playerData", JSON.stringify(userData, 2, null));
			}
			app.root.findByName('StartupCamera').enabled = false;
			var camera = app.root.findByName('PlayerCamera').clone();
			this.player = app.root.findByName('Player').clone();

			this.player.script.controls.init(camera);
			this.player.script.playerData.setup(userData);
			camera.script.input.init(this.player);
			camera.enabled = true;
			this.player.enabled = true;

			app.root.addChild(this.player);
			app.root.addChild(camera);

			this.entity.script.ui.removeStart();
			this.entity.script.ui.showHUD(this.player.script.controls);

			var data = this.player.script.playerData.getData();
			this.entity.script.conn.sendPlayerData(data);
		},
		opponentUpdate: function(users) {
			if (!this.player)
				return;
			if (Object.keys(users).length === 0)
				return;
			for (var uuid in users) {
				var playerData = users[uuid];

				var alreadyHere = this.otherPlayers[uuid];

				if (!alreadyHere && !this.player.script.playerData.checkUUID(uuid) &&
					!this.checkForPlayer(uuid)) {
					var newPlayer = {};
					try {
						newPlayer = app.root.findByName('Player').clone();
						newPlayer.enabled = true;
						newPlayer.setName('Other Player');
						newPlayer.script.playerData.setup(playerData);
					} catch (e) {
						console.error(e);
					}
					app.root.addChild(newPlayer);
					this.otherPlayers[uuid] = newPlayer;
					this.otherPlayers[uuid].script.playerData.setData(playerData);
				} else if (alreadyHere && !this.player.script.playerData.checkUUID(uuid) &&
					!this.checkForPlayer(uuid)) {
					alreadyHere.script.playerData.setData(playerData);
				} else if (this.player.script.playerData.checkUUID(uuid) &&
					this.checkForPlayer(uuid)) {
					this.player.script.playerData.setData(playerData);
				}
			}
		},
		opponentRemove: function(id) {
			if (this.otherPlayers[id]) {
				this.otherPlayers[id].destroy();
				delete this.otherPlayers[id];
			}
		},
		checkForPlayer: function(uuid) {
			if(!this.player)
				return;
			return uuid === this.player.script.playerData.data.uuid;
		}
	};

	return GameMan;
});