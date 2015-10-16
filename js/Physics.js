var game = game || {};
/*
La física de newton es lo primero en lo que debemos pensar,
luego debemos tener en cuenta las formulas que implementaremos en nuestro juego.
  -Velocidad
  -Aceleación
  -Colisiones
  -Mejorar colisiones

links de interes:
  -Physics engine anatomy 
*/

// 1. Inicializamos los espacios de nombres de box2d
// 1. Inicializamos los espacios de nombres de box2d
var b2Vec2 = Box2D.Common.Math.b2Vec2,
Max = Box2D.Common.Math.b2Math.Max,
Min = Box2D.Common.Math.b2Math.Min,
b2World = Box2D.Dynamics.b2World,
b2BodyDef = Box2D.Dynamics.b2BodyDef,
b2Body = Box2D.Dynamics.b2Body,
b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
b2Fixture = Box2D.Dynamics.b2Fixture,
b2MassData = Box2D.Collision.Shapes.b2MassData,
b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

var suelo;
var world;
var bodies = [];
var box;

window.onload = function() {
// 2. Definimos el mundo y las variables que usaremos para la simulacion
  var FPS = 1.0/60;

  var gravity = new b2Vec2(0,2.5),
      velocityIteration = 8,
      velocityPosition = 3;
      scale = 30.0;

      world = new b2World(gravity, true);
  
  var canvas = document.getElementById('myCanvas');
// 3. Crear un cuerpo rigido con sus propiedades
  var registerBody = function(bodyDef) {
    var body = world.CreateBody(bodyDef);
    return body;
  };

  var createBody = function(entityDef, complex) {
    //3.1 Definir cuerpo
    var complexData = complex || false;
     //crear cuerpo
    var bodyDef = new b2BodyDef();
    
    if (entityDef.typeBody === "kinematic") {
      bodyDef.type = b2Body.b2_kinematicBody;
    } else if (entityDef.typeBody === "dynamic") {
      bodyDef.type = b2Body.b2_dynamicBody;
    } else {
      bodyDef.type = b2Body.b2_staticBody;
    }

    bodyDef.position.x = entityDef.position.x / scale;
    bodyDef.position.y = entityDef.position.y / scale; //recuerda 
    bodyDef.angle = entityDef.angle;
    
    //Crear fixtures para el cuerpo
    var fixtureDef = new b2FixtureDef();

    fixtureDef.density = entityDef.density; //desidad se usa para calcular el peso del cuerpo
    fixtureDef.friction = entityDef.friction; //COF hace que el cuerpo se deslice
    fixtureDef.restitution = entityDef.restitution; //COR le da capacidad de rebote

    //registrar cuerpo
    var body = registerBody(bodyDef);

    //crear figura comompleja
    if(complexData) {
      if(entityDef.shape === "circle" && complexData.shape === "polygon") {
        //crear primera figura
        fixtureDef.shape = new b2CircleShape(entityDef.radio/scale);
        var fixture1 = body.CreateFixture(fixtureDef);
        console.log('este va ', entityDef);
        //crar segunda figura
        fixtureDef.shape = new b2PolygonShape();
        fixtureDef.shape.SetAsArray(complexData.points, complexData.points.length);
        var fixture2 = body.CreateFixture(fixtureDef);
        console.log('este va ', complexData);
        
        //body.DestroyFixture(fixture2); //destroyir fixtures y agregar nuevos

        return body;
      }
    } else {
      if (entityDef.shape === "box") {
        console.log('este se ejecuto');
        fixtureDef.shape = new b2PolygonShape();
        fixtureDef.shape.SetAsBox(entityDef.width /2.0/ scale, entityDef.height /2.0/ scale);

        body.CreateFixture(fixtureDef);
        return body;

      } else if (entityDef.shape === "circle") {
        fixtureDef.shape = new b2CircleShape(entityDef.radio/scale);
        body.CreateFixture(fixtureDef);
        return body;

      } else if (entityDef.shape === "polygon") {
        fixtureDef.shape = new b2PolygonShape();
        fixtureDef.shape.SetAsArray(entityDef.points, entityDef.points.length);
        
        body.CreateFixture(fixtureDef);
        return body;
      }
    }
   
    //adjuntar definicion de un cuerpo a variable

    return body;
  };

  var spowner = function() {
    var bodyDef = new b2BodyDef();
    bodyDef.type = b2Body.b2_dynamicBody;
    bodyDef.angle = 0;
    bodyDef.position.Set(100/scale, 100/scale);

    var myFixtures = new b2FixtureDef();
    myFixtures.shape = new b2PolygonShape();
    myFixtures.shape.SetAsBox(50/2/scale, 50/2/scale);
    myFixtures.density = 1;
    //crear cuerpo dinamico Rectangulo
    box = world.CreateBody(bodyDef);
    box.CreateFixture(myFixtures);

    //crear cuerpo estatico
    bodyDef.type = b2Body.b2_staticBody;
    bodyDef.position.Set(0,0);
    var staticBody = world.CreateBody(bodyDef);

    myFixtures.shape.SetAsBox(600/scale, 10/scale);
    staticBody.CreateFixture(myFixtures);

    myFixtures.shape.SetAsBox(10/scale, 600/scale);
    staticBody.SetPosition(new b2Vec2(0/scale, 0/scale));
    staticBody.CreateFixture(myFixtures);
  };

  suelo = createBody({
    healt: 100,
    width: 600,
    height: 40,

    typeBody: 'static',
    position: {
      x: 300,
      y: 600
    },
    
    angle: 0,

    density: 1,
    restitution: 0,
    friction: 0,

    shape: "box"
  });

  paredDereca = createBody({
    healt: 100,
    width: 10,
    height: 600,

    typeBody: 'static',
    position: {
      x: 590,
      y: 300
    },
    
    angle: 0,

    density: 1,
    restitution: 0,
    friction: 0,

    shape: "box"
  });

  var debug = function(ctx, scale) {
    var debugDraw = new b2DebugDraw();
    //usar el contexto de canvas para dibujar el debug
    debugDraw.SetSprite(ctx);
    //establecer escala
    debugDraw.SetDrawScale(scale);
    //llenar los objetos con trasnparencia
    debugDraw.SetFillAlpha(0.3);
    //definir rayado de linea con 1 de grosor
    debugDraw.SetLineThickness(1.0);
    //mostrar todas las formas y uniones de formas
    debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);

    //inicializar el debug
    world.SetDebugDraw(debugDraw); 
  }
    /*Crear rectangulo en el canvas*/
  var updateGame = function() {

    world.Step(FPS, velocityIteration, velocityPosition);
    world.ClearForces();
    world.DrawDebugData();

    setTimeout(function() {
      updateGame();
    }, FPS);

  }

  
  spowner();

  var moveBox = function() {   
    
    //USANDO VELOCIDAD LINEAR
    var vel = box.GetLinearVelocity();  
    //para agregar velocidad linear necesito conocer el centro de massa
    //y luego aplicar fuerza postiva o negativa
    //caputar imputs y ejecutar la
    /*box.SetAwake(true);
      box.SetLinearVelocity(new b2Vec2(0, -300), box.GetWorldCenter());
      tambien podemos usar GetWorldPoint(1,1);
    */
    
    /*document.addEventListener('keydown', function(e){
      if(e.keyCode === 37) {
        //vel.x = -5;
        vel.x = Max(vel.x -0.1, -5.0); //incremental constante
        box.SetAwake(true);
      } else if(e.keyCode === 38) {
        //ApplyLinearImpulse es lo mismo que ApplyImpulse
        
      } else if(e.keyCode === 39) {
        //vel.x = 5;
        vel.x = Min(vel.x + 0.1, 5.0); //incremental constante
        box.SetAwake(true);
      } else {
        box.SetAwake(false);
      }
    }, false);
    box.SetLinearVelocity(vel);//establecer velocidad */

    //USANDO FUERZAS
    var force = 0;
    console.log(force);
    /*document.addEventListener('keydown', function(e){
      if(e.keyCode === 37) {
        //vel.x = -5;
        if(vel.x > -5.0) force = -50; //graduar la fuerza al acercarse al limite
        box.SetAwake(true);
      } else if(e.keyCode === 38) {
        //ApplyLinearImpulse es lo mismo que ApplyImpulse

      } else if(e.keyCode === 39) {
        //vel.x = 5;
        if(vel.x < 5.0) force = 50; //graduar la fuerza al acercarse al limite
        console.log(vel.x);
        box.SetAwake(true);

      } else {
        force = vel.x *-10;
        box.SetAwake(false);
      }
      console.log(force);
      box.ApplyForce(new b2Vec2(force,0), box.GetWorldCenter());//establecer velocidad
    }, false);*/
  };

  moveBox();
  debug(canvas.getContext('2d'), scale);
  updateGame();
}