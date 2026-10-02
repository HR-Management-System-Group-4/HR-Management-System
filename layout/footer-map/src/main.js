import { MYSTA_LOCATION_NAME } from './config.js';

const stage = document.querySelector('#map-stage');
const status = document.querySelector('#map-status');
const detail = document.querySelector('#status-detail');
const creditsElement = document.querySelector('#tile-credits');
const card = document.querySelector('#destination-card');
const hint = document.querySelector('#explore-hint');
const ionToken = import.meta.env.VITE_ION_TOKEN?.trim();
document.querySelectorAll('[data-location-name]').forEach((element) => {
  element.textContent = MYSTA_LOCATION_NAME;
});

let visible = window.parent === window;
let failed = false;
let started = false;
let hasModel = false;
let animationFrame = 0;
let lastFrame = 0;
let totalTime = 0;

function notifyParent() {
  if (window.parent !== window) {
    window.parent.postMessage({ type: 'mysta-map:ready' }, window.location.origin);
  }
}

function showError(message, error) {
  failed = true;
  status.classList.add('is-error');
  status.classList.remove('is-hidden');
  detail.textContent = message;
  if (error) console.error('Mysta 3D location:', error);
}

if (!ionToken) {
  import('./public-scene.js').then(({ startPublicScene }) => startPublicScene({
    stage, status, detail, creditsElement, card, hint, notifyParent, showError,
  })).catch((error) => {
    showError('The 3D city could not start. Please try again.', error);
    notifyParent();
  });
} else {
  boot().catch((error) => {
    showError('The 3D location preview could not start.', error);
    notifyParent();
  });
}

async function boot() {
  const [THREE, { OrbitControls }, { CinematicCamera }, { createMystaMarker }, { createCity }] = await Promise.all([
    import('three'),
    import('three/addons/controls/OrbitControls.js'),
    import('./cinematic-camera.js'),
    import('./mysta-marker.js'),
    import('./city.js'),
  ]);
  const canvas = document.createElement('canvas');
  if (!canvas.getContext('webgl2')) {
    showError('This browser needs WebGL 2 to display the 3D location.');
    notifyParent();
    return;
  }

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#a5b9bb');
  scene.fog = new THREE.Fog('#a5b9bb', 7_000, 38_000);
  const camera = new THREE.PerspectiveCamera(58, 1, 1, 900_000);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  stage.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enabled = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.07;
  controls.enablePan = false;
  controls.minDistance = 180;
  controls.maxDistance = 3_000;
  controls.minPolarAngle = THREE.MathUtils.degToRad(12);
  controls.maxPolarAngle = THREE.MathUtils.degToRad(86);
  controls.zoomSpeed = 0.6;
  // Permit normal one-finger page scrolling above the embedded canvas.
  renderer.domElement.style.touchAction = 'pan-y';

  const target = new THREE.Vector3(0, 65, 0);
  const marker = createMystaMarker(scene);
  const flight = new CinematicCamera(camera, controls, scene.fog, target, () => {
    marker.reveal();
    card.hidden = false;
    hint.hidden = false;
    requestAnimationFrame(() => card.classList.add('is-visible'));
  });

  const city = createCity({
    camera,
    renderer,
    scene,
    ionToken,
    onError: (event) => {
      if (event.tile === null && !hasModel) {
        showError('3D tiles could not load. The site owner should check the Cesium token and asset access.');
        console.error('Mysta 3D location: Cesium tile access failed.');
      } else {
        console.warn('Mysta 3D location: a tile could not load.', event.error || event);
      }
    },
    onModel: () => { hasModel = true; },
  });

  function resize() {
    const width = stage.clientWidth;
    const height = stage.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    city.resize();
  }
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(stage);
  resize();

  function updateAttribution() {
    // 3d-tiles-renderer gathers credits from the tiles currently in view.
    const attributions = city.tiles.getAttributions([]);
    const text = [...new Set(attributions
      .filter((entry) => entry.type === 'string' && typeof entry.value === 'string')
      .map((entry) => entry.value.trim())
      .filter(Boolean))].sort().join(' · ');
    if (creditsElement.textContent !== text) creditsElement.textContent = text;
  }

  function tick(time) {
    animationFrame = 0;
    if (!visible || failed || document.visibilityState === 'hidden') return;
    const delta = Math.min((time - (lastFrame || time)) / 1_000, 0.1);
    lastFrame = time;
    totalTime += delta;
    if (!hasModel && totalTime > 25) {
      showError('The 3D city is taking too long to load. Please try again later.');
      return;
    }

    if (hasModel && !started) {
      started = true;
      detail.textContent = `Flying toward ${MYSTA_LOCATION_NAME}`;
      flight.start(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
      status.classList.add('is-hidden');
    }

    flight.update(delta);
    controls.update();
    camera.updateMatrixWorld();
    city.update();
    marker.update(delta, totalTime, camera);
    renderer.render(scene, camera);
    updateAttribution();
    animationFrame = requestAnimationFrame(tick);
  }

  function setVisible(nextVisible) {
    visible = nextVisible;
    if (visible && !animationFrame && !failed) {
      lastFrame = 0;
      resize();
      animationFrame = requestAnimationFrame(tick);
    } else if (!visible && animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    }
  }

  window.addEventListener('message', (event) => {
    if (event.origin !== window.location.origin || event.source !== window.parent) return;
    if (event.data?.type === 'mysta-map:visibility') setVisible(Boolean(event.data.visible));
  });
  document.addEventListener('visibilitychange', () => setVisible(visible));
  window.addEventListener('pagehide', () => {
    cancelAnimationFrame(animationFrame);
    resizeObserver.disconnect();
    city.dispose();
    marker.dispose();
    controls.dispose();
    renderer.dispose();
  }, { once: true });

  notifyParent();
  setVisible(visible);
}
