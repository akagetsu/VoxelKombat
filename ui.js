//Inspired from https://playcanvas.com/project/359952/code
pc.script.attribute("hud", "asset", null, {
    type: "html"
});
pc.script.attribute("start", "asset", null, {
    type: "html"
});
pc.script.attribute("serverError", "asset", null, {
    type: "html"
});
pc.script.attribute("scores", "asset", null, {
    type: "html"
});
pc.script.attribute("css", "asset", null, {
    type: "css"
});

pc.script.create('ui', function(app) {
    // Creates a new Ui instance
    var Ui = function(entity) {
        this.entity = entity;
        this.start = null;
        this.serverError = null;
        this.hud = null;
        this.playerControls = null;
        this.project = null;
        this.jumpFuel = null;
        this.animate = false;
    };

    Ui.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function() {
            var css = app.assets.get(this.css);
            if (css) {
                style = pc.createStyle(css.resource);
                document.head.appendChild(style);
            }
        },
        // Called every frame, dt is time in seconds since last update
        update: function(dt) {
            if (!this.playerControls || !this.project || !this.jumpFuel)
                return;
            this.handleProjection();
            this.handleJump();
        },
        showStart: function() {
            var asset = app.assets.get(this.start);
            if (asset) {
                this.start = document.createElement("div");
                this.start.id = "start-ui";
                this.start.innerHTML = asset.resource;
                this.start.getElementsByClassName("btn-connect")[0].onclick = this.performConn.bind(this);
                document.body.appendChild(this.start);
            }
        },
        showServerError: function() {
            var asset = app.assets.get(this.serverError);
            if(asset) {
                this.serverError = document.createElement("div");
                this.serverError.id = "server-error";
                this.serverError.innerHTML = asset.resource;
                document.body.appendChild(this.serverError);
            }
        },
        removeStart: function() {
            this.start.remove();
        },
        showHUD: function(controls) {
            var asset = app.assets.get(this.hud);
            this.playerControls = controls;
            if (asset) {
                this.hud = document.createElement("div");
                this.hud.id = "ui";
                this.hud.innerHTML = asset.resource;
                document.body.appendChild(this.hud);

                this.project = this.hud.getElementsByClassName("projection")[0];
                this.jumpFuel = this.hud.getElementsByClassName("jump-fuel");
            }
        },
        handleProjection: function() {
            if (parseInt(this.playerControls.timer) >= this.playerControls.timeStamp) {
                this.project.className = 'projection';
                this.animate = false;
            } else if (parseInt(this.playerControls.timer) < this.playerControls.timeStamp && !this.animate) {
                this.project.className = 'projection animate';
                this.animate = true;
            }
        },
        handleJump: function() {
            for (var i = 0; i <= 1; i++) {
                this.jumpFuel[i].style.height = parseInt(this.playerControls.jumpFuel) + "%";
            }
        },
        removeHUD: function() {
            this.hud.remove();
        },
        performConn: function() {
            this.entity.script.conn.playerConn();
        }
    };

    return Ui;
});