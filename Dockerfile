FROM python:3.12-slim

WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ ./backend/
COPY scheduler.py .

# Run as non-root user
RUN adduser --disabled-password --gecos '' appuser
USER appuser

# Run scheduler in loop mode (daily at 6:00)
CMD ["python", "scheduler.py"]
