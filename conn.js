// conn.js

pc.script.attribute("player", "entity", null);

pc.script.create("conn", function(app) {
	var Conn = function(entity) {
		this.entity = entity;
		this.player = null;
	};
	Conn.prototype = {
		initialize: function() {
			var socket = this.socket = io("http://localhost:3000");
			var player = this.player;
			socket.on('connect', function() {
				console.log('connected');

				socket.emit('user_join', {
					id: socket.id,
					color: player.model.material.name
				});

				socket.on('user_join', function(game) {
					console.log(game);
					var allUsers;
					game.user_manager.users.forEach(function(user) {
						allUsers += user.id + "\n";
					});
					document.getElementById('ui').innerHTML = "Users:\n" + allUsers;
				});
			});
		},
		update: function(dt) {

		}
	};
	return Conn;
});