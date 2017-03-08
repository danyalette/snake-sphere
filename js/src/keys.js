let keys = {};
let listeners = [];
let keyIsDown = false;
const CODES = {
  '40': 'down',
  '38': 'up',
  '39': 'right',
  '37': 'left'
}

const setKeyValueByCode = function(code, value) {
  const key = CODES[code];
  keys[key] = value;
}

export const isKeyPressed = function(key) {
  return keys[key];
}

export const getPressedKeys = function() {
  return keys;
}

export const registerKeyListener = function(listener) {
  listeners.push(listener);
}

window.onkeyup = function(e) {
  setKeyValueByCode(e.keyCode, false);
  keyIsDown = false;
  for (let i in keys) {
    if (keys[i]) keyIsDown = true;
  }
}

window.onkeydown = function(e) {
  if (keyIsDown) return;
  keyIsDown = true;
  setKeyValueByCode(e.keyCode, true);
  listeners.forEach(function(listener){
    listener(CODES[e.keyCode]);
  });
}