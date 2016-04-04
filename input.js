// input.js
pc.script.create("input", function(app) {

	var Input = function(entity) {
		this.entity = entity;
		this.playerState = null;

        app.mouse.disableContextMenu();
        app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);
		app.keyboard.on(pc.EVENT_KEYDOWN, this.onKeyDown, this);
		app.keyboard.on(pc.EVENT_KEYUP, this.onKeyUp, this);
	};

	Input.prototype = {
		name: "Input",
		initialize: function() {
			this.playerState = this.entity.script.controls.playerState;
		},
		update: function(dt) {},
		onKeyDown: function(event) {
			if(!this.playerState)
				return;
			if(event.key === pc.KEY_W) {
				this.playerState.fow = true;
			}
			if(event.key === pc.KEY_S) {
				this.playerState.bck = true;
			}
			if(event.key === pc.KEY_A) {
				this.playerState.lef = true;
			}
			if(event.key === pc.KEY_D) {
				this.playerState.rig = true;
			}
		},
		onKeyUp: function(event) {
			if(!this.playerState)
				return;
			if(event.key === pc.KEY_W) {
				this.playerState.fow = false;
			}
			if(event.key === pc.KEY_S) {
				this.playerState.bck = false;
			}
			if(event.key === pc.KEY_A) {
				this.playerState.lef = false;
			}
			if(event.key === pc.KEY_D) {
				this.playerState.rig = false;
			}
		},
        onMouseMove: function(event) {
        	if(!this.playerState)
				return;

            if (pc.Mouse.isPointerLocked() || event.buttons[0]) {
            	this.playerState.vew.dx = event.dx;
            	this.playerState.vew.dy = event.dy;
            }
        },
	};

	return Input;
});