// camera.js
pc.script.attribute("lookSpeed", "number", 0.9);

pc.script.attribute("player", "entity", null);

pc.script.create("camera", function(app) {
    var Camera = function(entity) {
        this.entity = entity; //this is the camera

        this.eulers = new pc.Vec3();

        this.player = null;

        // Disable browser default behaviour when we right click
        app.mouse.disableContextMenu();

        // Listen for mousemovement and handle it accordingly
        app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);

        // Listen for mouseclicks and handle them accordingly
        app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
    };

    Camera.prototype = {
        name: "Camera",
        initialize: function() {},
        update: function(dt) {
            this.handleCamera();
        },
        handleCamera: function() {
            var cameraPosition = this.entity.getPosition();
            this.entity.setLocalEulerAngles(this.eulers.y, this.eulers.x, 0);
            this.entity.setPosition(this.player.getPosition());
            this.entity.rotateLocal(-15, 0, 0);
            this.entity.translateLocal(0, 2, 10);
            if (this.entity.getPosition().y <= 0) {
                this.entity.setPosition(cameraPosition.x, 0, cameraPosition.z);
            }
        },
        onMouseMove: function(event) {
            if (pc.Mouse.isPointerLocked() || event.buttons[0]) {
                this.eulers.x -= this.lookSpeed * event.dx;
                this.eulers.y -= this.lookSpeed * event.dy;

                // clip camera on top
                if (this.eulers.y <= -75) {
                    this.eulers.y = -75;
                } else if (this.eulers.y >= 45) {
                    this.eulers.y = 45;
                }
                // reset left-right to 0 once a full circle is complete
                if (this.eulers.x >= 360 || this.eulers.x <= -360) {
                    this.eulers.x = 0;
                }
            }
        },
        onMouseDown: function(event) {
            app.mouse.enablePointerLock();
        }
    };

    return Camera;
});