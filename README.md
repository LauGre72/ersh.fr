# ERSH - Portail

Small Vite + React portal that links to ERSH apps.

## Setup

1. Copy `.env.example` to `.env.local` and fill in the Firebase values.
2. Configure API access:
   - In development, keep `VITE_API_BASE_URL=/api` and set `VITE_API_TARGET` to the API origin, for example `http://192.168.1.25:8000`.
   - For a deployed frontend without Vite proxy, set `VITE_API_BASE_URL` directly to the API base URL, for example `http://192.168.1.25:8000/api`.
   - For FilConducteur, set `VITE_FIL_CONDUCTEUR_API_URL` to the backend base URL. The OpenAPI file declares `https://www.ersh.fr/fc` in production and `http://localhost:5100` locally.
3. Install dependencies: `npm install`.
4. Run the app: `npm run dev`.

## Build

`npm run build`
