game = game || {};
game.characters = (function() {
  /*var player = game.entity.create(40,67,  45,67, 0, 3, "player", "images/toribio.png"),*/
  var player = game.entity.create(
                  44,62,
                  game.setup.canvas.width-44, 62,
                  0, 3, "player", 
                  "images/personaje.png"
                ),

      wall = game.entity.create(
                30,30,
                0,300,
                0, 3, "ground",
                "images/tiles-ground-1.png"
              );
  
  var dx = 0.10;

  player.update = function(dt) {   
    //1. aplicamos velocidad a la position y
    this.position.y += this.vy;
    //2. agregamos friccion
    this.vy *= 0.99;
    //3. agregamos gravedad
    if(game.playerCollide) {
      this.isfalling = false;
      this.vy = this.vy * 0;
    } else {
      this.isfalling = true;
      this.vy += 0.5;
    }

    /*console.log("y: " + this.position.y);*/
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


  /*player.flipHorizontal = function(posX) {
    game.setup.ctx.translate(posX, 0);
    game.setup.ctx.scale(-1, 1);
    game.setup.ctx.translate(-posX, 0);
  };*/

  player.move = function () {
    var actions = game.input.actions;
    this.vx = 10;

    if(actions['move-left'] === true) {
      this.flipPlayer = true;
      //la formula para agregar velocidad es igual a x = x + dx * dt
      this.position.x -= this.vx;
    }

    if(actions['move-right'] === true) {
      this.position.x += this.vx;
      this.flipPlayer = false;
    }

    if(actions['move-up'] === true) {
      if(!this.falling) {
        this.vy -= 8;
      }
    }

  };
  
  return {
    player: player,
    wall: wall
  };
})();