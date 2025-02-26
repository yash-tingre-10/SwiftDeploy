# Use Alpine Linux as the base image
FROM alpine:latest

# Install dependencies and Node.js 20
RUN apk add --no-cache \
    curl \
    bash \
    nodejs \
    npm \
    git

# Set the working directory
WORKDIR /app

# Ensure /app/output exists
RUN mkdir -p /app/output

# Copy necessary files
COPY main.sh script.js package*.json .env /app/

# Convert line endings to LF (Linux format) if needed
RUN dos2unix /app/main.sh || true

# Make the shell script executable
RUN chmod +x /app/main.sh

# Install Node.js dependencies
RUN npm install --omit=dev

# Use /bin/bash explicitly for execution
ENTRYPOINT ["/bin/bash", "/app/main.sh"]
