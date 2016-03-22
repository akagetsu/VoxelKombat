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
                app.root.findByName("Root").script.conn.sendCollision({
                    game: this.entity.script.playerData.data.gameId,
                    p1: this.entity.script.playerData.data.uuid,
                    force: this.entity.rigidbody.linearVelocity,
                    p2: result.other.script.playerData.data.uuid
                });
            }

        }
    };

    return PlayerCollider;
});