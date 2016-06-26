// conn.js
// This whole things needs some serious refactoring and modularity BRO
pc.script.attribute('serverip', 'string', "http://localhost:3000");
pc.script.create("conn", function(app) {
	var Conn = function(entity) {
		this.entity = entity;
		this.gameMan = {};
		this.socket = null;
		this.startupCamera = null;
		this.rotation = 1;
	};
	Conn.prototype = {
		initialize: function() {
			this.socket = io.connect(this.serverip, {
				secure: true,
				reconnection: false
			});

			this.socket.on('connect_error', function() {
				console.log('Failed to connect to server.');
				this.entity.script.ui.showServerError();
			}.bind(this));

			this.socket.on('connect', function() {
				this.gameMan = this.entity.script.gameMan;
				this.entity.script.ui.showStart();
			}.bind(this));

			this.startupCamera = app.root.findByName('StartupCamera');
		},
		update: function(dt) {
			this.rotation += dt * 20;
			this.startupCamera.setPosition(new pc.Vec3(0, 0, 0));
			this.startupCamera.setEulerAngles(0, this.rotation, 0);
			this.startupCamera.translateLocal(0, 200, 300);
			this.startupCamera.lookAt(new pc.Vec3(0, 0, 0));
		},
		playerConn: function() {
			if (localStorage) {
				var playerData = JSON.parse(localStorage.getItem("playerData"));
				if (playerData) {
					this.socket.emit('request_join', playerData);
				} else {
					this.socket.emit('request_join');
				}
			}

			// Create player locally
			this.socket.on('accept_join', function(data) {
				this.gameMan.playerCreation(data);
			}.bind(this));

			// Perform updates on opponents
			this.socket.on('user_update', function(data) {
				this.gameMan.opponentUpdate(data);
			}.bind(this));

			// Remove opponent upon disconnect
			this.socket.on('remove_user', function(data) {
				this.gameMan.opponentRemove(data);
			}.bind(this));

			// Deal with refusal if server doesn't like you
			this.socket.on('refuse_join', function(res) {
				if (res.status === "Error") {
					console.error(res.msg);
				}
			});
		},
		sendPlayerData: function(data) {
			this.socket.emit('player_update', data);
		},
		collide: function(data) {
			this.socket.emit('collide', data);
		}
	};

	return Conn;
});