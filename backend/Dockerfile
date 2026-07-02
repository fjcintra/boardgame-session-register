# Use official slim Python 3.12 image
FROM python:3.12-slim

# Set environment variables for Python performance & container run
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8000

# Create non-root system user and group
RUN groupadd -r appgroup && useradd -r -g appgroup -s /sbin/nologin -d /app appuser

WORKDIR /app

# Copy requirements first to leverage Docker layer caching
COPY requirements.txt .

# Install dependencies (without caching pip packages to keep image lightweight)
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy all application files
COPY . .

# Adjust permissions for non-root user
RUN chown -R appuser:appgroup /app

# Switch to the non-root user
USER appuser

EXPOSE 8000

# Start Uvicorn pointing to app.main:app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
