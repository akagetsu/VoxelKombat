pc.script.create('playerData', function(app) {
	var PlayerData = function(entity) {
		this.entity = entity;
		this.playerData = {};
		this.playerData.uuid = '';
		this.playerData.color = '';
		this.playerData.pos = null;
		this.playerData.rot = null;
	};

	PlayerData.prototype = {
		initialize: function() {},
		update: function(dt) {
			this.playerData.pos = this.entity.getPosition();
			this.playerData.rot = this.entity.getEulerAngles();
		}
	};

	return PlayerData;
});