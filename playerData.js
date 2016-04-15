pc.script.create('playerData', function(app) {
	var PlayerData = function(entity) {
		this.entity = entity;
		this.data = {};
		this.data.uuid = '';
		this.data.color = '';
		this.data.gameId = '';
		this.data.state = {
			"fow": false,
			"bck": false,
			"lef": false,
			"rig": false,
			"jmp": false,
			"atk": false,
			"vew": {
				"dx": 0,
				"dy": 0
			},
			"cam": {
				"fow": {
					"x": 0,
					"z": 0
				},
				"rig": {
					"x": 0,
					"z": 0
				}
			},
			"flr": false
		};
		this.data.dead = false;
		this.data.pos = new pc.Vec3();
	};

	PlayerData.prototype = {
		initialize: function() {},
		update: function(dt) {
			if (this.entity.getName() === "Player")
				this.data.pos = this.entity.getPosition();

			this.checkDeath(this.data.dead);
		},
		setup: function(data) {
			this.data.uuid = data.uuid;
			this.data.socketid = data.socketid;
			this.data.color = data.color;
			this.data.gameId = data.gameId;
			this.data.state = data.state;
			this.setColorMaterial(data.color);
			this.setColorPosition(data.color);
		},
		setData: function(newData) {
			if (!newData)
				return;
			if (!this.checkDeath(newData.dead))
				return;
			this.data = newData;
		},
		checkDeath: function(dead) {
			if (dead) {
				if (this.entity.enabled) {
					this.entity.enabled = false;
				}
				return false;
			} else {
				if (!this.entity.enabled) {
					this.entity.enabled = true;
				}
				return true;
			}
		},
		setColorMaterial: function(color) {
			this.entity.model.materialAsset = app.assets.find(color[0].toUpperCase() + color.slice(1));
		},
		setColorPosition: function(color) {
			if (!color)
				color = this.data.color;
			switch (color) {
				case "red":
					this.data.pos = new pc.Vec3(-118, 0, 100);
					break;
				case "blue":
					this.data.pos = new pc.Vec3(-118, 0, -100);
					break;
				case "green":
					this.data.pos = new pc.Vec3(118, 0, -100);
					break;
				default:
					this.data.pos = new pc.Vec3(118, 0, 100);
					break;
			}
			this.entity.setPosition(this.data.pos);
			if (this.entity.getName() != "Player")
				this.updatePos();
		},
		checkUUID: function(uuid) {
			return this.data.uuid === uuid;
		},
		getData: function() {
			return this.data;
		},
		updatePos: function() {
			this.entity.rigidbody.teleport(this.data.pos);
			setTimeout(this.updatePos.bind(this), 5000);
		}
	};

	return PlayerData;
});