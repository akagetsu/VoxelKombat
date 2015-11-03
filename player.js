// player.js
// move factor attribute
pc.script.attribute('speed','number', 1, {
    min: 0.1,
    max: 1
});

pc.script.create("player", function (app) {
    var Player = function (entity) {
        this.entity = entity;
    };

    Player.prototype = {
        name: "PlayerName",
        initialize: function() {
            this.speed = 0.5;
        },
        increaseSpeed: function(p) {
            if(this.speed <= 1){
                this.speed += p;
            }
        },
        decreaseSpeed: function(p) {
            if(this.speed >= 0){
                this.speed -= p;
            }
        },
        strafe: function (direction) {
            if(direction === "left") {
                this.entity.translateLocal(-this.speed, 0,0);
            } else if(direction === "right") {
                this.entity.translateLocal(this.speed,0,0);
            }
        },
        walk: function(direction) {
            if(direction === "forward") {
                this.entity.translateLocal(0,0,-this.speed);
            }else if(direction==="backward"){
                this.entity.translateLocal(0,0,this.speed);
            }
        },
        rotate: function(direction) {
            if(direction === "left") {
                this.entity.rotateLocal(0,this.speed+1,0);
            }else if(direction === "right") {
                this.entity.rotateLocal(0,-this.speed-1,0);
            }
        },
        getSpeed: function (){
            return this.speed;
        }
    };

    return Player;
});