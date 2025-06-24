# MOJ Frontend Docker Container

This README provides instructions for running the MOJ case evaluation frontend using docker-compose.

## Prerequisites

- Docker and Docker Compose installed on your machine
- The MOJ frontend source code

## Directory Structure

Ensure your directory structure looks like this:
```
.
├── docker-compose.yml
└── connecting_services/
    ├── Dockerfile
    ├── app/
    └── package.json
```

## Running the Application

### Start the Application

From the root directory (where docker-compose.yml is located), run:

```bash
docker-compose up
```

To run in detached mode (background):

```bash
docker-compose up -d
```

### Build and Start (if you've made changes to Dockerfile)

```bash
docker-compose up --build
```

## Accessing the Application

Once the container is running, you can access the frontend at:
```
http://localhost:3000
```

Additional port 3001 is also available if needed.

## Managing the Application

### Stop the Application

```bash
docker-compose down
```

### View Logs

```bash
docker-compose logs web
```

To follow logs in real-time:

```bash
docker-compose logs -f web
```

### Restart the Service

```bash
docker-compose restart web
```

## Development Features

### Hot Reloading

The application is configured with hot reloading enabled through:
- `CHOKIDAR_USEPOLLING=true`
- `WATCHPACK_POLLING=true`

Any changes made to files in the `connecting_services` directory will automatically trigger a reload.

### Environment

The container runs in development mode (`NODE_ENV=development`) with all development tools and features enabled.

## Troubleshooting

### Port Already in Use
If ports 3000 or 3001 are already in use, you can modify the ports in your `docker-compose.yml`:
```yaml
ports:
  - "3002:3000"  # Maps to port 3002 instead
  - "3003:3001"  # Maps to port 3003 instead
```

### Volume Mount Issues
If you're having issues with file changes not being detected:
1. Ensure Docker Desktop has file sharing enabled for your project directory
2. Try stopping and restarting the containers: `docker-compose down && docker-compose up`

### Container Won't Start
If the container fails to start:
1. Check the logs: `docker-compose logs web`
2. Ensure the Dockerfile exists in the `connecting_services` directory
3. Try rebuilding: `docker-compose up --build`

### Hot Reloading Not Working
If changes aren't reflected immediately:
1. Verify the polling environment variables are set correctly
2. Check that the volume mount includes your source files
3. Try restarting the service: `docker-compose restart web`

## Additional Commands

### Enter Container Shell
```bash
docker-compose exec web sh
```

### View Running Services
```bash
docker-compose ps
```

### Remove Containers and Volumes
```bash
docker-compose down -v
```

### Remove Images
```bash
docker-compose down --rmi all
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

## Configuration

The current docker-compose configuration:
- **Ports**: 3000 and 3001 are exposed
- **Volume**: The entire `connecting_services` directory is mounted to `/app`
- **Environment**: Development mode with polling enabled for file watching
- **Build Context**: Uses the Dockerfile in the `connecting_services` directory

## Notes

- This setup is optimized for development with hot-reloading enabled
- The container automatically rebuilds when you make changes to your source code
- All file changes in the mounted directory will trigger automatic reloads
- Feature flags are available for controlling application behavior during development
- No backend URL configuration is needed unless you're connecting to external services