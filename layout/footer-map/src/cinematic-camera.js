import * as THREE from 'three';

// Camera movement adapts the startIntro/updateIntro approach in akella/threejs.paris (MIT).
// Distances here are metres because the reoriented 3D Tiles are not scaled into game units.
const DURATION = 8;
const END_DISTANCE = 850;
const START_DISTANCE = 180_000;
const END_PITCH = THREE.MathUtils.degToRad(34);
const START_PITCH = THREE.MathUtils.degToRad(79);
const END_BEARING = THREE.MathUtils.degToRad(28);

function smootherstep(t) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

export class CinematicCamera {
  constructor(camera, controls, fog, target, onComplete) {
    this.camera = camera;
    this.controls = controls;
    this.fog = fog;
    this.target = target.clone();
    this.onComplete = onComplete;
    this.elapsed = 0;
    this.active = false;
    this.setPose(0);
  }

  start(reducedMotion = false) {
    this.controls.enabled = false;
    if (reducedMotion) {
      this.setPose(1);
      this.finish();
      return;
    }
    this.elapsed = 0;
    this.active = true;
    this.setPose(0);
  }

  update(delta) {
    if (!this.active) return;
    this.elapsed = Math.min(this.elapsed + Math.min(delta, 0.1), DURATION);
    this.setPose(this.elapsed / DURATION);
    if (this.elapsed === DURATION) this.finish();
  }

  setPose(progress) {
    const ease = smootherstep(progress);
    const distance = START_DISTANCE * Math.pow(END_DISTANCE / START_DISTANCE, ease);
    const pitch = THREE.MathUtils.lerp(START_PITCH, END_PITCH, ease);
    const bearing = THREE.MathUtils.lerp(END_BEARING - Math.PI * 1.5, END_BEARING, ease);
    const horizontal = Math.cos(pitch);

    this.camera.position.set(
      Math.sin(bearing) * horizontal,
      Math.sin(pitch),
      Math.cos(bearing) * horizontal,
    ).multiplyScalar(distance).add(this.target);
    this.camera.lookAt(this.target);

    this.camera.near = Math.max(0.5, distance * 0.001);
    this.camera.far = Math.max(60_000, distance * 5);
    this.camera.updateProjectionMatrix();

    // Keep distant tiles visible aloft, then restore a gentle city haze.
    this.fog.near = Math.max(7_000, distance * 0.8);
    this.fog.far = Math.max(38_000, distance * 6);
  }

  finish() {
    this.active = false;
    this.camera.near = 0.5;
    this.camera.far = 60_000;
    this.camera.updateProjectionMatrix();
    this.fog.near = 7_000;
    this.fog.far = 38_000;
    this.controls.target.copy(this.target);
    this.controls.enabled = true;
    this.controls.update();
    this.onComplete();
  }
}
