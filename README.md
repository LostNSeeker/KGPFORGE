# Launchpad Platform

Full-stack app with:
- `frontend`: React + TypeScript + Vite
- `backend`: Flask + SQLite (default) with JWT auth

## Project Structure

- `frontend/` - UI application
- `backend/` - API server and database logic

## Prerequisites

- Node.js 18+ and npm
- Python 3.10+ and pip
- Git (optional)

## 1) Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

Create environment file:

```bash
cp .env.example .env
```

Set at least:

```env
JWT_SECRET_KEY=replace-with-a-long-random-secret
PORT=5001
FLASK_ENV=development
```

Run backend:

```bash
python app.py
```

Backend URLs:
- Health: `http://localhost:5001/`
- API health: `http://localhost:5001/api/health`

## 2) Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Default frontend URL:
- `http://localhost:5173`

## 3) Run Both Services (Daily Workflow)

Terminal 1:

```bash
cd backend
source venv/bin/activate
python app.py
```

Terminal 2:

```bash
cd frontend
npm run dev
```

## 4) Build for Production

Frontend:

```bash
cd frontend
npm run build
```

Backend (recommended):
- Run with `gunicorn` instead of Flask dev server.
- Put behind Nginx/Apache reverse proxy.

Example:

```bash
cd backend
source venv/bin/activate
gunicorn -w 2 -b 0.0.0.0:5001 app:app
```

## 5) On-Prem Security Checklist (Important)

Before production deployment:

- Set a strong `JWT_SECRET_KEY` (do not use defaults).
- Ensure Flask debug mode is OFF in production.
- Restrict CORS to trusted frontend origins (avoid `*`).
- Disable sensitive request/body logging.
- Protect uploaded-file endpoints with auth checks.
- Keep dependency versions updated and patched.

## 6) Useful Commands

Backend:

```bash
cd backend
source venv/bin/activate
python app.py
```

Frontend:

```bash
cd frontend
npm run dev
npm run build
npm run lint
```

## 7) Troubleshooting

- Port already in use:
  - Change backend `PORT` in `.env`
  - Or stop existing process using that port
- Module install failures:
  - Recreate backend virtual env and reinstall requirements
  - Delete `frontend/node_modules` and run `npm install` again
- CORS errors:
  - Verify backend is running and frontend points to correct API base URL
  - Confirm backend CORS settings include your frontend origin

## Notes

- Backend currently defaults to SQLite (`backend/launchpad.db`).
- Uploaded files are stored in `backend/uploads/`.
- Existing backend deployment notes are in `backend/DEPLOYMENT_GUIDE.md`.
