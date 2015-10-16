var game = game || {};

game.input = (function(){
  var keyMap = new Array(256),
      bindings = {},
      actions = {};

  var setAction = function(key, action) {
    bindings[key] = action;
  };

  setAction(37, "move-left");
  setAction(32, "move-up");
  setAction(39, "move-right");

  var keyDown = function(even) {
    even.preventDefault();
    var keyId = even.keyCode;
    var action = bindings[keyId];
    actions[action] = (keyMap[keyId] = true);
  };

  var keyUp = function(even) {
    even.preventDefault();

    var keyId = even.keyCode;
    var action = bindings[keyId];
    actions[action] = (keyMap[keyId] = false);
  };

  //registramos los eventos
  document.addEventListener('keydown', keyDown, false);
  document.addEventListener('keyup', keyUp, false);

  return {
    bindings: bindings,
    actions: actions
  }
})();