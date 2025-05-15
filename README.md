# MOJ Frontend Docker Container

This README provides instructions for running the MOJ case evaluation frontend container outside of docker-compose.

## Prerequisites

- Docker installed on your machine
- The MOJ frontend source code
- Backend service running on port 8000 (if required)

## Directory Structure

Ensure your directory structure looks like this:
```
.
├── case-evaluation-frontend/
│   └── moj/
│       ├── Dockerfile
│       ├── src/
│       ├── public/
│       └── package.json
└── docker-compose.yml (reference)
```

## Running the Container

### 1. Build the Docker Image

Navigate to the root directory (where docker-compose.yml would normally be) and build the image:

```bash
docker build -t moj-frontend ./case-evaluation-frontend/moj
```

### 2. Run the Container

#### Linux/macOS:

```bash
docker run -it --rm \
  -p 5173:5173 \
  -v $(pwd)/case-evaluation-frontend/moj/src:/app/src \
  -v $(pwd)/case-evaluation-frontend/moj/public:/app/public \
  -v /app/node_modules \
  -v /app/client/node_modules \
  -e CHOKIDAR_USEPOLLING=true \
  -e WATCHPACK_POLLING=true \
  -e NODE_ENV=development \
  -e VITE_APP_BASE_URL=http://localhost:8000 \
  --name moj-frontend \
  moj-frontend
```

#### Windows PowerShell:

```powershell
docker run -it --rm `
  -p 5173:5173 `
  -v ${PWD}/case-evaluation-frontend/moj/src:/app/src `
  -v ${PWD}/case-evaluation-frontend/moj/public:/app/public `
  -v /app/node_modules `
  -v /app/client/node_modules `
  -e CHOKIDAR_USEPOLLING=true `
  -e WATCHPACK_POLLING=true `
  -e NODE_ENV=development `
  -e VITE_APP_BASE_URL=http://localhost:8000 `
  --name moj-frontend `
  moj-frontend
```

#### Windows Command Prompt:

```cmd
docker run -it --rm ^
  -p 5173:5173 ^
  -v %cd%/case-evaluation-frontend/moj/src:/app/src ^
  -v %cd%/case-evaluation-frontend/moj/public:/app/public ^
  -v /app/node_modules ^
  -v /app/client/node_modules ^
  -e CHOKIDAR_USEPOLLING=true ^
  -e WATCHPACK_POLLING=true ^
  -e NODE_ENV=development ^
  -e VITE_APP_BASE_URL=http://localhost:8000 ^
  --name moj-frontend ^
  moj-frontend
```

## Command Explanation

- **`-it`**: Run in interactive mode with a TTY
- **`--rm`**: Automatically remove the container when it stops
- **`-p 5173:5173`**: Map port 5173 from container to host (Vite dev server)
- **`-v $(pwd)/case-evaluation-frontend/moj/src:/app/src`**: Mount source code for hot-reloading
- **`-v $(pwd)/case-evaluation-frontend/moj/public:/app/public`**: Mount public assets
- **`-v /app/node_modules`**: Preserve container's node_modules
- **`-v /app/client/node_modules`**: Preserve client's node_modules
- **Environment variables**:
  - `CHOKIDAR_USEPOLLING=true`: Enable file watching in Docker
  - `WATCHPACK_POLLING=true`: Enable webpack file watching
  - `NODE_ENV=development`: Set development environment
  - `VITE_APP_BASE_URL=http://localhost:8000`: API endpoint URL
- **`--name moj-frontend`**: Name the container for easy reference

## Accessing the Application

Once the container is running, you can access the frontend at:
```
http://localhost:5173
```

## Stopping the Container

Press `Ctrl+C` in the terminal where the container is running, or in another terminal:

```bash
docker stop moj-frontend
```

## Troubleshooting

### Port Already in Use
If port 5173 is already in use, you can map to a different port:
```bash
docker run -it --rm -p 3000:5173 ... # Maps to port 3000 instead
```

### Volume Mount Issues on Windows
If you're having issues with volume mounts on Windows, ensure:
1. Docker Desktop has file sharing enabled for your drive
2. Use forward slashes in paths, not backslashes
3. Try using absolute paths if relative paths don't work

### Backend Connection Issues
If the frontend can't connect to the backend:
1. Ensure the backend is running on port 8000
2. Check that `VITE_APP_BASE_URL` is correctly set
3. Verify there are no firewall/security group restrictions

### Hot Reloading Not Working
If changes aren't reflected immediately:
1. Ensure `CHOKIDAR_USEPOLLING` and `WATCHPACK_POLLING` are set to `true`
2. Check that volume mounts are correctly set up
3. Try restarting the container

## Additional Commands

### View Container Logs
```bash
docker logs moj-frontend
```

### Enter Container Shell
```bash
docker exec -it moj-frontend sh
```

### List Running Containers
```bash
docker ps
```

### Remove the Image
```bash
docker rmi moj-frontend
```

## Feature Flags

The application uses feature flags for controlling benefits functionality. You can control these flags via the browser console:

### Setting Feature Flags

Open your browser's developer console (F12) while the application is running and use these commands:

```javascript
// Enable static benefits mode
window.setBenefitsFeature('static');

// Enable dynamic benefits mode
window.setBenefitsFeature('dynamic');

// Clear override and use environment variable setting
window.clearBenefitsFeature();
```

### How Feature Flags Work

- **Static mode**: Uses predetermined benefits data
- **Dynamic mode**: Fetches benefits data dynamically from the backend
- **Clear**: Removes the override and falls back to the environment variable configuration

The feature flag setting persists in your browser's local storage until you clear it or call `clearBenefitsFeature()`.

## Notes

- This setup is optimized for development with hot-reloading enabled
- The container runs with nodemon and development settings
- Make sure your backend service is accessible at the URL specified in `VITE_APP_BASE_URL`
- All file changes in `src/` and `public/` directories will trigger automatic reloads
- Feature flags are available for controlling application behavior during development