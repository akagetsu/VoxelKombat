pc.script.create('playerData', function(app) {
	var PlayerData = function(entity) {
		this.entity = entity;
		this.data = {};
		this.data.uuid = '';
		this.data.color = '';
		this.data.pos = new pc.Vec3();
		this.data.rot = new pc.Vec3();
	};

	PlayerData.prototype = {
		initialize: function() {},
		update: function(dt) {
			this.data.pos = this.entity.getPosition();
			this.data.rot = this.entity.getLocalRotation();
		}
	};

	return PlayerData;
});