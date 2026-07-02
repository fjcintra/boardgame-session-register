# Project Context - DiceLog Board Game Tracker

This document provides a comprehensive overview of the current status, used technology stack, architecture, progress, and upcoming tasks for the **DiceLog Board Game Tracker** project.

---

## 📅 Project Status at a Glance
- **Current Phase**: Containerization & Deployment Completed
- **Overall Progress**: 
  - **Backend**: 100% (Core API fully implemented, tested, and verified)
  - **Frontend**: 100% (Styled using Tailwind CSS v4, including unified Dark Mode toggle)
  - **Dockerization & Deployment**: 100% (Backend and Frontend Dockerized, routed via Nginx on docker-compose)
  - **Integration**: 100% (React frontend consumes FastAPI endpoints dynamically with JWT auth)
- **Tests**: 12/12 pytest tests passing successfully (`tests/` directory)

---

## 🛠️ Technology Stack

| Layer | Technology | Version / Configuration | Notes |
| :--- | :--- | :--- | :--- |
| **Backend** | Python / FastAPI | Python 3.12, FastAPI | Uvicorn development server |
| **Frontend** | React.js / TypeScript / Vite | React 19.x, Vite 8.x | Modular components structure |
| **Database** | SQL / SQLite (Dev) / PostgreSQL (Prod) | SQLAlchemy (asyncio) + aiosqlite | Development db: `backend/boardgame_tracker.db` |
| **Styling** | Tailwind CSS v4 | Outfit Font (default sans-serif) | Unified Light/Dark mode toggles |
| **Authentication**| JWT Token / OAuth2 | `python-jose`, `passlib` (bcrypt) | Bearer token authorization |
| **Testing** | pytest | pytest-asyncio, anyio | Run with `PYTHONPATH=. .venv/bin/pytest` |

---

## 🗺️ Codebase Map & Directory Structure

```text
boardgame-session-register-system/
├── BoardGame_Tracker_Blueprint.pdf (Project guidelines & specs)
├── README.md                       (Project overview, installation & execution guide)
├── CONTEXT.md                      (This status & progress tracking file)
├── docker-compose.yml              (Multi-container orchestration setup)
├── verify_deployment.sh            (Automated test & verification shell script)
├── .gitignore                      (Ignore patterns for DB, credentials, logs, and venvs)
├── .agents/                        (Antigravity workspace customizations)
│   └── skills/
│       └── devops_automator/
│           └── SKILL.md            (Custom DevOps specialist agent instruction guide)
├── backend/                        (FastAPI codebase)
│   ├── Dockerfile                  (Python non-root backend image recipe)
│   ├── app/
│   │   ├── api/                    (API endpoints & routing)
│   │   ├── core/                   (Security, hashing, JWT logic)
│   │   ├── models/                 (SQLAlchemy models)
│   │   ├── schemas/                (Pydantic schemas)
│   │   ├── config.py               (Settings & Env loader)
│   │   ├── database.py             (Engine/Session setup)
│   │   └── main.py                 (App startup & Lifespan router initialization)
│   ├── tests/                      (Backend tests suite)
│   └── requirements.txt            (Backend dependencies)
└── frontend/                       (React codebase)
    ├── Dockerfile                  (Multi-stage build served by Nginx)
    ├── nginx.conf                  (Nginx SPA routes fallback & API proxy configs)
    ├── src/
    │   ├── components/             (UI Views styled with Tailwind CSS)
    │   │   ├── Auth/               (Login / Register UI modal)
    │   │   ├── LandingPage/        (Initial screen)
    │   │   ├── MyGames/            (Board game collection view)
    │   │   ├── MyMatches/          (Logged match sessions)
    │   │   ├── Profile/            (User profile page)
    │   │   └── Configuracoes/      (Settings page)
    │   ├── utils/                  (API fetch client wrapper)
    │   ├── App.tsx                 (Main application state, theme, & navigation router)
    │   ├── index.css               (Tailwind v4 imports & theme font setup)
    │   └── main.tsx                (React entrypoint)
```

