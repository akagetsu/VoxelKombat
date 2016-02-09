// conn.js
pc.script.create("conn", function(app) {
	var Conn = function(entity) {
		this.entity = entity;
	};
	Conn.prototype = {
		initialize: function() {},
		update: function(dt) {},
		connectPlayer: function() {
			var socket = this.socket = io("http://localhost:3000");
			socket.on('connect', function() {
				console.log('connected');

				socket.emit('request_join');

				socket.on('accept_join', function(color) {
					app.root.findByName('StartupCamera').enabled = false;
					var camera = app.root.findByName('PlayerCamera');
					var player = app.root.findByName('Player');
					camera.script.playerControls.init(player);
					camera.script.playerControls.setColour(color);
					camera.enabled = true;
					player.enabled = true;

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