game = game || {};
game.characters = (function() {
  /*var player = game.entity.create(40,67,  45,67, 0, 3, "player", "images/toribio.png"),*/
  var player = game.entity.create(44,60,  44,60, 0, 3, "player", "images/personaje.png"),
      wall = game.entity.create(30,30,  0,300, 0, 3, "ground", "images/tiles-ground-1.png");

  var dx = 0.10;

  player.update = function(dt) {
    if(this.position.x < (game.setup.canvas.width - this.spriteW)) {
      /*this.position.x += dx * dt;*/
      //cambiar fotograma y volver a cero
      this.frame = (this.frame+1) % this.totalFrames;
    } else {
      //restando a this.position.x su valor total
      //genera efecto de teletransportacion a coordenada inicial
      /*this.position.x -= this.position.x;*/
      this.frame = (this.frame+1) % this.totalFrames;
    }
  };

  player.move = function () {
    var actions = game.input.actions;

    if(this.position.x > 0) {
      if(actions['move-left'] === true) {
        //la formula para agregar velocidad es igual a x = x + dx * dt
        this.position.x -= 10;
      }
      if(actions['move-right'] === true) {
        this.position.x += 10;
      }
      if(actions['move-up'] === true) {
        console.log('saltar');
      }
    }
  }

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