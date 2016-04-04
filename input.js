// input.js
pc.script.create("input", function(app) {

	var Input = function(entity) {
		this.entity = entity;
		this.controller = null;

        app.mouse.disableContextMenu();
        app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);
		app.keyboard.on(pc.EVENT_KEYDOWN, this.onKeyDown, this);
		app.keyboard.on(pc.EVENT_KEYUP, this.onKeyUp, this);
	};

	Input.prototype = {
		name: "Input",
		initialize: function() {
			this.controller = this.entity.script.controls;
		},
		update: function(dt) {},
		onKeyDown: function(event) {
			if(!this.controller)
				return;
			if(event.key === pc.KEY_W) {
				this.controller.playerState.fow = true;
			}
			if(event.key === pc.KEY_S) {
				this.controller.playerState.bck = true;
			}
			if(event.key === pc.KEY_A) {
				this.controller.playerState.lef = true;
			}
			if(event.key === pc.KEY_D) {
				this.controller.playerState.rig = true;
			}
		},
		onKeyUp: function(event) {
			if(!this.controller)
				return;
			if(event.key === pc.KEY_W) {
				this.controller.playerState.fow = false;
			}
			if(event.key === pc.KEY_S) {
				this.controller.playerState.bck = false;
			}
			if(event.key === pc.KEY_A) {
				this.controller.playerState.lef = false;
			}
			if(event.key === pc.KEY_D) {
				this.controller.playerState.rig = false;
			}
		},
        onMouseMove: function(event) {
        	if(!this.controller)
				return;

            if (pc.Mouse.isPointerLocked() || event.buttons[0]) {
            	this.controller.playerState.vew.dx = event.dx;
            	this.controller.playerState.vew.dy = event.dy;
            }
        },
	};

	return Input;
});