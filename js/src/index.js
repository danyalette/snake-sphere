import * as THREE from 'three';
import { RADIUS, BALL_COUNT, VELOCITY } from './config';
import { scene, camera, renderer } from './setup';
import { registerKeyListener } from './keys';
import { makeEntity } from './entity';
import * as geometry from './geometry';

let movingBalls,
    stationaryBalls,
    dead,
    head,
    anim;

document.getElementById('restart').addEventListener('click', function(){
  initializeEntities();
});

registerKeyListener(updateHeadDirection);
initializeEntities();

function initializeEntities() {

  if (movingBalls) movingBalls.concat(stationaryBalls).forEach(function(ball){
    scene.remove(ball);
  });

  movingBalls = [];
  stationaryBalls = [];
  dead = false;
  // UI
  renderDead(false);
  renderScore(0);
  // create stationary entities
  for (let i = 0; i < BALL_COUNT; i++) {
    let lon = Math.random()*20;
    let u = Math.random()*20;
    createStationaryBall(lon, u);
  }
  // create head ball
  head = makeEntity();
  head.direction = 'right';
  head.scale.set(1.2, 1.2, 1.2);
  setBallPositionFromLonU(head, 0, 7, 0.5);
  movingBalls.push(head);
  scene.add(head);

  anim = requestAnimationFrame(render);
}

// update positions
function update () {
  var newLonU = geometry.getLonUForDirection(head.lon, head.u, head.direction);
  head.direction = newLonU.direction;
  renderScore(movingBalls.length - 1);
  // check if eating - collided with stationary ball
  let eatenBalls = [];
  stationaryBalls.forEach(function(ball, index){
    if (ball.boundingBox.intersectsBox(head.boundingBox)) {
      removeStationaryBall(ball);
      eatenBalls.push(ball);
      createStationaryBall(Math.random()*20, Math.random()*20);
    }
  });
  // check if dead - collided with self
  movingBalls.forEach(function(ball, index){
    if (ball.boundingBox.intersectsBox(head.boundingBox)) {
      if ((index === 0) || index >= movingBalls.indexOf(head) - 3) return;
      cancelAnimationFrame(anim);
      dead = true;
      renderDead(true, index);
    }
  });
  eatenBalls.forEach(function(ball){
    addMovingBall(ball);
  });
  movingBalls.forEach(function(ball, index){
    if (movingBalls.length - 1 > index) {
      let nextBallPos = movingBalls[index+1].position;
      setBallPosition(ball, nextBallPos, 0.3);
    }
  });
  setBallPositionFromLonU(head, newLonU.lon, newLonU.u, 0.5);
}

// render scene
let frameCount = 0;
function render() {
    frameCount++;
    if (frameCount == 5) {
      frameCount = 0;
      update();
    }
    var timer = Date.now() * 0.0003;
    camera.position.x = Math.cos( timer ) * 70;
    camera.position.z = Math.sin( timer ) * 70;
    camera.lookAt({x:0,y:0,z:0});
    renderer.render( scene, camera );
    if (!dead) anim = requestAnimationFrame(render);
}


// utils

function createStationaryBall(lon, u) {
  let ball = makeEntity();
  setBallPositionFromLonU(ball, lon, u, 0.8);
  scene.add(ball);
  stationaryBalls.push(ball);
}

function removeStationaryBall(ball) {
  ball.visible = false;
  let index = stationaryBalls.indexOf(ball);
  if (index > -1) {
    stationaryBalls.splice(index, 1);
    // prevent collision with removed ball
    setBallPosition(ball, ball.position, 0);
    scene.remove(ball);
  }
}

function addMovingBall(ball) {
  movingBalls.unshift(ball);
  ball.visible = true;
  scene.add(ball);
}

function setBallPosition(ball, position, scaleCollisionBox) {
  ball.position.set(position.x, position.y, position.z);
  // collision box
  let ballClone = ball.clone();
  ballClone.scale.set(scaleCollisionBox, scaleCollisionBox, scaleCollisionBox);
  ball.boundingBox = new THREE.Box3().setFromObject(ballClone);
}

function setBallPositionFromLonU(ball, lon, u, scaleCollisionBox) {
  var newPos = geometry.getPosFromLonU(lon, u);
  if (newPos) {
    ball.u = u;
    ball.lon = lon;
    setBallPosition(ball, newPos, scaleCollisionBox);
  }
}

function updateHeadDirection(d){
  if (!d) return;
  if (
    (movingBalls.length > 1) &&
    ((head.direction == 'left' && d == 'right') ||
    (head.direction == 'right' && d == 'left') ||
    (head.direction == 'up' && d == 'down') ||
    (head.direction == 'down' && d == 'up')))
      // prevent snake from turning back on itself
      return;
  head.direction = d;
}

function renderScore(score) {
  document.getElementById('score-value').innerHTML = score;
}

function renderDead(isDead, index) {
  if (isDead) {
    document.getElementById('controls').className = 'dead';
    console.log('DEAD', index);
  } else {
    document.getElementById('controls').className = '';
  }
}