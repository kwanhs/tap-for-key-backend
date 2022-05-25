# Backend Server for Tap for Key

This is a node-js enabled server for handling API requests from frontend of Tap for Key project.

### Capabilities
- Serving static site (built from tap-for-key-frontend), to be placed in `public/` folder in the same folder as the root
- Expose RESTful API for reporting key statuses, key and user management, and key retrieval/return service
- Integrates with hardware board that reports statuses of cells and report if their doors are being opened

### Usage
- Daily operation: `node index`
- Disable checking for connection to board: `node index --disable-check` (useful for debugging / developing without a physical cell-controlling board connected)
- Open all cells for maintenance: `node index --open-all`
- (Re-)Config by copying `.env.example` to `.env` and `channel.js.example` to `channel.js` for configuration.
