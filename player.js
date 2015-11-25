// player.js
pc.script.attribute("power", "number", 10000);

pc.script.attribute("camera", "entity", null);

pc.script.create("player", function(app) {
    var moveForce = new pc.Vec3();

    var jumpForce = new pc.Vec3();

    var Player = function(entity) {
        this.entity = entity;

        this.camera = null;

        // Listen for mouseclicks and handle them accordingly
        app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);

        app.mouse.on(pc.EVENT_MOUSEUP, this.onMouseUp, this);

    };

    Player.prototype = {
        name: "PlayerName",
        initialize: function() {},
        update: function(dt) {
            this.handleMovement();
            this.jump();
        },
        handleMovement: function() {
            var forward = this.camera.forward;
            var right = this.camera.right;

            var x = 0;
            var z = 0;

            if (app.keyboard.isPressed(pc.KEY_A)) {
                x -= right.x;
                z -= right.z;
            }
            if (app.keyboard.isPressed(pc.KEY_D)) {
                x += right.x;
                z += right.z;
            }

            if (app.keyboard.isPressed(pc.KEY_W)) {
                x += forward.x;
                z += forward.z;
            }

            if (app.keyboard.isPressed(pc.KEY_S)) {
                x -= forward.x;
                z -= forward.z;
            }

            if (x !== 0 && z !== 0) {
                moveForce.set(x, 0, z).normalize().scale(this.power);
                this.entity.rigidbody.applyForce(moveForce);
            }
        },
        jump: function() {
            if(this.pressedJump) {
                jumpForce.set(0, 1, 0).normalize().scale(this.power);
                this.entity.rigidbody.applyForce(jumpForce);
            } else if(this.releasedJump && this.entity.getPosition().y >= 0) {
                jumpForce.set(0, -1, 0).normalize().scale(this.power);
                this.entity.rigidbody.applyForce(jumpForce);
            }
        },
        onMouseDown: function(event) {
            app.mouse.enablePointerLock();

            if (event.button === pc.MOUSEBUTTON_RIGHT) {
                this.pressedJump = true;
                this.releasedJump = false;
            }
        },
        onMouseUp: function(event) {
            if(event.button === pc.MOUSEBUTTON_RIGHT) {
                this.pressedJump = false;
                this.releasedJump = true;
            }
        }
    };

    return Player;
});