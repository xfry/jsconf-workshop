var game = game || {
  playerCollide: undefined,
};

game.start = (function(){
  game.setup.canvas.width = 600;
  game.setup.canvas.height = 600;

  var entities = [],
      x = 0, y = 0;
  var player = game.characters.player;

  entities.push(player);
  //mainLoop
  //animacion basada en tiempo
  var dt = 0.0,
      dt_fijo = 1000/30, //delta time maximo
      currentTime = Date.now(),
      lastTime = 0.0,
      accumulator = 0.0;
  
  var tileX = 0,
      newGround; 
  
  var createGround = function() {
    for(var i = 0; i < 20; i++) {
      tileX+=30;
      newGround = game.entity.create(30,30,  tileX,400, 0, 3, "ground", "images/tiles-ground-1.png")
      entities.push(newGround);
    }
  };

  var update = function(dt) {
    for(var i = 0; i < entities.length; i ++) {
        entities[i].update(dt);
    }
  };

  var draw = function() {

    for(var i = 0; i < entities.length; i ++) {
      entities[i].draw(entities[i].frame);
    }
  };

  var updateInputs = function() {
    for(var i = 0; i < entities.length; i ++) {
      if(entities[i].typeCharacter === "player") {
        entities[i].move();        
      }
    }
  };
  
  var isCollide = function() {
    for(var i = 1; i < entities.length; i ++) {
      if( (entities[0].position.y + entities[0].spriteH + 10) > (entities[i].position.y) ) {
        game.playerCollide = true;
        entities[0].falling = false;
      } else {
        game.playerCollide = false;
        entities[0].falling = true;
      }
    }
  };

  createGround();

  var gameLoop = function() {
    lastTime = currentTime;
    currentTime = Date.now();
    dt = currentTime - lastTime; //Delta time es la diferencia entre currentTime y LastTim
    accumulator += dt;

    //tiempo fijo conun limite
    if(accumulator >= dt_fijo) {
      accumulator -= dt_fijo;
      
      updateInputs();
      isCollide();
      update(dt);
      draw();

      //limpiar el lienzo
      game.setup.ctx.clearRect(0,0, game.setup.canvas.width, game.setup.canvas.height);
    }

    setTimeout(gameLoop, 1000/30);
  };


  gameLoop();

  //Insertar canvas al body tag
  document.body.appendChild(game.setup.canvas);
})();