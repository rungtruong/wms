# Product Warranty Management System

A comprehensive warranty management system built with modern technologies.

## Tech Stack

### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **React Query** for data fetching
- **React Hook Form** + **Zod** for form validation

### Backend
- **NestJS 10** with TypeScript
- **Prisma ORM** for database management
- **JWT Authentication** with Guards
- **PostgreSQL 15** as primary database
- **Redis 7** for caching

### Deployment
- **Docker** containerization
- **Docker Compose** for orchestration
- Ready for **Vercel/Railway** deployment
- **PM2** process management
- **Cloud VPS** compatible

## Project Structure

```
product-warranty/
├── frontend/          # Next.js application
│   ├── src/
│   │   ├── app/       # App Router pages
│   │   ├── components/# Reusable components
│   │   ├── lib/       # Utilities and configurations
│   │   ├── services/  # API service layers
│   │   └── types/     # TypeScript type definitions
│   ├── Dockerfile
│   └── package.json
├── backend/           # NestJS application
│   ├── src/
│   │   ├── auth/      # Authentication module
│   │   ├── users/     # User management
│   │   ├── products/  # Product management
│   │   ├── contracts/ # Contract management
│   │   ├── serials/   # Serial number management
│   │   ├── tickets/   # Support ticket system
│   │   └── warranty-history/ # Warranty tracking
│   ├── prisma/        # Database schema and migrations
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml # Full stack orchestration
```

## Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- pnpm (recommended)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd product-warranty
   ```

2. **Setup environment variables**
   ```bash
   # Backend
   cp backend/.env.example backend/.env
   
   # Frontend
   cp frontend/.env.example frontend/.env.local
   ```

3. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

4. **Or run locally**
   ```bash
   # Start PostgreSQL and Redis
   docker-compose up postgres redis -d
   
   # Backend
   cd backend
   pnpm install
   pnpm prisma migrate dev
   pnpm run start:dev
   
   # Frontend (in another terminal)
   cd frontend
   pnpm install
   pnpm run dev
   ```

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api (Swagger)

## Features

### Core Functionality
- **User Management**: Role-based access control (Admin, Manager, Staff)
- **Product Management**: Product catalog with models and specifications
- **Contract Management**: Warranty contract tracking
- **Serial Number Management**: Individual product tracking
- **Warranty Checking**: Public warranty status lookup
- **Support Tickets**: Customer support system
- **Warranty History**: Complete audit trail

### Technical Features
- **Authentication**: JWT-based with refresh tokens
- **Authorization**: Role-based guards and permissions
- **Validation**: Comprehensive input validation
- **Caching**: Redis-based performance optimization
- **Database**: Prisma ORM with PostgreSQL
- **API Documentation**: Auto-generated Swagger docs
- **Type Safety**: End-to-end TypeScript

## Deployment

### Docker Production

```bash
# Build and start all services
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Deployment

1. **Backend Deployment**
   ```bash
   cd backend
   pnpm install --prod
   pnpm prisma migrate deploy
   pnpm run build
   pm2 start dist/main.js --name warranty-backend
   ```

2. **Frontend Deployment**
   ```bash
   cd frontend
   pnpm install --prod
   pnpm run build
   pm2 start npm --name warranty-frontend -- start
   ```

### Environment Variables

Refer to `.env.example` files in both `frontend/` and `backend/` directories for required environment variables.

## API Documentation

Once the backend is running, visit http://localhost:3001/api for interactive API documentation.

## Database Schema

The system uses the following main entities:
- Users (Admin, Manager, Staff roles)
- Products (with models and specifications)
- Contracts (warranty agreements)
- Serials (individual product instances)
- Tickets (support requests)
- Warranty History (audit trail)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.