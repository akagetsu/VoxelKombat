// controls.js
pc.script.attribute("lookSpeed", "number", 0.9);

pc.script.attribute("power", "number", 500);

pc.script.attribute("projectionMod", "number", 50);

pc.script.create("controls", function(app) {
    var moveForce = new pc.Vec3();

    var jumpForce = new pc.Vec3();

    var projectionForce = new pc.Vec3();

    var Controls = function(entity) {
        this.entity = entity; //this is the player

        this.jumpFuel = 100; //fuel for the jump

        this.eulers = new pc.Vec3();

        this.camera = null;

        this.timer = 0; // in-game timer

        this.timeStamp = 0; // used to add 3 second cooldown for projection

        this.playerState = null;
    };

    Controls.prototype = {
        name: "Controls",
        initialize: function() {
            this.playerState = this.entity.script.playerData.data.state;
        },
        init: function(camera) {
            this.camera = camera;
        },
        update: function(dt) {
            this.timer += dt;
            this.playerState = this.entity.script.playerData.getState();
            this.move(dt);
            this.jump(dt);
            this.attack();
        },
        move: function(dt) {
            if (!this.camera)
                return;
            var forward = this.camera.forward;
            var right = this.camera.right;

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
                this.entity.rigidbody.applyForce(moveForce);
            }

            if (this.entity.getPosition().y <= -13 ||
                this.entity.getPosition().length() >= 400) {
                this.entity.script.playerData.data.dead = true;
            }
        },
        postUpdate: function(dt) {
            if (!this.camera || this.entity.getName() != "Player")
                return;
            this.eulers.x -= this.lookSpeed * this.entity.script.playerData.vew.dx;
            this.eulers.y -= this.lookSpeed * this.entity.script.playerData.vew.dy;

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

            var cameraPosition = this.camera.getPosition();
            this.camera.setLocalEulerAngles(this.eulers.y, this.eulers.x, 0);
            this.camera.setPosition(this.entity.getPosition());
            this.camera.rotateLocal(-15, 0, 0);
            this.camera.translateLocal(0, 2, 5);
            if (this.camera.getPosition().y <= 0) {
                this.camera.setPosition(cameraPosition.x, 0, cameraPosition.z);
            }
            this.entity.script.playerData.vew.dx = 0;
            this.entity.script.playerData.vew.dy = 0;
        },
        jump: function(dt) {
            if (this.playerState.jmp && this.jumpFuel >= 1) {
                jumpForce.set(0, 1, 0).normalize().scale(this.power);
                this.entity.rigidbody.applyForce(jumpForce);
                this.jumpFuel -= 35 * dt;
            } else if (!this.playerState.jmp || this.jumpFuel < 1) {
                if (this.entity.getPosition().y > 0.5 &&
                    !this.playerState.flr) {
                    jumpForce.set(0, -0.5, 0).normalize().scale(this.power);
                    this.entity.rigidbody.applyForce(jumpForce);
                }
                if (this.jumpFuel >= 100) {
                    this.jumpFuel = 100;
                } else {
                    this.jumpFuel += 35 * dt;
                }
            }
        },
        attack: function() {
            if (parseInt(this.timer) < this.timeStamp || !this.playerState.atk)
                return;
            this.timeStamp = parseInt(this.timer) + 3;
            this.entity.rigidbody.linearVelocity = new pc.Vec3(0, 0, 0);
            var forward = this.camera.forward;
            projectionForce.set(forward.x, forward.y, forward.z).normalize().scale(this.power * this.projectionMod);
            this.entity.rigidbody.applyForce(projectionForce);
            this.playerState.atk = false;
        }
    };

    return Controls;
});