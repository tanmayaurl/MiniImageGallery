# Mini Image Gallery

Simple full-stack app:
- Upload one image (JPEG/PNG) ≤ 3 MB
- Show upload progress
- Immediately display uploaded images in a grid
- Delete images
- Backend stores images in memory (non-persistent)

## Tech stack
- Backend: Node.js, Express, multer
- Frontend: React (Create React App)

---

## Backend: how to run

1. Open a terminal and go to `backend/`
2. Install:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
   The API will listen on `http://localhost:4000`.

### API Endpoints
- `POST /upload` — upload one file (field name: `image`). Validates type (JPEG/PNG) and size (≤3MB). Returns `{ id }`.
- `GET /images` — list images metadata: `[ { id, filename, mimeType } ]`.
- `GET /images/:id/data` — returns binary data for image with proper `Content-Type`.
- `DELETE /images/:id` — deletes image by id.

### Notes
- Storage is in-memory only for this assignment. Restarting the server clears images.
- CORS is enabled for local development.

### Tests (bonus)
From `backend/` run:
```bash
npm test
```
Includes unit tests for upload, listing, and deletion.

---

## Frontend: how to run

1. Open a new terminal and go to `frontend/`
2. Install:
   ```bash
   npm install
   ```
3. Start the app:
   ```bash
   npm start
   ```
   The app will open at `http://localhost:3000`.

### Configuration
- By default, the frontend points to `http://localhost:4000`.
- To change API base, set `REACT_APP_API_BASE`:
  ```bash
  set REACT_APP_API_BASE=http://localhost:4000
  npm start
  ```

### Features
- Upload exactly one image at a time (JPEG/PNG ≤3MB).
- Progress bar shows upload progress.
- Gallery grid displays uploaded images immediately.
- Delete any image directly from the grid.
- Responsive grid with `auto-fill` for varying screen sizes (bonus).

---

## Design Choices
- Backend uses `multer` and Express to validate and accept a single image upload.
- Images are kept in an in-memory array with `{ id, filename, mimeType, data }`.
- Frontend uses `XMLHttpRequest` to expose upload progress easily.
- Image binary served by `GET /images/:id/data` keeps metadata listings light and avoids Base64 bloat.

## Repository
This folder contains both `backend/` and `frontend/`. Push to GitHub and share the link.