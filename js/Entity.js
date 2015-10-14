var game = game || {
  setup: {
    canvas: document.createElement('canvas'),
    width: 600,
    height: 600,
    ctx: null
  }
};

game.entity = (function() {
  game.setup.ctx = game.setup.canvas.getContext('2d');

  var create = function(spriteW, spriteH, posX, posY, frame, totalFrames, type, imgUrl) {
    return {
      spriteW: spriteW,
      spriteH: spriteH,
      position: {
        x: posX,
        y: posY
      },

      frame: frame,
      totalFrames: totalFrames,
      falling: false,

      type: type,
      imgUrl: imgUrl || null,

      draw : function(frame) {
        var self = this;

        if(!frame) this.frame = 0;

        if(self.imgUrl !== null) {
          //creamos la imagen y le pasamos la ruta
          var image = new Image();
          image.src = self.imgUrl;

          image.onload = function() {
            /*Dibujamos una región de la imagen usando el metodo ctx.drawImage()
              pasamos nueve parametros: ctx.drawImage(Image, sx,sy,  sw,sh,  dx,dy, dw,dh)
            
            -Indican el rectangulo -trozo dentro de la imagen- que copiaremos: (sx,sy, sw,sh)
            -Indican el rectangulo -Región de la pantalla- a dibujar trozo copiado: (dx,dy, dh,dw) */
            game.setup.ctx.drawImage(
              image, frame*self.spriteW, 0,  self.spriteW, self.spriteH,
              self.position.x, self.position.y,
              self.spriteW, self.spriteH);
          };

        }
      },

      update: function() {
      },

    };
  };

  return {
    create: create,
  };
})();
