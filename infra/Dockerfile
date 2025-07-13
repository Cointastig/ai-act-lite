# Dockerfile (root oder infra/Dockerfile)
FROM node:20-alpine as frontend
WORKDIR /app
COPY frontend ./frontend
RUN cd frontend && npm install && npm run build

FROM python:3.11-slim as backend
WORKDIR /app

# neu: System-Pakete für WeasyPrint
RUN apt-get update && apt-get install -y \
      libcairo2 \
      libpango-1.0-0 \
      libgdk-pixbuf2.0-0 \
      libffi-dev \
      shared-mime-info \
    && rm -rf /var/lib/apt/lists/*

COPY backend/pyproject.toml backend/poetry.lock* ./backend/
RUN pip install poetry && cd backend && poetry install --no-root
COPY backend ./backend

FROM python:3.11-slim
WORKDIR /app
COPY --from=backend /app/backend /app/backend
COPY --from=frontend /app/frontend/.next/standalone /app/frontend

ENV PORT=8000
CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
