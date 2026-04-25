# ERSH - Portail

Small Vite + React portal that links to ERSH apps.

## Setup

1. Copy `.env.example` to `.env.local` and fill in the Firebase values.
2. Configure API access:
   - In development, keep `VITE_API_BASE_URL=/api` and set `VITE_API_TARGET` to the API origin, for example `http://192.168.1.25:8000`.
   - For a deployed frontend without Vite proxy, set `VITE_API_BASE_URL` directly to the API base URL, for example `http://192.168.1.25:8000/api`.
   - For FilConducteur, keep `VITE_FIL_CONDUCTEUR_API_URL=/fc`. In development, `VITE_FIL_CONDUCTEUR_API_TARGET` points the Vite proxy to the backend, for example `http://localhost:5100`. In production, Apache proxies `/fc` to `127.0.0.1:5100`.
3. Install dependencies: `npm install`.
4. Run the app: `npm run dev`.

## Build

`npm run build`
