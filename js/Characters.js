game = game || {};
game.characters = (function() {
  var player = game.entity.create(44,60,  44,60, 0, 3, "player", "images/personaje.png"),
      wall = game.entity.create(30,30,  0,200, 0, 3, "ground", "images/tiles-ground-1.png");

  var dx = 0.2;

  player.update = function(dt) {
    if(this.position.x < (game.setup.canvas.width - this.spriteW)) {
      this.position.x += dx * dt; //se mueve 180px en un segundo
      this.frame = (this.frame+1) % this.totalFrames;
    } else {
      //restando a this.position.x su valor total
      //genera efecto de teletransportacion a coordenada inicial
      this.position.x -= this.position.x;
      this.frame = (this.frame+1) % this.totalFrames;
    }
  };

  wall.update = function(dt) {
    for(var i = 0; i < 100; i ++) {
      this.draw(this.frame);
    }
  };

  return {
    player: player,
    wall: wall
  };
})();