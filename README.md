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
- `npm run install:all`

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

## Quick Verify

### Backend contract

- `curl -i http://localhost:3001/api/product`

Expected:

- `200 OK`
- JSON fields match the contract exactly:
  - `id, title, description, price, imageURL, sizeOptions[{id,label}]`

### Frontend proxy

- Open `http://localhost:5173`
- In browser DevTools → Network, confirm request to `/api/product` returns **200** when backend is running.

### Edge case: backend down (Error + Retry UI)

This project intentionally handles the “backend unavailable” scenario in the UI.

How to verify:

1. Start **frontend** (`cd frontend && npm run dev`) and load `http://localhost:5173`
2. Stop **backend** (Ctrl+C in the backend terminal)
3. Refresh the page

Expected:

- The page shows an error state (e.g. “Something went wrong” / “Failed to load product...”)
- A **Retry** button is visible
- After restarting backend, clicking **Retry** returns to the normal product page

Note:

- In dev mode, Vite proxy may log `ECONNREFUSED` in the terminal when backend is down. This is expected.

### Edge case: dirty data variants (Product normalization)

The backend supports a simple test switch via query params to simulate “dirty data” and validate frontend resilience.
Default response (no query) remains unchanged and matches the required JSON contract.

How to verify:

1. Start **backend** (`cd backend && npm run dev`)
2. Start **frontend** (`cd frontend && npm run dev`) and load `http://localhost:5173`
3. Open one of the following URLs (or use the curl commands below)

Frontend URLs:

- `http://localhost:5173/?variant=dirtyPrice`
- `http://localhost:5173/?variant=noSizes`
- `http://localhost:5173/?variant=longLabel`
- `http://localhost:5173/?variant=missingLabelAndLong`

Expected:

- `dirtyPrice`: price becomes non-numeric → UI displays `N/A`
- `noSizes`: `sizeOptions` is empty → UI shows “No sizes available” and disables **Add to Cart**
- `longLabel`: `label` missing but `long` present → UI uses `long` as the size label
- `missingLabelAndLong`: both `label` and `long` missing → UI falls back to `String(id)` for the size label

Backend curl (direct):

- `curl -s "http://localhost:3001/api/product?variant=dirtyPrice"`
- `curl -s "http://localhost:3001/api/product?variant=noSizes"`
- `curl -s "http://localhost:3001/api/product?variant=longLabel"`
- `curl -s "http://localhost:3001/api/product?variant=missingLabelAndLong"`

Note:

- These variants exist only to help verify edge-case handling. The default `/api/product` response remains strict and unchanged.

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
