// conn.js
pc.script.attribute("player", "entity", null);

pc.script.create("conn", function(app) {
	var Conn = function(entity) {
		this.entity = entity;
		this.player = null;
	};
	Conn.prototype = {
		initialize: function() {},
		update: function(dt) {},
		connectPlayer: function() {
			var socket = this.socket = io("http://localhost:3000");
			var player = this.player;
			socket.on('connect', function() {
				console.log('connected');

				socket.emit('request_join');

				socket.on('accept_join', function(color) {
					player.enabled = true;
					var camera = app.root.findByName('PlayerCamera');
					camera.enabled = true;
					camera.script.playerControls.setColour(color);
					camera.script.playerControls.init(player);
					app.root.findByName('StartupCamera').enabled = false;

					document.getElementById('btn-connect').remove();
				});

				socket.on('user_joined', function(data) {
					console.log(data);
				});

				socket.on('refuse_join', function(res) {
					if (res.status === "Error") {
						console.error(res.msg);
					}
				})
			});
		}
	};
	return Conn;
});