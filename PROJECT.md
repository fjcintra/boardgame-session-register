# Project: DiceLog Board Game Tracker Dockerization

## Architecture
- React Frontend (Vite/TS/Tailwind v4) served via Nginx.
- FastAPI Backend (Python 3.12, Uvicorn, SQLAlchemy).
- PostgreSQL Database.
- Nginx reverse proxy serving frontend on port 80 and proxying `/api` requests to backend container.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Exploration & Design | Audit current code, design configuration & ports, Nginx proxy setup | none | DONE |
| 2 | Dockerization Implementation | Write Dockerfiles, docker-compose.yml, Nginx config, verify_deployment.sh | M1 | DONE |
| 3 | Verification & Review | Run validation, Challenger tests, Reviewer and Auditor checks | M2 | DONE |

## Interface Contracts
### Frontend ↔ Backend (API)
- Base URL: `/api` (proxied by Nginx to `http://backend:8000/api`)
- Content Type: application/json (for JSON endpoints)
- Authentication: Bearer token in the `Authorization` header

### Backend ↔ PostgreSQL
- URL: `postgresql+asyncpg://<user>:<password>@<host>/<database>`
- Auto table creation on startup.
