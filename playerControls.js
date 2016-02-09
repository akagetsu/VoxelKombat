// playerControls.js
pc.script.attribute("power", "number", 10000);

pc.script.attribute("projectionModifier", "number", 200);

pc.script.attribute("player", "entity", null);

pc.script.create("playerControls", function(app) {
    var moveForce = new pc.Vec3();

    var jumpForce = new pc.Vec3();

    var projectionForce = new pc.Vec3();

    var PlayerControls = function(entity) {
        this.entity = entity;

        this.player = null;

        this.releasedJump = true;

        this.pressedJump = false;

        // Listen for mouseclicks and handle them accordingly
        app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);

        app.mouse.on(pc.EVENT_MOUSEUP, this.onMouseUp, this);

    };

    PlayerControls.prototype = {
        name: "PlayerName",
        initialize: function() {
        },
        update: function(dt) {
            this.handleMovement();
            this.jump();
        },
        setColour: function(colour) {
            colour = colour[0].toUpperCase() + colour.slice(1);
            this.camera.model.materialAsset = app.assets.find(colour); // TODO: Make this Random at some point pls!
        },
        handleMovement: function() {
            var forward = this.entity.forward;
            var right = this.entity.right;

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
                this.camera.rigidbody.applyForce(moveForce);
            }
        },
        jump: function() {
            if (this.pressedJump) {
                jumpForce.set(0, 1, 0).normalize().scale(this.power);
                this.camera.rigidbody.applyForce(jumpForce);
            } else if (this.releasedJump && this.camera.getPosition().y >= 0) {
                jumpForce.set(0, -1, 0).normalize().scale(this.power);
                this.camera.rigidbody.applyForce(jumpForce);
            }
        },
        attack: function() {
            var forward = this.entity.forward;
            projectionForce.set(forward.x, forward.y, forward.z).normalize().scale(this.power * this.projectionModifier);
            this.camera.rigidbody.applyForce(projectionForce);
        },
        onMouseDown: function(event) {
            if(this.camera.enabled) {
                app.mouse.enablePointerLock();
            }
            if (!pc.Mouse.isPointerLocked()) {
                return;
            }

            if (event.button === pc.MOUSEBUTTON_RIGHT) {
                this.pressedJump = true;
                this.releasedJump = false;
            }

            if (event.button === pc.MOUSEBUTTON_LEFT) {
                this.attack();
            }
        },
        onMouseUp: function(event) {
            if (event.button === pc.MOUSEBUTTON_RIGHT) {
                this.pressedJump = false;
                this.releasedJump = true;
            }
        }
    };

    return Player;
});