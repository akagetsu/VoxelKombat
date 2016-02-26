pc.script.create("playerCollider", function(app) {
    var PlayerCollider = function(entity) {
        this.entity = entity;
    };

    PlayerCollider.prototype = {
        initialize: function() {
            this.entity.collision.on('collisionstart', this.onCollisionStart, this);
        },

        onCollisionStart: function(result) {
            if (result.other.rigidbody && result.other.getName() === "Other Player") {
                console.log("hit by", result.other.script.playerData.data.uuid);
            }

        }
    };

    return PlayerCollider;
});