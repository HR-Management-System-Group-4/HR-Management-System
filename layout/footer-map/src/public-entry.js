import { MYSTA_LOCATION_NAME } from './config.js';
import { startPublicScene } from './public-scene.js';

document.querySelectorAll('[data-location-name]').forEach((element) => {
  element.textContent = MYSTA_LOCATION_NAME;
});

const status = document.querySelector('#map-status');
startPublicScene({
  stage: document.querySelector('#map-stage'),
  status,
  detail: document.querySelector('#status-detail'),
  creditsElement: document.querySelector('#tile-credits'),
  card: document.querySelector('#destination-card'),
  hint: document.querySelector('#explore-hint'),
  notifyParent: () => window.parent.postMessage({ type: 'mysta-map:ready' }, window.location.origin),
  showError: (message, error) => {
    status.classList.remove('is-hidden');
    status.classList.add('is-error');
    document.querySelector('#status-detail').textContent = message;
    console.error('Mysta 3D location:', error);
  },
});
