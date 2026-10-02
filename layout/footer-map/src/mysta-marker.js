import * as THREE from 'three';
import { MYSTA_MARKER_HEIGHT } from './config.js';

function createWordmark() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 512, 160);
  ctx.font = '800 92px Manrope, Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(124, 213, 199, .6)';
  ctx.shadowBlur = 26;
  ctx.fillStyle = '#eafff9';
  ctx.fillText('MYSTA', 256, 84);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createMystaMarker(scene) {
  const group = new THREE.Group();
  group.visible = false;
  group.scale.setScalar(0.01);

  const ringMaterial = new THREE.MeshBasicMaterial({ color: 0x7cd5c7, transparent: true, opacity: 0, depthWrite: false });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(30, 1.6, 8, 64), ringMaterial);
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 8;
  group.add(ring);

  const coreMaterial = new THREE.MeshBasicMaterial({ color: 0xb8fff1, transparent: true, opacity: 0, depthWrite: false });
  const core = new THREE.Mesh(new THREE.SphereGeometry(7, 20, 14), coreMaterial);
  core.position.y = 12;
  group.add(core);

  const stemMaterial = new THREE.MeshBasicMaterial({ color: 0x7cd5c7, transparent: true, opacity: 0, depthWrite: false });
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, MYSTA_MARKER_HEIGHT - 18, 8), stemMaterial);
  stem.position.y = MYSTA_MARKER_HEIGHT / 2;
  group.add(stem);

  const labelMaterial = new THREE.MeshBasicMaterial({ map: createWordmark(), transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide });
  const label = new THREE.Mesh(new THREE.PlaneGeometry(145, 46), labelMaterial);
  label.position.y = MYSTA_MARKER_HEIGHT + 18;
  group.add(label);
  scene.add(group);

  let revealTime = -1;
  return {
    reveal() { group.visible = true; revealTime = 0; },
    update(delta, elapsed, camera) {
      if (revealTime < 0) return;
      revealTime = Math.min(1.4, revealTime + delta);
      const arrival = THREE.MathUtils.smoothstep(revealTime / 1.2, 0, 1);
      group.scale.setScalar(Math.max(0.01, arrival));
      ringMaterial.opacity = arrival * (0.5 + 0.12 * Math.sin(elapsed * 2.5));
      coreMaterial.opacity = arrival * 0.92;
      stemMaterial.opacity = arrival * 0.46;
      labelMaterial.opacity = arrival;
      ring.scale.setScalar(1 + 0.08 * Math.sin(elapsed * 2.5));
      label.quaternion.copy(camera.quaternion);
    },
    dispose() {
      group.traverse((object) => {
        object.geometry?.dispose();
        object.material?.map?.dispose();
        object.material?.dispose();
      });
    },
  };
}
