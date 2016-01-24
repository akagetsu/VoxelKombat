// conn.js
pc.script.create("conn", function(app) {
	var Conn = function(entity) {
		this.entity = entity;
	};
	Conn.prototype = {
		initialize: function() {
			var socket = this.socket = io("http://localhost:3000");

			// var socket = io();
			socket.on('connect', function() {
				console.log('connected');

				socket.emit('hello', {
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