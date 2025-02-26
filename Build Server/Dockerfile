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
COPY main.sh /app/main.sh
COPY script.js /app/script.js
COPY package*.json /app/
COPY .env /app/.env

# Fix line endings in main.sh (in case of CRLF issues)
RUN sed -i 's/\r$//' /app/main.sh

# Make the shell script executable
RUN chmod +x /app/main.sh

# Install Node.js dependencies
RUN npm install

# Use /bin/bash explicitly for execution
ENTRYPOINT ["/bin/bash", "/app/main.sh"]
