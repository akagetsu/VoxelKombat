pc.script.create('playerData', function(app) {
	var PlayerData = function(entity) {
		this.entity = entity;
		this.data = {};
		this.data.uuid = '';
		this.data.color = '';
		this.data.gameId = '';
		this.data.pos = new pc.Vec3();
		this.data.rot = new pc.Vec3();
	};

	PlayerData.prototype = {
		initialize: function() {},
		update: function(dt) {
			this.data.pos = this.entity.getPosition();
			this.data.rot = this.entity.getLocalRotation();
		},
		setData: function(newData) {
			if (!newData)
				return;
			this.data = newData;
			var p = newData.pos;
			var r = newData.rot;
			this.entity.rigidbody.teleport(p);
			this.entity.setLocalRotation(r);
		},
		setColorPosition: function(color) {
			if (!color)
				color = this.data.color;
			switch (color) {
				case "red":
					this.entity.setPosition(new pc.Vec3(-118, 0, 100));
					break;
				case "blue":
					this.entity.setPosition(new pc.Vec3(-118, 0, -100));
					break;
				case "green":
					this.entity.setPosition(new pc.Vec3(118, 0, -100));
					break;
				default:
					this.entity.setPosition(new pc.Vec3(118, 0, 100));
					break;
			}
		}
	};

	return PlayerData;
});