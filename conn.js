pc.script.create("conn", function(app) {
	var Conn = function(entity) {
	};
	Conn.prototype = {
		initialize: function() {
			var socket = this.entity.script.socket.io.client.io();
			console.log(socket);
		}
	};
});