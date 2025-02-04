FROM node:20-slim

WORKDIR /app

# Install nodemon globally
RUN npm install -g nodemon

# Install concurrently globally
RUN npm install -g concurrently

# Copy package.json files first for better caching
COPY ./package*.json ./
COPY ./client/package*.json ./client/

# Install dependencies at each level
RUN npm install
RUN cd client && npm install

# Don't copy source code - we'll mount it as a volume
# This is just a fallback in case volume mount fails
COPY . .

EXPOSE 3000

# Use nodemon for server and react-scripts for client in dev mode
CMD ["npm", "run", "client"]