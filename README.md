# AI Math Video Maker

An AI-powered editor for creating Manim-based math videos from natural language.

*Commissioned by Kenneth Hawthorn for the [Austin STEM Center](https://AustinSTEMCenter.org)*

<img width="3794" height="2066" alt="CleanShot 2025-11-17 at 18 52 09@2x" src="https://github.com/user-attachments/assets/c7a84a80-41f5-461d-a9fc-99cba848654f" />

https://github.com/user-attachments/assets/f6547a68-eab7-46be-a24c-c0f8c58d58bd


## Prerequisites

- Docker + Docker Compose
- Anthropic Claude account (for CLI auth)
- Google Gemini API key

## Quick Start

1. Copy the sample env file and set required keys:

   ```bash
   cp .env.example .env
   # edit .env to provide GEMINI_API_KEY .
   ```

2. Build images:

   ```bash
   docker compose build backend frontend
   ```

3. Launch stack:

   ```bash
   docker compose up backend frontend
   ```

4. Authenticate Claude from a new terminal (note `-u appuser`):

   ```bash
   docker exec -u appuser -it lessonplayer-current-backend-1 claude auth login
   ```

   Complete the browser-based login. Authentication is cached inside the container.

5. Visit frontend: <http://localhost:5173> (backend API: <http://localhost:3001>).

## Usage Tips

- The app guides you through prompt -> script -> video generation; videos appear under `/data/public`.
- `packages/ai-math-maker/public` is mounted so generated assets persist.
- Claude runs as a non-root user allowing `--permission-mode bypassPermissions` safely.

## Stopping

```bash
docker compose down
```

## Development

- `.dockerignore` keeps node_modules/artifacts out of builds.
- Modify React backend as needed; rebuild with `docker compose build backend frontend`.
- For local `claude` testing ensure non-root user (`appuser`) runs commands.
