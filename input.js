// input.js

pc.script.create("input", function(app) {
    var Input = function(entity) {
        this.entity = entity;
    };
    Input.prototype = {
        initialize: function() {
            this.player = this.entity.script.player;
        },
        update: function(dt) {
            if (app.keyboard.isPressed(pc.KEY_A)) {
                // Call the move() method on the player script
                this.player.strafe("left");
            } else if (app.keyboard.isPressed(pc.KEY_D)) {
                // Call the move() method on the player script
                this.player.strafe("right");
            }

            if (app.keyboard.isPressed(pc.KEY_W)) {
                this.player.walk("forward");
            } else if (app.keyboard.isPressed(pc.KEY_S)) {
                this.player.walk("backward");
            }
        }
    };

    return Input;
});