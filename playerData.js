pc.script.create('playerData', function(app) {
	var PlayerData = function(entity) {
		this.entity = entity;

		this.data = {};
		this.data.uuid = '';
		this.data.color = '';
		this.data.gameId = '';
		this.data.dead = false;
		this.data.pos = new pc.Vec3();
		this.data.kills = 0;
		this.data.deaths = 0;
		this.data.state = {
			"fow": false,
			"bck": false,
			"lef": false,
			"rig": false,
			"jmp": false,
			"atk": false,
			"cam": {
				"fow": {
					"x": 0,
					"y": 0,
					"z": 0
				},
				"rig": {
					"x": 0,
					"z": 0
				}
			},
			"flr": false
		};

		this.vew = {
			"dx": 0,
			"dy": 0
		};
	};

	PlayerData.prototype = {
		initialize: function() {},
		update: function(dt) {
			if (this.entity.getName() === "Player")
				this.data.pos = this.entity.getPosition();
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
			this.data.dead = newData.dead;
			this.checkDeath(this.data.dead);
			this.data.kills = newData.kills;
			this.data.deaths = newData.deaths;

			if(this.entity.getName() === "Player")
				return;

			this.data.state = newData.state;
			this.data.pos = newData.pos;
			this.entity.rigidbody.teleport(this.data.pos);

		},
		checkDeath: function(dead) {
			if (dead && this.entity.enabled) {
				this.entity.enabled = false;
			} else if (!dead && !this.entity.enabled) {
				this.setColorPosition();
				this.entity.enabled = true;
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
			this.entity.rigidbody.teleport(this.data.pos);
		},
		checkUUID: function(uuid) {
			return this.data.uuid === uuid;
		},
		getData: function() {
			return this.data;
		},
		getState: function() {
			return this.data.state;
		}
	};

	return PlayerData;
});