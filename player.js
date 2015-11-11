// player.js
// move factor attribute
pc.script.attribute('speed', 'number', 1, {
    min: 0.1,
    max: 1
});

pc.script.create("player", function(app) {
    var Player = function(entity) {
        this.entity = entity;

        // Disable browser default behaviour when we right click
        app.mouse.disableContextMenu();

        // Listen for mousemovement and handle it accordingly
        app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);

        // Listen for mouseclicks and handle them accordingly
        app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);

        // Listen for keypress events and handle them accordingly
        app.keyboard.on(pc.EVENT_KEYDOWN, this.onKeyDown, this);

    };

    Player.prototype = {
        name: "PlayerName",
        initialize: function() {
            this.speed = 0.5;
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
        onMouseMove: function(event) {

        },
        onMouseDown: function(event) {

        },
        onKeyDown: function(event) {

        }
    };

    return Player;
});