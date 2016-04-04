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
            "atk": false
        };

        // Disable browser default behaviour when we right click
        app.mouse.disableContextMenu();

        // Listen for mousemovement and handle it accordingly
        app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);

        // Listen for mouseclicks and handle them accordingly
        app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);

        app.mouse.on(pc.EVENT_MOUSEUP, this.onMouseUp, this);
    };

    Controls.prototype = {
        name: "Controls",
        initialize: function() {},
        init: function(player) {
            this.player = player;
        },
        update: function(dt) {
            if (!this.player)
                return;
            this.timer += dt;
            this.move(dt);
            this.jump(dt);
            this.checkFall();
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
        },
        postUpdate: function(dt) {
            if (!this.player)
                return;
            this.handleCamera();
        },
        handleCamera: function() {
            if (!this.player)
                return;
            var cameraPosition = this.entity.getPosition();
            this.entity.setLocalEulerAngles(this.eulers.y, this.eulers.x, 0);
            this.entity.setPosition(this.player.getPosition());
            this.entity.rotateLocal(-15, 0, 0);
            this.entity.translateLocal(0, 2, 5);
            if (this.entity.getPosition().y <= 0) {
                this.entity.setPosition(cameraPosition.x, 0, cameraPosition.z);
            }
        },
        onMouseMove: function(event) {
            if (!this.player)
                return;
            if (pc.Mouse.isPointerLocked() || event.buttons[0]) {
                this.eulers.x -= this.lookSpeed * event.dx;
                this.eulers.y -= this.lookSpeed * event.dy;

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
            }
        },
        jump: function(dt) {
            if (!this.player)
                return;
            if (this.pressedJump && this.jumpFuel >= 1) {
                jumpForce.set(0, 1, 0).normalize().scale(this.power);
                this.player.rigidbody.applyForce(jumpForce);
                this.jumpFuel -= 35 * dt;
            } else if (this.releasedJump || this.jumpFuel < 1) {
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
            if (!this.player || parseInt(this.timer) < this.timeStamp)
                return;
            this.timeStamp = parseInt(this.timer) + 3;
            this.player.rigidbody.linearVelocity = new pc.Vec3(0, 0, 0);
            var forward = this.entity.forward;
            projectionForce.set(forward.x, forward.y, forward.z).normalize().scale(this.power * this.projectionMod);
            this.player.rigidbody.applyForce(projectionForce);
        },
        checkFall: function() {
            if(this.player.getPosition().y <= -13) {
                this.player.script.playerData.data.dead = true;
            }
            // move this somewhere else potentially!
            setTimeout(function() {
                this.player.script.playerData.data.dead = false;
            }.bind(this), 3000);
        },
        onMouseDown: function(event) {
            if (!this.player)
                return;
            if (this.player.enabled) {
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
            if (!this.player)
                return;
            if (event.button === pc.MOUSEBUTTON_RIGHT) {
                this.pressedJump = false;
                this.releasedJump = true;
            }
        }
    };

    return Controls;
});