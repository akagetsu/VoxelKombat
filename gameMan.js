// Main game manager script
pc.script.create("gameMan", function(app) {
	var GameMan = function(entity) {
		this.entity = entity;
		this.player = null;
		this.otherPlayers = {};
		this.gameState = null;
		this.timer = 0;
		this.second = 0;
	};
	GameMan.prototype = {
		initialize: function() {
			this.entity.script.ui.showStart();
		},
		update: function(dt) {
			if(!this.player)
				return;
			this.timer += dt;
			if (parseInt(this.timer) > this.second + 2) {
				this.positionUpdate();
				this.second = parseInt(this.timer);
			}
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
					this.otherPlayers[uuid].script.playerData.updatePos(playerData.pos);
				} else if (alreadyHere && !this.player.script.playerData.checkUUID(uuid)  &&
					!this.checkForPlayer(uuid)) {
					alreadyHere.script.playerData.setData(playerData);
					alreadyHere.script.playerData.updatePos(playerData.pos);
				} else if (this.player.script.playerData.checkUUID(uuid)  &&
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
		positionUpdate: function() {
			var data = this.player.script.playerData.getPos();
			this.entity.script.conn.sendPlayerPos(data);
		},
		stateDealer: function(data) {
			if (!this.player || !data)
				return;
			var opponent = this.otherPlayers[data.uuid];

			if (opponent && !this.player.script.playerData.checkUUID(data.uuid) && data.args.length) {
				for (var i = 0; i < data.args.length; i++) {
					opponent.script.playerData.setState(data.args[i]);
				}
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