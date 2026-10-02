# Mysta footer 3D location

The footer opens a real, interactive San Francisco 3D scene automatically as visitors approach it. The default scene uses public textured San Francisco building meshes and satellite imagery, so visitors enter nothing and a static checkout works without a build. The footer starts loading its iframe shortly before it enters the viewport.

When a site owner supplies a Cesium ion token and builds the optional Vite app, the iframe instead uses the original Three.js + Google Photorealistic 3D Tiles renderer. The public scene uses the ArcGIS SceneView renderer and I3S data; it is real 3D city geometry, but it is not Google's full photogrammetric mesh. The source and imagery services require an internet connection.

## Setup

1. Sign in at [Cesium ion](https://ion.cesium.com/) and create an access token. Enable access to the **Google Photorealistic 3D Tiles** asset, ID **2275207**, for that token. Your Cesium ion account may need to accept Google's asset terms before it can stream the tiles.
2. Copy `.env.example` to `.env.local` in this directory and set `VITE_ION_TOKEN=your-token`. This is a one-time site-owner setup, not a visitor step.
3. Run these commands from `layout/footer-map`:

   ```sh
   npm install
   npm run build
   ```

4. Serve the repository over HTTP and open `Ahmad/Homepage/index.html`. For example, from the repository root run `python3 -m http.server 8000` and visit `http://localhost:8000/Ahmad/Homepage/`.

The footer loads `layout/footer-map/dist/index.html` when present and otherwise opens `layout/footer-map/public-map.html` directly. Deploy the generated `dist/` directory if you want the optional Google renderer. The directory is gitignored so local credentials cannot accidentally enter the repository through a generated bundle. A deployment without `dist/` still opens the public 3D scene.

**Browser credential note:** Vite embeds `VITE_ION_TOKEN` in the built JavaScript. It is visible to visitors. Use a Cesium ion token intended for browser use, restrict it to your site origins and the Google Photorealistic 3D Tiles asset, and set appropriate usage limits. Never use a private master token. `.env.local` itself stays untracked.

Without a token, the built app also opens the public scene. A rejected token shows an asset-access error. Delete or omit `dist/` to use the public scene if Google access is unavailable.

The destination constants are in `src/config.js`. The coordinate is an approximate downtown San Francisco location, not a verified Mysta address. Update the latitude, longitude, WGS84 ellipsoid height, and marker height together when an address is known. The static pre-load text and iframe title in `layout/footer.html` should be updated at the same time.

Google Maps and Cesium ion credit links stay visible inside the map. Per-tile credits returned by `3d-tiles-renderer` are displayed beside them; do not remove this attribution strip.
