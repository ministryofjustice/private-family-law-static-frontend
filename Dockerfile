# Use official Node.js runtime as base image
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (production only)
RUN npm ci --only=production

# Copy application code
COPY . .

# Change ownership of the app directory to the built-in 'node' user
RUN chown -R node:node /app

# Switch to the non-root user
USER node

# Don't force HTTPS
ENV USE_HTTPS=false

# Expose port
EXPOSE 3000

# Add timezone in UTC format
RUN apt install tzdata
RUN ln -fs /usr/share/zoneinfo/UTC /etc/localtime

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', res => process.exit(res.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

# Start the application in production mode
CMD ["npm", "run", "serve"]