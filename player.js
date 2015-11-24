// player.js
pc.script.attribute("power", "number", 10000);

pc.script.attribute("camera", "entity", null);

pc.script.create("player", function(app) {
    var force = new pc.Vec3();

    var Player = function(entity) {
        this.entity = entity;

        this.camera = null;

    };

    Player.prototype = {
        name: "PlayerName",
        initialize: function() {},
        update: function(dt) {
            this.handleMovement();
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
                force.set(x, 0, z).normalize().scale(this.power);
                this.entity.rigidbody.applyForce(force);
            }
        }
    };

    return Player;
});