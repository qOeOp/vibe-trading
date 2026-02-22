# Vibe Editor — Marimo-based Notebook Server

## Overview

Python microservice wrapping marimo 0.20.1 as a programmatic server. Provides notebook editing, cell execution, and file management for VT Lab.

**Entry point**: `main.py` → calls marimo's `start()` with uvicorn
**Startup**: `nx run vibe-editor:serve` (port 2728)
**Consumer**: `apps/web` (React frontend on port 4200)

## Architecture

```
apps/vibe-editor/
├── main.py              # Uvicorn entry point (replaces marimo CLI)
├── vt_sessions/         # VT session layer (our code, outside marimo/)
│   ├── manager.py       # VTSessionManager — userId→workspace mapping
│   ├── models.py        # VTSession, SessionStatus
│   ├── workspace.py     # Workspace bootstrap + welcome notebook
│   └── routes.py        # REST API endpoints (/api/sessions/*)
├── marimo/              # Vendored marimo 0.20.1 (720 py files)
│   ├── _server/         # Starlette app, SessionManager, API endpoints
│   ├── _session/        # Session/kernel lifecycle
│   └── ...              # Full marimo package (internal name stays 'marimo')
├── project.json         # Nx task config
└── pyproject.toml       # Python dependencies
```

**Layer separation**: `vt_sessions/` is our code. `marimo/` is vendored upstream. Don't modify marimo internals unless forced by integration issues.

## API Endpoints

### VT Session Management (`/api/sessions/`)

| Method | Path                               | Body                   | Response                                               |
| ------ | ---------------------------------- | ---------------------- | ------------------------------------------------------ |
| POST   | `/api/sessions/connect`            | `{ "userId": "root" }` | `{ userId, workspacePath, notebookPath, status, ... }` |
| POST   | `/api/sessions/disconnect`         | `{ "userId": "root" }` | `{ "success": true }` or 404                           |
| GET    | `/api/sessions/status?userId=root` | —                      | Session metadata or 404                                |
| POST   | `/api/sessions/heartbeat`          | `{ "userId": "root" }` | `{ "success": true }` or 404                           |

### Marimo Passthrough (unchanged)

| Prefix                             | Purpose                                      |
| ---------------------------------- | -------------------------------------------- |
| `/api/kernel/*`                    | Cell execution, editing, config, files       |
| `/api/files/*`                     | File explorer (list, create, update, delete) |
| `/ws`                              | WebSocket for real-time cell updates         |
| `/health`                          | Health check (HEAD or GET)                   |
| `/api/home/*`                      | Notebook listing                             |
| `/api/datasources/*`, `/api/sql/*` | Data connections                             |

## Interaction Contract with `apps/web`

### Connection Flow

1. Frontend polls `POST /api/sessions/connect { userId: "root" }` every 2s
2. On success → receives `{ workspacePath, notebookPath }`
3. Frontend calls `takeoverSession(notebookPath)` then connects WebSocket
4. While connected: heartbeat `POST /api/sessions/heartbeat` every 30s
5. On disconnect: `POST /api/sessions/disconnect` (fire-and-forget)

### Session Identity

- **Current**: Fixed `userId: "root"` — single user, no auth
- **Future**: Real userId from auth system. All interfaces accept `userId: string`
- localStorage key `vt-lab-session` stores `{ userId, workspacePath, notebookPath }`

### Workspace

- **Base path**: `~/.vt-lab/` (configurable via `VIBE_EDITOR_WORKSPACE` env var — not yet implemented)
- **Welcome notebook**: `welcome.py` created automatically if missing
- **Persistence**: Files survive server restarts (filesystem-based)

## Configuration

| Env Variable                | Default                 | Description                    |
| --------------------------- | ----------------------- | ------------------------------ |
| `VIBE_EDITOR_PORT`          | `2728`                  | HTTP server port               |
| `VIBE_EDITOR_HOST`          | `127.0.0.1`             | Bind address                   |
| `VIBE_EDITOR_ALLOW_ORIGINS` | `http://localhost:4200` | CORS origins (comma-separated) |

## Dependencies

Core: `starlette`, `uvicorn`, `websockets`, `jedi`, `loro`, `psutil`, `msgspec`
See `pyproject.toml` for full list.

## Development

```bash
# Start server
nx run vibe-editor:serve

# Or directly
cd apps/vibe-editor && python main.py

# Health check
curl http://localhost:2728/health

# Test session flow
curl -X POST http://localhost:2728/api/sessions/connect \
  -H "Content-Type: application/json" \
  -d '{"userId": "root"}'
```

## Migration Notes

- Marimo package name stays `marimo` internally (1000+ import references)
- `_smoke_tests/` and `_pyodide/` removed; everything else kept
- `_frontend/` assets not present → `[E] Static files not found, skipping mount` is expected
- marimo's `<base href>` injection is fixed by MutationObserver in `lab-page.tsx`
