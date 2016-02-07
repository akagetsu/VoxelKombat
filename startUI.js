pc.script.attribute("html", "asset", null, {
    type: "html"
});
pc.script.attribute("css", "asset", null, {
    type: "css"
});
pc.script.attribute("connection", "entity", null);

pc.script.create('startUi', function(app) {
    // Creates a new Ui instance
    var StartUi = function(entity) {
        this.entity = entity;
    };

    StartUi.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function() {
            var asset = app.assets.get(this.html);
            if (asset) {
                var div = document.createElement("div");
                div.id = "start-ui";
                div.innerHTML = asset.resource;
                document.body.appendChild(div);
            }

            var css = app.assets.get(this.css);
            if (css) {
                style = pc.createStyle(css.resource);
                document.head.appendChild(style);
            }

            // on-click
        },

        // Called every frame, dt is time in seconds since last update
        update: function(dt) {}
    };

    return StartUi;
});