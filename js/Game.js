var game = game || {};
game.start = (function(){
  game.setup.canvas.width = 600;
  game.setup.canvas.height = 600;

  var entities = [],
      x = 0, y = 0;
  var player = game.characters.player,
      wall = game.characters.wall;

  entities.push(player, wall);
  //mainLoop
  //animacion basada en tiempo
  var dt = 0.0,
      dt_fijo = 1000/60, //delta time maximo
      currentTime = Date.now(),
      lastTime = 0.0,
      accumulator = 0.0;
  
  var gameLoop = function() {
    lastTime = currentTime;
    currentTime = Date.now();
    dt = currentTime - lastTime; //Delta time es la diferencia entre currentTime y LastTime
    accumulator += dt;
    
    //tiempo fijo conun limite
    if(accumulator >= dt_fijo) {
      for(var i = 0; i < entities.length; i ++) {
        entities[i].update(dt_fijo);
        entities[i].draw(entities[i].frame);
      }
      //limpiar el lienzo
      game.setup.ctx.clearRect(0,0, game.setup.canvas.width, game.setup.canvas.height);
      accumulator -= dt_fijo;
    }

    setTimeout(gameLoop, 1000/30);
  }

  gameLoop();

  //Insertar canvas al body tag
  document.body.appendChild(game.setup.canvas);
})();