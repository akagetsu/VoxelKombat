//Inspired from https://playcanvas.com/project/359952/code
pc.script.attribute("hud", "asset", null, {
    type: "html"
});
pc.script.attribute("start", "asset", null, {
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
        this.hud = null;
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
        update: function(dt) {},
        showStart: function(callback) {
            var asset = app.assets.get(this.start);
            if (asset) {
                this.start = document.createElement("div");
                this.start.id = "start-ui";
                this.start.innerHTML = asset.resource;
                this.start.getElementsByClassName("btn-connect")[0].onclick = callback;
                document.body.appendChild(this.start);
            }
        },
        removeStart: function() {
            this.start.remove();
        },
        showHUD: function() {
            var asset = app.assets.get(this.html);
            if (asset) {
                this.hud = document.createElement("div");
                this.hud.id = "ui";
                this.hud.innerHTML = asset.resource;
                document.body.appendChild(this.hud);
            }
        },
        removeHUD: function() {
            this.hud.remove();
        }
    };

    return Ui;
});