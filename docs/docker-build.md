# Docker Build Documentation

## Overview

This document describes the Docker build process for the WMS (Warehouse Management System) project. The project uses a multi-service architecture with separate containers for frontend, backend, and supporting services.

## Project Structure

```
wms/
├── docker-compose.yml          # Main orchestration file
├── build.py                    # Main build script
├── build-config.json          # Build configuration
├── scripts/
│   ├── build-service.py       # Individual service builder
│   └── build-push.py          # Build and push to registry
├── frontend/
│   ├── Dockerfile             # Frontend container definition
│   └── .dockerignore          # Frontend build exclusions
├── backend/
│   ├── Dockerfile             # Backend container definition
│   └── .dockerignore          # Backend build exclusions
└── docs/
    └── docker-build.md        # This documentation
```

## Services

### Frontend (Next.js)
- **Image**: `wms-frontend`
- **Port**: 3000
- **Context**: `./frontend`
- **Health Check**: `http://localhost:3000/api/health`

### Backend (NestJS)
- **Image**: `wms-backend`
- **Port**: 3001
- **Context**: `./backend`
- **Health Check**: `http://localhost:3001/health`

### Supporting Services
- **PostgreSQL**: Database service
- **Redis**: Caching service

## Build Scripts

### 1. Main Build Script (`build.py`)

The primary script for building the entire project or individual services.

```bash
# Build all services
python3 build.py

# Build specific service
python3 build.py --service frontend

# Build with custom tag
python3 build.py --tag v1.0.0

# Build and run with docker-compose
python3 build.py --compose-up

# Build without cache
python3 build.py --no-cache

# Push to registry after building
python3 build.py --push
```

### 2. Individual Service Builder (`scripts/build-service.py`)

Advanced script for building individual services with detailed options.

```bash
# Build frontend service
python3 scripts/build-service.py frontend

# Build with custom tag and push
python3 scripts/build-service.py backend --tag v1.0.0 --push

# Build for specific platform
python3 scripts/build-service.py frontend --platform linux/amd64

# Build with custom build arguments
python3 scripts/build-service.py backend --build-arg NODE_ENV=production

# Build and run container
python3 scripts/build-service.py frontend --run
```

### 3. Build and Push Script (`scripts/build-push.py`)

CI/CD-ready script for building and pushing images to registry.

```bash
# Build and push all services
python3 scripts/build-push.py --push

# Build for specific environment
python3 scripts/build-push.py --environment production --push

# Build with registry credentials
python3 scripts/build-push.py --push \
  --registry-url your-registry.com \
  --registry-username your-username \
  --registry-password your-password

# Build and cleanup old images
python3 scripts/build-push.py --cleanup --keep-tags 3
```

## Configuration

### Build Configuration (`build-config.json`)

Centralized configuration for all build operations:

```json
{
  "services": {
    "frontend": {
      "context": "./frontend",
      "image_name": "wms-frontend",
      "ports": ["3000:3000"]
    },
    "backend": {
      "context": "./backend",
      "image_name": "wms-backend",
      "ports": ["3001:3001"]
    }
  },
  "registry": {
    "url": "",
    "namespace": "wms"
  },
  "environments": {
    "development": {
      "tag_suffix": "-dev"
    },
    "production": {
      "tag_suffix": ""
    }
  }
}
```

## Docker Compose

### Development

```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d frontend

# View logs
docker-compose logs -f backend

# Stop all services
docker-compose down
```

### Production

```bash
# Build and start
docker-compose -f docker-compose.yml up -d --build

# Scale services
docker-compose up -d --scale frontend=2
```

## Dockerfile Features

### Multi-Stage Build

Both frontend and backend use optimized multi-stage builds:

1. **deps**: Install dependencies
2. **builder**: Build application
3. **runner**: Production runtime

### Security Features

- Non-root user execution
- Minimal base images (Alpine Linux)
- Security updates included

### Performance Optimizations

- Layer caching optimization
- Minimal production dependencies
- Process management with dumb-init
- Memory limits configuration

### Health Checks

- Built-in health check endpoints
- Configurable intervals and timeouts
- Dependency-aware startup ordering

## Environment Variables

### Frontend

```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=http://localhost:3001
PORT=3000
NEXT_TELEMETRY_DISABLED=1
```

### Backend

```env
NODE_ENV=production
DATABASE_URL=postgresql://warranty_user:warranty_password@postgres:5432/warranty_db
REDIS_URL=redis://redis:6379
JWT_SECRET=your-super-secret-jwt-key
PORT=3001
```

## Build Optimization

### .dockerignore Files

Both services include comprehensive `.dockerignore` files to exclude:

- `node_modules/`
- Development files
- IDE configurations
- Log files
- Cache directories
- Documentation

### Build Cache

- Use `--cache-from` for CI/CD pipelines
- Layer ordering optimized for cache hits
- Dependencies installed before source code copy

## Logging

### Configuration

```yaml
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

### Log Management

```bash
# View logs
docker-compose logs -f [service]

# Log rotation is automatic with above config
# Logs are limited to 10MB per file, 3 files max
```

## Monitoring

### Health Checks

All services include health checks:

- **Interval**: 30 seconds
- **Timeout**: 10 seconds
- **Retries**: 3
- **Start Period**: 40 seconds

### Status Monitoring

```bash
# Check service health
docker-compose ps

# Detailed health status
docker inspect --format='{{.State.Health.Status}}' container_name
```

## Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear build cache
   docker builder prune
   
   # Rebuild without cache
   python3 build.py --no-cache
   ```

2. **Health Check Failures**
   ```bash
   # Check container logs
   docker-compose logs [service]
   
   # Test health endpoint manually
   curl http://localhost:3001/health
   ```

3. **Registry Push Issues**
   ```bash
   # Login to registry
   docker login your-registry.com
   
   # Verify credentials
   docker system info
   ```

### Debug Mode

```bash
# Run with debug output
DEBUG=1 python3 build.py

# Interactive container debugging
docker run -it --rm wms-frontend:latest sh
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build and Push
        run: |
          python3 scripts/build-push.py \
            --environment production \
            --push \
            --registry-url ${{ secrets.REGISTRY_URL }} \
            --registry-username ${{ secrets.REGISTRY_USERNAME }} \
            --registry-password ${{ secrets.REGISTRY_PASSWORD }}
```

### GitLab CI Example

```yaml
stages:
  - build
  - deploy

build:
  stage: build
  script:
    - python3 scripts/build-push.py --environment production --push
  only:
    - main
```

## Best Practices

1. **Security**
   - Use specific image tags, not `latest`
   - Scan images for vulnerabilities
   - Use secrets management for sensitive data
   - Run containers as non-root users

2. **Performance**
   - Optimize layer caching
   - Use multi-stage builds
   - Minimize image size
   - Configure resource limits

3. **Reliability**
   - Implement proper health checks
   - Use restart policies
   - Configure logging
   - Monitor resource usage

4. **Maintenance**
   - Regular base image updates
   - Automated security scanning
   - Log rotation configuration
   - Cleanup old images regularly

## Support

For issues or questions regarding the Docker build process:

1. Check the troubleshooting section
2. Review container logs
3. Verify configuration files
4. Test individual components

## Version History

- **v1.0.0**: Initial Docker implementation
- **v1.1.0**: Added health checks and logging
- **v1.2.0**: Improved build scripts and CI/CD support