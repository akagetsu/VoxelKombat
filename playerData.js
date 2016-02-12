pc.script.create('playerData', function(app) {
	var PlayerData = function(entity) {
		this.entity = entity;
		this.data = {};
		this.data.uuid = '';
		this.data.color = '';
		this.data.pos = null;
		this.data.rot = null;
	};

	PlayerData.prototype = {
		initialize: function() {},
		update: function(dt) {
			this.data.pos = this.entity.getPosition();
			this.data.rot = this.entity.getEulerAngles();
		}
	};

	return PlayerData;
});