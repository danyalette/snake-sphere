import * as THREE from 'three';
import { RADIUS, BALL_COUNT, VELOCITY } from './config';

export const width = window.innerWidth * 2;
export const height = window.innerHeight * 2;

//scene
export const scene = new THREE.Scene;
scene.fog=new THREE.Fog( 0xffffff, 90, 125 );

// camera
const VIEW_ANGLE = 45;
const ASPECT = width / height;
const NEAR = 0.1;
const FAR = 10000;
export const camera =
    new THREE.PerspectiveCamera(
        VIEW_ANGLE,
        ASPECT,
        NEAR,
        FAR
    );

// light
export const light =
  new THREE.PointLight(0xFFFFFF);
light.position.x = 10;
light.position.y = 50;
light.position.z = 130;

// renderer
const container = document.querySelector('#container');
export const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
container.appendChild(renderer.domElement);
renderer.setSize(width, height);
// retina fix
const canvas = document.querySelector("#container canvas");
canvas.style["max-width"] = window.innerWidth + 'px';
canvas.style["max-height"] = window.innerHeight + 'px';

// init
scene.add(light);
scene.add(camera);
camera.position.set(0,70,70);

// add wireframe sphere
const wireframeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true});
const wireframe = new THREE.Mesh(new THREE.SphereGeometry(RADIUS, 40, 40), wireframeMaterial);
wireframe.position.set(0, 0, 0);
scene.add(wireframe);
camera.lookAt( wireframe.position );