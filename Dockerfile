# === 1. Build Frontend ===
FROM node:20-alpine AS frontend
WORKDIR /app
COPY frontend ./frontend
RUN cd frontend && npm install && npm run build

# === 2. Build & Runtime Backend ===
FROM python:3.11-slim AS runtime
WORKDIR /app

# -- A. Install system libs needed by WeasyPrint (cairo, pango, gobject) --
RUN apt-get update -y && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
      libcairo2 \
      libpango-1.0-0 \
      libpangocairo-1.0-0 \
      libgdk-pixbuf-2.0-0 \
      libffi-dev \
      shared-mime-info && \
    rm -rf /var/lib/apt/lists/*

# -- B. Install Poetry & backend deps directly into this image --
COPY backend/pyproject.toml backend/poetry.lock* ./backend/
RUN pip install poetry && \
    cd backend && poetry install --without dev --no-root

# -- C. Copy backend source & Next.js output --
COPY backend ./backend
COPY --from=frontend /app/frontend/.next/standalone /app/frontend

# -- D. Start inside backend dir so poetry sees pyproject.toml --
WORKDIR /app/backend

ENV PORT=8000
ENTRYPOINT ["poetry", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