### Key Files and Models
- **Database & Config**:
  - Configuration: [config.py](file:///home/fabio/Projetos/boardgame-session-register-system/backend/app/config.py)
  - Async Database Setup: [database.py](file:///home/fabio/Projetos/boardgame-session-register-system/backend/app/database.py)
- **Data Models**:
  - User: [user.py](file:///home/fabio/Projetos/boardgame-session-register-system/backend/app/models/user.py) (Class `User` mapping name, email, credentials, profile, address details)
  - BoardGame: [game.py](file:///home/fabio/Projetos/boardgame-session-register-system/backend/app/models/game.py) (Class `BoardGame` mapping title, players constraints)
  - MatchRecord: [match.py](file:///home/fabio/Projetos/boardgame-session-register-system/backend/app/models/match.py) (Class `MatchRecord` mapping duration, players count, winner, notes)
- **API Endpoints**:
  - Routing Entry: [__init__.py](file:///home/fabio/Projetos/boardgame-session-register-system/backend/app/api/__init__.py)
  - Authentication `/auth`: [auth.py](file:///home/fabio/Projetos/boardgame-session-register-system/backend/app/api/auth.py)
  - Users Profile `/users`: [users.py](file:///home/fabio/Projetos/boardgame-session-register-system/backend/app/api/users.py)
  - Games Library `/games`: [games.py](file:///home/fabio/Projetos/boardgame-session-register-system/backend/app/api/games.py)
  - Matches Records `/matches`: [matches.py](file:///home/fabio/Projetos/boardgame-session-register-system/backend/app/api/matches.py)

---

## 🏆 Feature Progress & Map

| Feature Area | Backend API Status | Frontend UI Status | Integration Status |
| :--- | :--- | :--- | :--- |
| **Authentication** | [x] Register endpoint `/auth/register`<br>[x] Login OAuth2 endpoint `/auth/login` | [x] [AuthModal.tsx](file:///home/fabio/Projetos/boardgame-session-register-system/frontend/src/components/Auth/AuthModal.tsx) handles registration and login. | [x] Full integration via dynamic login token, token storage, and session checks on reload. |
| **User Profile** | [x] Get `/users/me`<br>[x] Update `/users/me` | [x] [Profile.tsx](file:///home/fabio/Projetos/boardgame-session-register-system/frontend/src/components/Profile/Profile.tsx) renders user profile fields dynamically and provides edit button. | [x] Complete integration of "Editar Perfil" form calling backend profile PUT updates. |
| **Board Games Collection** | [x] List `/games`<br>[x] Create `/games`<br>[x] Read/Update/Delete `/games/{id}` | [x] [MyGames.tsx](file:///home/fabio/Projetos/boardgame-session-register-system/frontend/src/components/MyGames/MyGames.tsx) collection grid with sorting features, "+ Novo Jogo" modal, and delete button. | [x] Complete integration. Addition and deletion sync with backend; match logging updates times played dynamically. |
| **Match History** | [x] List `/matches`<br>[x] Create `/matches`<br>[x] Read/Delete `/matches/{id}` | [x] [MyMatches.tsx](file:///home/fabio/Projetos/boardgame-session-register-system/frontend/src/components/MyMatches/MyMatches.tsx) list, sorting/filtering by games dynamically loaded, "+ Nova Partida" modal, and deletion. | [x] Complete integration. |
| **Configuration** | [x] Handled via backend `/users/me` PUT updates | [x] [Configuracoes.tsx](file:///home/fabio/Projetos/boardgame-session-register-system/frontend/src/components/Configuracoes/Configuracoes.tsx) renders password change form. | [x] Completed integration. |
| **Dark Mode** | *N/A (Frontend toggle)* | [x] Sidebar controls in [App.tsx](file:///home/fabio/Projetos/boardgame-session-register-system/frontend/src/App.tsx) toggles styling and persists state in localStorage. | [x] Complete class binding on document root. |
| **Containerization & Deployment** | [x] Automatically configures PostgreSQL, executes schema creations on startup. | [x] Configured multi-stage build served by Nginx proxy routing. | [x] Complete local orchestration verified via automated test script. |

---

## 🚀 Next Steps & Roadmap

1. **Continuous Integration (CI) Pipelines**:
   - Write GitHub Actions workflow to run the Pytest backend tests on PR triggers.
   - Automate `verify_deployment.sh` validation checks inside standard CI.

2. **Monitoring & Logs aggregation**:
   - Wire Prometheus metrics or centralized log handlers inside the containers.
