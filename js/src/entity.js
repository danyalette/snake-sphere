import * as THREE from 'three';

export const makeEntity = function() {
  const material = new THREE.MeshPhongMaterial({ color: 0x333333, shading: THREE.SmoothShading, specular: 0x000000, shininess: 0});
  const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.85, 15, 15), material);
  sphere.position.set(0, 0, 0);
  return sphere;
}