# Use Python 3.10 slim image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requeriments.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requeriments.txt

# Copy application code
COPY app/ ./app/
COPY AI_models/ ./AI_models/

# Create non-root user for security
RUN adduser --disabled-password --gecos '' appuser && chown -R appuser:appuser /app
USER appuser

# Expose port (Cloud Run uses PORT env var, default to 8000)
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${PORT:-8000}/health || exit 1

# Run the application
CMD exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
