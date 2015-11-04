pc.script.attribute("camera", "entity", null);
pc.script.attribute("lookSpeed", "number", 0.5);

pc.script.create("mousemove", function (app) {
	var Mousemove = function(entity) {
		this.entity = entity;

		this.camera = null;
		this.eulers = new pc.Vec3();
	};
	Mousemove.prototype = {
		initialize: function() {
			app.mouse.on("mousemove", this._onMouseMove, this);

			app.mouse.on("mousedown", function() {
				app.mouse.enablePointerLock();
			}, this);
		},
		update: function(dt) {
	        this.entity.setLocalEulerAngles(0, this.eulers.x, 0);
            this.camera.setLocalEulerAngles(this.eulers.y, 0, 0);
            this.camera.setPosition(this.entity.getPosition());
            this.camera.translateLocal(0, 2, 5);
	    },
		_onMouseMove: function(e) {
			if(pc.Mouse.isPointerLocked() || e.buttons[0]) {
				this.eulers.x -= this.lookSpeed * e.dx;
				this.eulers.y -= this.lookSpeed * e.dy;
			}
		}
	};
	return Mousemove;
});