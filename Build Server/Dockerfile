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

# Copy files into the container
COPY main.sh /app/main.sh
COPY script.js /app/script.js
COPY package*.json /app/
COPY .env /app/.env

# Install dependencies
RUN npm install

# Make the shell script executable
RUN chmod +x /app/main.sh

# Set the entrypoint to the shell script
ENTRYPOINT ["/app/main.sh"]
