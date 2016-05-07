pc.script.create("playerCollider", function(app) {
    var PlayerCollider = function(entity) {
        this.entity = entity;
        this.conn = null;
    };

    PlayerCollider.prototype = {
        initialize: function() {
            this.entity.collision.on('collisionstart', this.onCollisionStart, this);
            this.entity.collision.on('collisionend', this.onCollisionEnd, this);
            this.conn = app.root.findByName("Root").script.conn;
        },

        onCollisionStart: function(result) {
            if (!this.conn)
                return;
            if (result.other.rigidbody && result.other.getName() === "Other Player") {
                var data = {};
                if (result.other.rigidbody.linearVelocity.length() >=
                    this.entity.rigidbody.linearVelocity.length()) {
                    data = {
                        time: Date.now(),
                        gameId: result.other.script.playerData.data.gameId,
                        winId: result.other.script.playerData.data.uuid,
                        deadId: this.entity.script.playerData.data.uuid
                    };
                } else {
                    data = {
                        time: Date.now(),
                        gameId: this.entity.script.playerData.data.gameId,
                        winId: this.entity.script.playerData.data.uuid,
                        deadId: result.other.script.playerData.data.uuid
                    };
                }
                this.conn.collide(data);
            }

            if (result.other.name.includes('Box')) {
                this.entity.script.controls.playerState.flr = true;
            }
        },
        onCollisionEnd: function(result) {
            if (result.name.includes('Box')) {
                this.entity.script.controls.playerState.flr = false;
            }
        }
    };

    return PlayerCollider;
});