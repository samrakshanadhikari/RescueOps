# Use Node.js 20 Alpine for smaller image size
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install build dependencies for better-sqlite3
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application files
COPY . .

# Create directory for SQLite database
RUN mkdir -p /var/data

# Expose port
EXPOSE 8080

# Start the application
CMD ["node", "serverSQLite.js"]

