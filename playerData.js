pc.script.create('playerData', function(app) {
	var PlayerData = function(entity) {
		this.entity = entity;
		this.data = {};
		this.data.uuid = '';
		this.data.color = '';
		this.data.gameId = '';
		this.data.pos = new pc.Vec3();
		this.data.rot = new pc.Vec3();
		this.lastPos = new pc.Vec3();
	};

	PlayerData.prototype = {
		initialize: function() {},
		update: function(dt) {
			this.data.pos = this.entity.getPosition();
			this.data.rot = this.entity.getLocalRotation();
		},
		setup: function(data) {
			this.data.uuid = data.uuid;
			this.data.socketid = data.socketid;
			this.data.color = data.color;
			this.data.gameId = data.gameId;
			this.setColorMaterial(data.color);
			this.setColorPosition(data.color);
		},
		setData: function(newData) {
			if (!newData)
				return;
			this.data = newData;
			var newPos = new pc.Vec3().lerp(new pc.Vec3().copy(newData.pos), this.lastPos, 0.5);
			this.entity.rigidbody.teleport(newPos);
			this.entity.setLocalRotation(new pc.Vec3().copy(newData.rot));
			this.lastPos = newPos;
		},
		setColorMaterial: function(color) {
			this.entity.model.materialAsset = app.assets.find(color[0].toUpperCase() + color.slice(1));
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
		},
		checkUUID: function(uuid) {
			return this.data.uuid === uuid;
		},
		getData: function() {
			return this.data;
		}
	};

	return PlayerData;
});