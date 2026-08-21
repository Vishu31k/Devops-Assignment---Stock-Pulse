# Use Node.js LTS as base image
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files first (for Docker layer caching)
COPY package*.json ./

# Install production dependencies only
RUN npm install --only=production

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Start the application
CMD ["node", "server.js"]
