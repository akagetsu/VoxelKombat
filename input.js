// input.js
pc.script.create("input", function(app) {

	var Input = function(entity) {
		this.entity = entity;
		this.player = null;
		this.playerState = null;
		this.conn = null;
		this.data = {};

		app.mouse.disableContextMenu();
		app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);
		app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
		app.mouse.on(pc.EVENT_MOUSEUP, this.onMouseUp, this);
		app.keyboard.on(pc.EVENT_KEYDOWN, this.onKeyDown, this);
		app.keyboard.on(pc.EVENT_KEYUP, this.onKeyUp, this);
	};

	Input.prototype = {
		name: "Input",
		initialize: function() {},
		init: function(player) {
			this.player = player;
			this.playerState = this.player.script.playerData.data.state;
			this.conn = app.root.findByName("Root").script.conn;
			this.data.gameId = this.player.script.playerData.data.gameId;
			this.data.uuid = this.player.script.playerData.data.uuid;
		},
		update: function(dt) {
			this.playerState.cam.fow.x = this.entity.forward.x;
			this.playerState.cam.fow.y = this.entity.forward.y;
			this.playerState.cam.fow.z = this.entity.forward.z;

			this.playerState.cam.rig.x = this.entity.right.x;
			this.playerState.cam.rig.z = this.entity.right.z;
		},
		onKeyDown: function(event) {
			if (!this.playerState)
				return;
			if (event.key === pc.KEY_W) {
				this.playerState.fow = true;
				this.data.args = [{
					"state": "cam",
					"val": this.playerState.cam
				}, {
					"state": "fow",
					"val": true
				}];
				this.conn.sendState(this.data);
			}
			if (event.key === pc.KEY_S) {
				this.playerState.bck = true;
				this.data.args = [{
					"state": "cam",
					"val": this.playerState.cam
				}, {
					"state": "bck",
					"val": true
				}];
				this.conn.sendState(this.data);
			}
			if (event.key === pc.KEY_A) {
				this.playerState.lef = true;
				this.data.args = [{
					"state": "cam",
					"val": this.playerState.cam
				}, {
					"state": "lef",
					"val": true
				}];
				this.conn.sendState(this.data);
			}
			if (event.key === pc.KEY_D) {
				this.playerState.rig = true;
				this.data.args = [{
					"state": "cam",
					"val": this.playerState.cam
				}, {
					"state": "rig",
					"val": true
				}];
				this.conn.sendState(this.data);
			}
		},
		onKeyUp: function(event) {
			if (!this.playerState)
				return;
			if (event.key === pc.KEY_W) {
				this.playerState.fow = false;
				this.data.args = [{
					"state": "fow",
					"val": false
				}];
				this.conn.sendState(this.data);
			}
			if (event.key === pc.KEY_S) {
				this.playerState.bck = false;
				this.data.args = [{
					"state": "bck",
					"val": false
				}];
				this.conn.sendState(this.data);
			}
			if (event.key === pc.KEY_A) {
				this.playerState.lef = false;
				this.data.args = [{
					"state": "lef",
					"val": false
				}];
				this.conn.sendState(this.data);
			}
			if (event.key === pc.KEY_D) {
				this.playerState.rig = false;
				this.data.args = [{
					"state": "rig",
					"val": false
				}];
				this.conn.sendState(this.data);
			}
		},
		onMouseMove: function(event) {
			if (!this.playerState)
				return;

			if (pc.Mouse.isPointerLocked() || event.buttons[0]) {
				this.player.script.playerData.vew.dx = event.dx;
				this.player.script.playerData.vew.dy = event.dy;
			}
		},
		onMouseDown: function(event) {
			if (this.player &&
				this.player.enabled) {
				app.mouse.enablePointerLock();
			}

			if (!this.playerState || !pc.Mouse.isPointerLocked())
				return;


			if (event.button === pc.MOUSEBUTTON_RIGHT) {
				this.playerState.jmp = true;
				this.data.args = [{
					"state": "jmp",
					"val": true
				}];
				this.conn.sendState(this.data);
			}

			if (event.button === pc.MOUSEBUTTON_LEFT) {
				this.playerState.atk = true;
				this.data.args = [{
					"state": "cam",
					"val": this.playerState.cam
				}, {
					"state": "atk",
					"val": true
				}];
				this.conn.sendState(this.data);
			}
		},
		onMouseUp: function(event) {
			if (!this.playerState)
				return;

			if (event.button === pc.MOUSEBUTTON_RIGHT) {
				this.playerState.jmp = false;
				this.data.args = [{
					"state": "jmp",
					"val": false
				}];
				this.conn.sendState(this.data);
			}

			if (event.button === pc.MOUSEBUTTON_LEFT) {
				this.playerState.atk = false;
				this.data.args = [{
					"state": "atk",
					"val": false
				}];
				this.conn.sendState(this.data);
			}
		}
	};

	return Input;
});