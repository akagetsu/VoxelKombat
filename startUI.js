pc.script.attribute("html", "asset", null, {
    type: "html"
});
pc.script.attribute("css", "asset", null, {
    type: "css"
});

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
                var btn = document.getElementById("btn-connect");
                btn.onclick = this.connectToGame.bind(this);
            }

            var css = app.assets.get(this.css);
            if (css) {
                style = pc.createStyle(css.resource);
                document.head.appendChild(style);
            }
        },
        update: function(dt) {},

        connectToGame: function() {
            this.entity.script.conn.connectPlayer();
        }
    };

    return StartUi;
});