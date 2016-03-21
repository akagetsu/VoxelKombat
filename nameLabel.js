pc.script.attribute('text', 'string', 'Hello World');

pc.script.create('text', function (app) {
    // Creates a new Text instance
    var Text = function (entity) {
        this.entity = entity;
    };

    Text.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            // Create a canvas to do the text rendering
            this.canvas = document.createElement('canvas');
            this.canvas.height = 128;
            this.canvas.width = 512;
            this.context = this.canvas.getContext("2d");

            this.texture = new pc.Texture(app.graphicsDevice, {
                format: pc.PIXELFORMAT_R8_G8_B8_A8,
                autoMipmap: true
            });
            this.texture.setSource(this.canvas);
            this.texture.minFilter = pc.FILTER_LINEAR_MIPMAP_LINEAR;
            this.texture.magFilter = pc.FILTER_LINEAR;
            this.texture.addressU = pc.ADDRESS_CLAMP_TO_EDGE;
            this.texture.addressV = pc.ADDRESS_CLAMP_TO_EDGE;

            this.updateText();

            this.entity.model.material.emissiveMap = this.texture;
            this.entity.model.material.opacityMap = this.texture;
            this.entity.model.material.blendType = pc.BLEND_NORMAL;
            this.entity.model.material.update();
        },

        updateText: function () {
            var ctx = this.context;
            var w = ctx.canvas.width;
            var h = ctx.canvas.height;

            // Clear the context to transparent
            ctx.fillStyle = "#00000000";
            ctx.fillRect(0, 0, w, h);

            // Write white text
            ctx.fillStyle = 'white';
            ctx.save();
            ctx.font = 'bold 70px Verdana';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.text, w / 2, h / 2);
            ctx.restore();

            // Copy the canvas into the texture
            this.texture.upload();
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
        }
    };

    return Text;
});