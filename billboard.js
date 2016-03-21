pc.script.create('billboard', function (app) {
    // Creates a new Billboard instance
    var Billboard = function (entity) {
        this.entity = entity;
    };

    Billboard.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.camera = app.root.findByName('Camera');
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            this.entity.setRotation(this.camera.getRotation());
            this.entity.rotateLocal(90, 0, 0);
        }
    };

    return Billboard;
});