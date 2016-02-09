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
					var camera = app.root.findByName('PlayerCamera').clone();
					var player = app.root.findByName('Player').clone();
					app.systems.script.addComponent(camera, {
						scripts: [{
							url: 'playerControls.js',
							name: 'playerControls',
							attributes: [{
								name: 'power',
								type: 'number',
								value: 10000
							}, {
								name: 'projectionModifier',
								type: 'number',
								value: 200
							}]
						}, {
							url: 'cameraControls.js',
							name: 'cameraControls',
							attributes: [{
								name: 'lookSpeed',
								type: 'number',
								value: 0.9
							}]
						}]
					});
					// console.log(camera.script);
					camera.script.camera.init(player);
					camera.script.playerControls.init(player);
					camera.script.playerControls.setColour(color);
					camera.enabled = true;
					player.enabled = true;

					app.root.addChild(player);
					app.root.addChild(camera);

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