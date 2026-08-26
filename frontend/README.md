# Agent Studio Frontend

Vue 3 + TypeScript + Vite frontend for local Agent Studio development.

## Requirements

- Node.js 22.12.0+
- npm

## Setup

```powershell
npm install
Copy-Item .env.example .env
```

`VITE_API_BASE_URL` defaults to `http://localhost:8000`. Do not put real API keys in frontend environment files.

## Run

```powershell
npm run dev
```

The development server listens on `http://localhost:5173`.

## Checks

```powershell
npm run build
npm run lint
npm run test
```

## Routes

- `/system/status` — system health and dependency status
- `/chat` — chat page skeleton with no backend submission
- `/models` — model configuration skeleton with local mock data

The Phase 0 chat and model pages intentionally do not call model APIs or persist API keys.
