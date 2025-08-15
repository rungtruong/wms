# Docker Build Quick Start

## Quick Commands

```bash
# Build all services
python3 build.py

# Build and start with docker-compose
python3 build.py --compose-up

# Build specific service
python3 scripts/build-service.py frontend

# Build and push to registry
python3 scripts/build-push.py --push
```

## Available Scripts

- `build.py` - Main build script for all services
- `scripts/build-service.py` - Individual service builder
- `scripts/build-push.py` - Build and push to registry

## Configuration

- `build-config.json` - Build configuration
- `docker-compose.yml` - Service orchestration
- `docs/docker-build.md` - Detailed documentation

## Services

- **Frontend**: Next.js app on port 3000
- **Backend**: NestJS API on port 3001
- **PostgreSQL**: Database on port 5432
- **Redis**: Cache on port 6379

See `docs/docker-build.md` for complete documentation.