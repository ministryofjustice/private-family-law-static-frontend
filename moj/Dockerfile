# Use Node.js LTS version
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

RUN npm install react-markdown

# Copy the rest of the application
COPY . .

# Expose port 5173 (Vite's default port)
EXPOSE 5173

# Use npx to run vite to ensure we're using the local installation
CMD ["npx", "vite", "--host", "0.0.0.0"]