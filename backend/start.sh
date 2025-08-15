#!/bin/sh
set -e

# Run database migrations
npx prisma migrate deploy

# Start the application with PM2
npx pm2-runtime start ecosystem.config.js