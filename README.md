# Full-stack Mini Ecommerce (Interview Case Study)

## Requirements
- Node.js >= 20.19 or Node.js >= 22.12+
  - Older Node versions may break Vite due to `crypto.getRandomValues`.

## Repo Structure
- backend/ — Express + JavaScript (port 3001)
- frontend/ — Vite + React + TypeScript (port 5173)

## Run (Dev)

1) Start Backend
- In terminal A:
cd backend
npm install
npm run dev

Backend URLs:
- http://localhost:3001/health
- http://localhost:3001/api/product

2) Start Frontend
- In terminal B:
cd frontend
npm install
npm run dev

Frontend URL:
- http://localhost:5173

## Dev Notes
- Frontend uses fetch('/api/...')
- Vite dev server proxies /api to http://localhost:3001 to avoid CORS
