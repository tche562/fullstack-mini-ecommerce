# Full-stack Mini Ecommerce (Interview Case Study)

## Requirements

- Node.js **>= 20.19** or **>= 22.12+**
  - Older Node versions may break Vite due to `crypto.getRandomValues`.

## Repo Structure

- `backend/` — Express + JavaScript (port **3001**)
- `frontend/` — Vite + React + TypeScript (port **5173**)

## Dev Workflow (CORS-free)

Frontend always calls:

- `fetch('/api/...')`

Vite dev server proxies:

- `/api` -> `http://localhost:3001`

So there is no CORS setup needed.

## Run (Dev)

### Option A — Start both (recommended)

From repo root:

1. Install root dev dependency (concurrently)

- `npm install`

2. Start both servers

- `npm run dev`

Expected:

- Backend: `http://localhost:3001`
- Frontend: `http://localhost:5173`

### Option B — Start separately

#### 1) Start Backend

In terminal A:

- `cd backend`
- `npm install`
- `npm run dev`

Backend endpoints:

- `http://localhost:3001/health`
- `http://localhost:3001/api/product`

#### 2) Start Frontend

In terminal B:

- `cd frontend`
- `npm install`
- `npm run dev`

Frontend:

- `http://localhost:5173`

## Tests (Vitest)

Only unit tests for `addToCart` are included (no UI/E2E tests).

Run tests from `frontend/`:

- `cd frontend`
- `npm run test`

Expected: all tests passing.

## Notes

- Product data is fetched from `GET /api/product` and must match the provided JSON contract exactly:
  - `id, title, description, price, imageURL, sizeOptions[{id,label}]`
- Cart logic aggregates by `sizeId` (same size appears once, quantity increments).
