# === 1. Build Frontend ===
FROM node:20-alpine AS frontend
WORKDIR /app
COPY frontend ./frontend
RUN cd frontend && npm install && npm run build

# === 2. Build & Runtime Backend ===
FROM python:3.11-slim AS runtime
WORKDIR /app

# 2-a | Abhängigkeiten in _dieses_ Image installieren
COPY backend/pyproject.toml backend/poetry.lock* ./backend/
RUN pip install poetry \
 && cd backend \
 && poetry install --without dev --no-root

# 2-b | Backend-Code kopieren
COPY backend ./backend

# 2-c | Next.js-Output übernehmen
COPY --from=frontend /app/frontend/.next/standalone /app/frontend

# 2-d | **Direkt ins Backend-Verzeichnis wechseln**
WORKDIR /app/backend

# 2-e | Start-Befehl – „poetry run“ findet hier die pyproject.toml
ENTRYPOINT ["poetry", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
