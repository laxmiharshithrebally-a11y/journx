# JOURNX — Autonomous Multimodal Travel Intelligence Platform
# NVIDIA × Nebius AI Global Hackathon 2026 Container Specification

FROM python:3.11-slim

LABEL maintainer="JOURNX Autonomous Systems Team"
LABEL description="Autonomous Multimodal Travel Operations Platform"
LABEL version="1.0.0"

# Set non-interactive environment & unbuffered stdout
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8080

# Working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    sqlite3 \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy project files into container
COPY . /app/

# Ensure database is initialized
RUN python init_journx_db.py

# Health check probe
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/api/health || exit 1

# Expose server port
EXPOSE 8080

# Run server
CMD ["python", "server.py"]
