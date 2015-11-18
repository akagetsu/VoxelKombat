// player.js
// move factor attribute
pc.script.attribute('speed', 'number', 0.5, {
    min: 0.1,
    max: 1
});

pc.script.attribute("lookSpeed", "number", 0.5);

pc.script.attribute("power", "number", 2500);

pc.script.create("player", function(app) {
    var force = new pc.Vec3();

    var Player = function(entity) {
        this.entity = entity;

        this.camera = null;

        this.eulers = new pc.Vec3();

        // Disable browser default behaviour when we right click
        app.mouse.disableContextMenu();

        // Listen for mousemovement and handle it accordingly
        app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);

        // Listen for mouseclicks and handle them accordingly
        app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
    };

    Player.prototype = {
        name: "PlayerName",
        initialize: function() {
            this.camera = this.entity.findByName("Camera");
        },
        update: function(dt) {
            this.handleMovement();
            this.handleLooking();
        },
        strafe: function(direction) {
            if (direction === "left") {
                this.entity.translateLocal(-this.speed, 0, 0);
            } else if (direction === "right") {
                this.entity.translateLocal(this.speed, 0, 0);
            }
        },
        walk: function(direction) {
            if (direction === "forward") {
                this.entity.translateLocal(0, 0, -this.speed);
            } else if (direction === "backward") {
                this.entity.translateLocal(0, 0, this.speed);
            }
        },
        handleLooking: function() {
            this.entity.setLocalEulerAngles(0, this.eulers.x, 0);
            this.camera.setLocalEulerAngles(this.eulers.y, 0, 0);
            this.camera.setPosition(this.entity.getPosition());
            this.camera.translateLocal(0, 2, 10);
        },
        onMouseMove: function(event) {
            if (pc.Mouse.isPointerLocked() || event.buttons[0]) {
                this.eulers.x -= this.lookSpeed * event.dx;
                this.eulers.y -= this.lookSpeed * event.dy;
            }
        },
        onMouseDown: function(event) {
            app.mouse.enablePointerLock();
        },
        handleMovement: function() {
            if (app.keyboard.isPressed(pc.KEY_A)) {
                this.strafe("left");
            } else if (app.keyboard.isPressed(pc.KEY_D)) {
                this.strafe("right");
            }

            if (app.keyboard.isPressed(pc.KEY_W)) {
                this.walk("forward");
            } else if (app.keyboard.isPressed(pc.KEY_S)) {
                this.walk("backward");
            }
        }
    };

    return Player;
});