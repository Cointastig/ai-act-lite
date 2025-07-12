# --- build frontend ---
FROM node:20-alpine AS frontend
WORKDIR /app
COPY frontend ./frontend
RUN cd frontend && npm install && npm run build

# --- build backend (creates venv) ---
FROM python:3.11-slim AS backend
WORKDIR /app
COPY backend/pyproject.toml backend/poetry.lock* ./backend/
RUN pip install poetry && cd backend && poetry install --no-root
COPY backend ./backend

# --- final image ---
FROM python:3.11-slim
WORKDIR /app

# 1️⃣ Code & assets
COPY --from=backend /app/backend /app/backend
COPY --from=frontend /app/frontend/.next/standalone /app/frontend

# 2️⃣ → bring Poetry virtualenv with all deps
COPY --from=backend /root/.cache/pypoetry/virtualenvs /venv
ENV PATH="/venv/bin:$PATH"

ENV PORT=8000
CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
