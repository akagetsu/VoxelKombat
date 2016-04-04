// input.js
pc.script.create("input", function(app) {

	var Input = function(entity) {
		this.entity = entity;
		this.player = null;
		this.playerState = null;

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
		},
		update: function(dt) {},
		onKeyDown: function(event) {
			if (!this.playerState)
				return;
			if (event.key === pc.KEY_W) {
				this.playerState.fow = true;
			}
			if (event.key === pc.KEY_S) {
				this.playerState.bck = true;
			}
			if (event.key === pc.KEY_A) {
				this.playerState.lef = true;
			}
			if (event.key === pc.KEY_D) {
				this.playerState.rig = true;
			}
		},
		onKeyUp: function(event) {
			if (!this.playerState)
				return;
			if (event.key === pc.KEY_W) {
				this.playerState.fow = false;
			}
			if (event.key === pc.KEY_S) {
				this.playerState.bck = false;
			}
			if (event.key === pc.KEY_A) {
				this.playerState.lef = false;
			}
			if (event.key === pc.KEY_D) {
				this.playerState.rig = false;
			}
		},
		onMouseMove: function(event) {
			if (!this.playerState)
				return;

			if (pc.Mouse.isPointerLocked() || event.buttons[0]) {
				this.playerState.vew.dx = event.dx;
				this.playerState.vew.dy = event.dy;
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
			}

			if (event.button === pc.MOUSEBUTTON_LEFT) {
				this.playerState.atk = true;
			}
		},
		onMouseUp: function(event) {
			if (!this.playerState)
				return;

			if (event.button === pc.MOUSEBUTTON_RIGHT) {
				this.playerState.jmp = false;
			}

			if (event.button === pc.MOUSEBUTTON_LEFT) {
				this.playerState.atk = false;
			}
		}
	};

	return Input;
});