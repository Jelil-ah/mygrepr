FROM python:3.12-slim

WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ ./backend/
COPY scheduler.py .

# Keep container running (cron will execute scheduler.py)
CMD ["tail", "-f", "/dev/null"]
