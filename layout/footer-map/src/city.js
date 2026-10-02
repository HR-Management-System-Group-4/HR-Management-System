import * as THREE from 'three';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { TilesRenderer } from '3d-tiles-renderer';
import {
  CesiumIonAuthPlugin,
  GLTFExtensionsPlugin,
  ReorientationPlugin,
  TileCompressionPlugin,
} from '3d-tiles-renderer/plugins';
import {
  GOOGLE_3D_TILES_ION_ASSET_ID,
  MYSTA_ELLIPSOID_HEIGHT,
  MYSTA_LAT,
  MYSTA_LON,
} from './config.js';

// The geographic tile pipeline follows akella/threejs.paris; local units stay in metres.
export function createCity({ camera, renderer, scene, ionToken, onError, onModel }) {
  const tiles = new TilesRenderer();
  tiles.registerPlugin(new CesiumIonAuthPlugin({
    apiToken: ionToken,
    assetId: GOOGLE_3D_TILES_ION_ASSET_ID,
    autoRefreshToken: true,
  }));

  const dracoLoader = new DRACOLoader().setDecoderPath(`${import.meta.env.BASE_URL}draco/`);
  tiles.registerPlugin(new GLTFExtensionsPlugin({ dracoLoader }));
  tiles.registerPlugin(new TileCompressionPlugin());
  tiles.registerPlugin(new ReorientationPlugin({
    lat: THREE.MathUtils.degToRad(MYSTA_LAT),
    lon: THREE.MathUtils.degToRad(MYSTA_LON),
    height: MYSTA_ELLIPSOID_HEIGHT,
  }));

  tiles.errorTarget = 14;
  tiles.setCamera(camera);
  tiles.setResolutionFromRenderer(camera, renderer);
  tiles.addEventListener('load-error', onError);
  tiles.addEventListener('load-model', onModel);
  scene.add(tiles.group);

  return {
    tiles,
    resize() { tiles.setResolutionFromRenderer(camera, renderer); },
    update() { tiles.update(); },
    dispose() { tiles.dispose(); dracoLoader.dispose(); },
  };
}
