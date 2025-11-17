# Docker Quickstart

## 1. Prepare Environment

- Duplicate `.env.example` to `.env` and fill in the required API keys (at minimum `GoogleGenAI`).
- Install Docker Desktop (or another Docker engine) with Compose support.

## 2. Build Images

```bash
docker compose build
```

## 3. Start the Stack

```bash
docker compose up backend frontend
```

On first start the backend logs will report the Claude CLI authentication status. If the CLI is not authenticated you will see:

```
[Claude Auth] Claude not authenticated.
Please run:
  docker exec -it <container> claude auth login
```

Complete the Anthropic login flow with:

```bash
docker exec -it lessonplayer-backend-1 claude auth login
```

Replace `lessonplayer-backend-1` with the container name shown by `docker compose ps`. Follow the link presented in your terminal to authorise the Claude CLI and return to the container log view; the backend will continue automatically once authentication succeeds.

The stack exposes:

- Frontend (Vite build served by nginx) on http://localhost:5173
- Backend API & websockets on http://localhost:3001

Generated media is stored on the shared `media` volume so it persists between restarts.

## 4. Development Tips

- To force a re-check of the Claude authentication run `docker restart lessonplayer-backend-1`.
- Override `VITE_API_URL` during build if you deploy to another host:
  ```bash
  docker compose build --build-arg VITE_API_URL=https://your.domain
  ```
- Set `CLAUDE_AUTH_CHECK_DISABLED=1` on the backend service for local debugging without Anthropic access (not recommended for production).
