import { RADIUS, VELOCITY } from './config';

// U is longitude where values are in range [-RADIUS, RADIUS]
const getLonFromVelocityAtU = function(v, u) {
  let capRadius = Math.sqrt((RADIUS - u)*((2*RADIUS)-(RADIUS - u)));
  let circumferenceOfCap = 2 * Math.PI * capRadius;
  return v/circumferenceOfCap;
}

const getUFromVelocityAtU = function(v, u) {
  // a is rotation in radians for given velocity
  let a = v/(2 * Math.PI * RADIUS);
  let angleAtCurrentU = Math.atan2(u, Math.sqrt(Math.pow(RADIUS, 2) - Math.pow(u, 2)));
  let newAngle = a + angleAtCurrentU;
  let newU = RADIUS * Math.sin(newAngle);
  return newU;
}

export const getPosFromLonU = function(lon, u) {
  if (!u && u !== 0) return;
  let x = Math.sqrt(Math.pow(RADIUS, 2)-Math.pow(u, 2)) * Math.sin(lon);
  let y = u;
  let z	=	Math.sqrt(Math.pow(RADIUS, 2)-Math.pow(u, 2)) * Math.cos(lon);
  return {
    x: x,
    y: y,
    z: z
  }
}

export const getLonUForDirection = function(lon, u, direction) {

  let newUUp = getUFromVelocityAtU(VELOCITY, u);
  let newUDown = getUFromVelocityAtU(-VELOCITY, u);

  let rotate = false;

  if ((newUUp < u) && (direction == 'up')) {
    direction = 'down';
    rotate = true;
  }
  else if ((newUDown > u) && direction == 'down') {
    direction = 'up';
    rotate = true;
  }
  // move head
  if (direction == 'up') {
    u = newUUp;
  }
  else if (direction == 'down') {
    u = newUDown;

  }
  else if (direction == 'right'){
    lon += getLonFromVelocityAtU(VELOCITY, u);
  }
  else if (direction == 'left'){
    lon -= getLonFromVelocityAtU(VELOCITY, u);
  }

  if (rotate) {
    lon += Math.PI;
    rotate = false;
  }

  return {
    lon: lon,
    u: u,
    direction: direction
  }
}