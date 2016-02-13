// conn.js
// This whole things needs some serious refactoring and modularity BRO
pc.script.create("conn", function(app) {
	var Conn = function(entity) {
		this.entity = entity;
		this.playerControls = null;
		this.player = null;
		this.otherPlayers = [];
		this.gameState = null;
	};
	Conn.prototype = {
		initialize: function() {},
		update: function(dt) {},
		connectPlayer: function() {
			var socket = this.socket = io.connect("http://localhost:3000");

			socket.emit('request_join');

			socket.on('accept_join', function(userData) {
				app.root.findByName('StartupCamera').enabled = false;
				var camera = app.root.findByName('PlayerCamera').clone();
				this.player = app.root.findByName('Player').clone();

				camera.script.cameraControls.init(this.player);
				this.playerControls = app.root.findByName('Root').script.playerControls;
				this.playerControls.init(this.player, camera);
				this.player.script.playerData.data.uuid = userData.uuid;
				this.player.script.playerData.data.color = userData.color;
				this.player.model.materialAsset = this.getMaterialOfColour(userData.color);
				camera.enabled = true;
				this.player.enabled = true;

				app.root.addChild(this.player);
				app.root.addChild(camera);

				document.getElementById('btn-connect').remove();

				this.sendPlayerData();
			}.bind(this));

			socket.on('user_update', function(data) {
				if (data.length === 0)
					return;
				for (var p = 0; p < data.length; p++) {
					var playerData = data[p];

					var alreadyHere = this.otherPlayers.filter(function(p) {
						return p.script.playerData.data.uuid === playerData.uuid;
					});

					if (alreadyHere.length === 0 &&
						playerData.uuid !== this.player.script.playerData.data.uuid) {
						var newPlayer = {};
						try {
							newPlayer = app.root.findByName('Player').clone();
							newPlayer.enabled = true;
							newPlayer.rigidbody.linearFactor = new pc.Vec3(0, 0, 0);
							newPlayer.name = 'Other Player';
						} catch (e) {
							console.error(e);
						}

						newPlayer.script.playerData.data = playerData;
						app.root.addChild(newPlayer);
						this.otherPlayers.push(newPlayer);
					} else if (alreadyHere.length !== 0 &&
						playerData.uuid !== this.player.script.playerData.data.uuid) {
						alreadyHere[0].script.playerData.data = playerData;
						console.log("playerdata: ", playerData, " \n\n\n and already here data: ", alreadyHere[0].script.playerData.data);
						this.updateOtherPlayer(alreadyHere[0]);
					}
				}
			}.bind(this));

			socket.on('refuse_join', function(res) {
				if (res.status === "Error") {
					console.error(res.msg);
				}
			});
		},
		sendPlayerData: function() {
			var data = this.player.script.playerData.data;
			this.socket.emit('player_update', data);
			setTimeout(this.sendPlayerData.bind(this), 100);
		},
		getMaterialOfColour: function(color) {
			return app.assets.find(color[0].toUpperCase() + color.slice(1));
		},
		updateOtherPlayer: function(op) {
			console.log(JSON.stringify(op.script.playerData.data, 2, null));
			var p = new pc.Vec3(op.script.playerData.data.pos.x, op.script.playerData.data.pos.y, op.script.playerData.data.pos.z);
			var r = new pc.Vec3(op.script.playerData.data.rot.x, op.script.playerData.data.rot.y, op.script.playerData.data.rot.z);
			op.rigidbody.teleport(p, r);
		}
	};
	return Conn;
});