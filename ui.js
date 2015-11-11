//Inspired from https://playcanvas.com/project/359952/code

pc.script.attribute("html", "asset", null, {
    type: "html"
});
pc.script.attribute("css", "asset", null, {
    type: "css"
});

pc.script.create('ui', function(app) {
    // Creates a new Ui instance
    var Ui = function(entity) {
        this.entity = entity;
    };

    Ui.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function() {
            var asset = app.assets.get(this.html);
            if (asset) {
                var div = document.createElement("div");
                div.id = "ui";
                div.innerHTML = asset.resource;
                document.body.appendChild(div);
            }

            var css = app.assets.get(this.css);
            if (css) {
                style = pc.createStyle(css.resource);
                document.head.appendChild(style);
            }
        },

        // Called every frame, dt is time in seconds since last update
        update: function(dt) {}
    };

    return Ui;
});