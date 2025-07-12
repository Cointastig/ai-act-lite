# === 1. Build Frontend ===
FROM node:20-alpine AS frontend
WORKDIR /app
COPY frontend ./frontend
RUN cd frontend && npm install && npm run build

# === 2. Build & Runtime Backend ===
FROM python:3.11-slim AS runtime
WORKDIR /app

# Install Poetry & backend deps directly into this image
COPY backend/pyproject.toml backend/poetry.lock* ./backend/
RUN pip install poetry \
 && cd backend \
 && poetry install --without dev --no-root

# Copy backend source
COPY backend ./backend

# Copy pre‑built Next.js standalone output
COPY --from=frontend /app/frontend/.next/standalone /app/frontend

ENV PORT=8000
# Use Poetry’s venv via `poetry run` so we don’t fight PATH issues
ENTRYPOINT ["poetry", "run", "uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
