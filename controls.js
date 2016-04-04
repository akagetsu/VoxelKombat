// controls.js
pc.script.attribute("lookSpeed", "number", 0.9);

pc.script.attribute("power", "number", 10000);

pc.script.attribute("projectionMod", "number", 200);

pc.script.create("controls", function(app) {
    var moveForce = new pc.Vec3();

    var jumpForce = new pc.Vec3();

    var projectionForce = new pc.Vec3();

    var Controls = function(entity) {
        this.entity = entity; //this is the camera

        this.jumpFuel = 100; //fuel for the jump

        this.releasedJump = true;

        this.pressedJump = false;

        this.eulers = new pc.Vec3();

        this.player = null;

        this.timer = 0; // in-game timer

        this.timeStamp = 0; // used to add 3 second cooldown for projection

        this.playerState = {
            "fow": false,
            "bck": false,
            "lef": false,
            "rig": false,
            "jmp": false,
            "atk": false,
            "vew": {
                "dx": 0,
                "dy": 0
            }
        };
    };

    Controls.prototype = {
        name: "Controls",
        initialize: function() {},
        init: function(player) {
            this.player = player;
        },
        update: function(dt) {
            this.timer += dt;
            this.move(dt);
            this.jump(dt);
            this.attack();
        },
        move: function(dt) {
            if (!this.player)
                return;
            var forward = this.entity.forward;
            var right = this.entity.right;

            var x = 0;
            var z = 0;

            if (this.playerState.lef) {
                x -= right.x * dt;
                z -= right.z * dt;
            }

            if (this.playerState.rig) {
                x += right.x * dt;
                z += right.z * dt;
            }

            if (this.playerState.fow) {
                x += forward.x * dt;
                z += forward.z * dt;
            }

            if (this.playerState.bck) {
                x -= forward.x * dt;
                z -= forward.z * dt;
            }

            if (x !== 0 && z !== 0) {
                moveForce.set(x, 0, z).normalize().scale(this.power);
                this.player.rigidbody.applyForce(moveForce);
            }

            if (this.player.getPosition().y <= -13) {
                this.player.script.playerData.data.dead = true;
            }
        },
        postUpdate: function(dt) {
            if (!this.player)
                return;
            this.eulers.x -= this.lookSpeed * this.playerState.vew.dx;
            this.eulers.y -= this.lookSpeed * this.playerState.vew.dy;

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

            var cameraPosition = this.entity.getPosition();
            this.entity.setLocalEulerAngles(this.eulers.y, this.eulers.x, 0);
            this.entity.setPosition(this.player.getPosition());
            this.entity.rotateLocal(-15, 0, 0);
            this.entity.translateLocal(0, 2, 5);
            if (this.entity.getPosition().y <= 0) {
                this.entity.setPosition(cameraPosition.x, 0, cameraPosition.z);
            }
            this.playerState.vew.dx = 0;
            this.playerState.vew.dy = 0;
        },
        jump: function(dt) {
            if (!this.player)
                return;
            if (this.playerState.jmp && this.jumpFuel >= 1) {
                jumpForce.set(0, 1, 0).normalize().scale(this.power);
                this.player.rigidbody.applyForce(jumpForce);
                this.jumpFuel -= 35 * dt;
            } else if (!this.playerState.jmp || this.jumpFuel < 1) {
                if (this.player.getPosition().y > 0) {
                    jumpForce.set(0, -1, 0).normalize().scale(this.power);
                    this.player.rigidbody.applyForce(jumpForce);
                }
                if (this.jumpFuel >= 100) {
                    this.jumpFuel = 100;
                } else {
                    this.jumpFuel += 35 * dt;
                }
            }
        },
        attack: function() {
            if (!this.player || parseInt(this.timer) < this.timeStamp || !this.playerState.atk)
                return;
            this.timeStamp = parseInt(this.timer) + 3;
            this.player.rigidbody.linearVelocity = new pc.Vec3(0, 0, 0);
            var forward = this.entity.forward;
            projectionForce.set(forward.x, forward.y, forward.z).normalize().scale(this.power * this.projectionMod);
            this.player.rigidbody.applyForce(projectionForce);
            this.playerState.atk = false;
        }
    };

    return Controls;
});