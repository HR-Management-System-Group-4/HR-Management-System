import { MYSTA_LAT, MYSTA_LON, MYSTA_LOCATION_NAME } from './config.js';

// Public textured San Francisco building meshes (I3S), with public Esri imagery.
// This is the credential-free scene. The Cesium/Google Three.js scene is used
// when the site owner supplies VITE_ION_TOKEN at build time.
const BUILDINGS_URL = 'https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/SanFrancisco_Bldgs/SceneServer/layers/0';
const IMAGERY_URL = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer';
const SDK_URL = 'https://js.arcgis.com/4.34/';
const SDK_CSS_URL = 'https://js.arcgis.com/4.34/esri/themes/dark/main.css';
const FLIGHT_MS = 8_000;

function loadArcgis() {
  return new Promise((resolve, reject) => {
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = SDK_CSS_URL;
    document.head.appendChild(css);

    const script = document.createElement('script');
    script.src = SDK_URL;
    script.onerror = () => reject(new Error('ArcGIS 3D SDK could not load'));
    script.onload = () => {
      if (!window.require) return reject(new Error('ArcGIS 3D SDK did not initialize'));
      window.require([
        'esri/Map', 'esri/Basemap', 'esri/layers/TileLayer',
        'esri/layers/SceneLayer', 'esri/views/SceneView', 'esri/Graphic',
      ], (...modules) => resolve(modules), reject);
    };
    document.head.appendChild(script);
    setTimeout(() => reject(new Error('ArcGIS 3D SDK timed out')), 30_000);
  });
}

function smootherstep(t) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function cameraPose(progress) {
  const eased = smootherstep(progress);
  const altitude = 100_000 * Math.pow(850 / 100_000, eased);
  const radius = 28_000 * Math.pow(900 / 28_000, eased);
  const angle = (-210 + 420 * eased) * Math.PI / 180;
  const east = radius * Math.sin(angle);
  const north = radius * Math.cos(angle);
  const latitude = MYSTA_LAT + north / 111_195;
  const longitude = MYSTA_LON + east / (111_195 * Math.cos(MYSTA_LAT * Math.PI / 180));
  return {
    position: { latitude, longitude, z: altitude },
    heading: (Math.atan2(-east, -north) * 180 / Math.PI + 360) % 360,
    tilt: Math.atan2(radius, altitude) * 180 / Math.PI,
  };
}

export async function startPublicScene({ stage, status, detail, creditsElement, card, hint, notifyParent, showError }) {
  detail.textContent = 'Loading San Francisco 3D buildings';
  try {
    const [Map, Basemap, TileLayer, SceneLayer, SceneView, Graphic] = await loadArcgis();
    const buildings = new SceneLayer({ url: BUILDINGS_URL, title: 'San Francisco 3D Buildings' });
    const imagery = new TileLayer({ url: IMAGERY_URL, title: 'World Imagery' });
    const map = new Map({ basemap: new Basemap({ baseLayers: [imagery] }), ground: 'world-elevation', layers: [buildings] });
    const view = new SceneView({
      container: stage,
      map,
      viewingMode: 'global',
      camera: cameraPose(0),
      qualityProfile: 'medium',
      environment: { atmosphere: { quality: 'low' }, starsEnabled: false },
      ui: { components: ['attribution'] },
    });
    await Promise.all([view.when(), buildings.load()]);
    await view.whenLayerView(buildings);

    // Keep provider credit visible in the panel as well as the SDK attribution.
    creditsElement.textContent = 'San Francisco 3D Buildings · Esri';
    document.querySelectorAll('.attribution a').forEach((link) => link.remove());
    const source = document.createElement('a');
    source.href = BUILDINGS_URL;
    source.target = '_blank';
    source.rel = 'noopener noreferrer';
    source.textContent = 'Scene source';
    creditsElement.after(source);

    let introActive = true;
    for (const eventName of ['drag', 'mouse-wheel', 'double-click', 'key-down']) {
      view.on(eventName, (event) => { if (introActive) event.stopPropagation(); });
    }
    status.classList.add('is-hidden');
    notifyParent();

    const reveal = () => {
      introActive = false;
      view.graphics.add(new Graphic({
        geometry: { type: 'point', latitude: MYSTA_LAT, longitude: MYSTA_LON, z: 95 },
        symbol: {
          type: 'point-3d',
          symbolLayers: [{
            type: 'icon', resource: { primitive: 'circle' }, size: 18,
            material: { color: '#80d6c8' }, outline: { color: '#ffffff', size: 2 },
          }],
          verticalOffset: { screenLength: 18, maxWorldLength: 100, minWorldLength: 10 },
          callout: { type: 'line', color: '#80d6c8', size: 1 },
        },
        attributes: { name: 'MYSTA', location: MYSTA_LOCATION_NAME },
      }));
      card.hidden = false;
      hint.hidden = false;
      requestAnimationFrame(() => card.classList.add('is-visible'));
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      view.camera = cameraPose(1);
      reveal();
    } else {
      const startedAt = performance.now();
      const animate = (now) => {
        if (document.visibilityState === 'hidden') {
          requestAnimationFrame(animate);
          return;
        }
        const progress = Math.min((now - startedAt) / FLIGHT_MS, 1);
        view.camera = cameraPose(progress);
        if (progress < 1) requestAnimationFrame(animate);
        else reveal();
      };
      requestAnimationFrame(animate);
    }

    window.addEventListener('pagehide', () => view.destroy(), { once: true });
  } catch (error) {
    showError('The public San Francisco 3D scene could not load. Please try again.', error);
    notifyParent();
  }
}
