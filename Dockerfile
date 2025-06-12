# Build the static assets
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json files first for better caching
COPY ./package*.json ./
COPY ./client/package*.json ./client/

# Install dependencies at each level
RUN npm install
RUN cd client && npm install

# Copy the application source code
COPY . .

# Run the build script
RUN cd client && npm run build

# Serve the static assets NGINX
FROM nginx:stable-alpine

# Copy the NGINX configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built static assets from the builder stage
COPY --from=builder /app/client/build /usr/share/nginx/html

# Expose port 80 for incoming HTTP traffic
EXPOSE 80

# Command to start NGINX in the foreground
CMD ["nginx", "-g", "daemon off;"]