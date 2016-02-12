// conn.js
// This whole things needs some serious refactoring and modularity BRO
pc.script.create("conn", function(app) {
	var Conn = function(entity) {
		this.entity = entity;
		this.playerControls = null;
		this.player = null;
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
				var player = this.player = app.root.findByName('Player').clone();

				camera.script.cameraControls.init(player);
				this.playerControls = app.root.findByName('Root').script.playerControls;
				this.playerControls.init(player, camera);
				player.playerData.uuid = userData.id;
				player.playerData.color = userData.color;
				player.model.materialAsset = this.getMaterialOfColour(userData.color);
				camera.enabled = true;
				player.enabled = true;

				app.root.addChild(player);
				app.root.addChild(camera);

				document.getElementById('btn-connect').remove();
				this.sendPlayerData();
			}.bind(this));

			socket.on('user_update', function(data) {
				console.log(data);
			});

			socket.on('refuse_join', function(res) {
				if (res.status === "Error") {
					console.error(res.msg);
				}
			});
			// });
		},
		sendPlayerData: function() {
			var data = this.player.playerData;
			this.socket.emit('player_update', data);
			setTimeout(this.sendPlayerData.bind(this), 100);
		},
		getMaterialOfColour: function(color) {
			return app.assets.find(color[0].toUpperCase() + color.slice(1));
		}
	};
	return Conn;
});