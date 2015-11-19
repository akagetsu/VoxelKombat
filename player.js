// player.js
// move factor attribute
pc.script.attribute("lookSpeed", "number", 0.5);

pc.script.attribute("power", "number", 2500);

pc.script.create("player", function(app) {
    var direction = new pc.Vec3();
    var reverseVec = new pc.Vec3(-1,0,-1);

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
            this.handleCamera();
        },
        handleCamera: function() {
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
            var forward = this.entity.forward;
            var right = this.entity.right;
            // console.log("camera forward and right:", JSON.parse(this.camera.forward), JSON.parse(this.camera.right));

            var x = 0;
            var z = 0;

            if (app.keyboard.isPressed(pc.KEY_A)) {
                direction = right.mul(reverseVec);
                this.entity.rigidbody.applyForce(direction.normalize().scale(this.power));
                console.log("right x, right z:", right.x, right.z);
            }

            if (app.keyboard.isPressed(pc.KEY_D)) {
                direction = right;
                this.entity.rigidbody.applyForce(direction.normalize().scale(this.power));
            }

            if (app.keyboard.isPressed(pc.KEY_W)) {
                direction = forward;
                this.entity.rigidbody.applyForce(direction.normalize().scale(this.power));
                console.log("forward x, forward z:", forward.x, forward.z);
            }

            if (app.keyboard.isPressed(pc.KEY_S)) {
                direction = forward.mul(reverseVec);
                this.entity.rigidbody.applyForce(direction.normalize().scale(this.power));
            }
        }
    };

    return Player;
});