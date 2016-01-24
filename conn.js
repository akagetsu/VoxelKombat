pc.script.create("conn", function(app) {
	var Conn = function(entity) {
		this.entity = entity;
	};
	Conn.prototype = {
		initialize: function() {
			var socket = this.socket = new m.net.WebSocket({url: "ws://loclahost:3000"});

			// var socket = io();
			socket.on('connect', function() {
				console.log('connected');

				socket.send('hello', {
					name: 'Guest'
				});
			});

			socket.on('welcome', function(data) {
				console.log(data);
			});
		},
		update: function(dt) {

		}
	};
	return Conn;
});