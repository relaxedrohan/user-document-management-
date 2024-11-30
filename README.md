# User Document Management System

A NestJS backend service for managing users and documents with role-based access control.

## Prerequisites

- Node.js (v18+)
- Docker & Docker Compose
- PostgreSQL (handled via Docker)

## Quick Start

```bash
# Start PostgreSQL & pgAdmin containers
npm run docker:dev

# Start NestJS app in watch mode
npm run start:dev
This spins up everything you need to start developing. The app will automatically reload when you make changes.

💡 Future improvement: Could integrate the NestJS app into docker-compose for a fully containerized dev environment.

## What's Happening Under the Hood
When you start the server:

TypeORM connects to Postgres (sync enabled for quick development)
Checks user count in database
If users < 100:

Seeds 1000 test users (in batches of 100)
Creates admin & editor test accounts
Logs credentials for Swagger API testing


Starts NestJS app & registers routes

Testing
bashCopynpm run test:e2e
This:

Spins up a dedicated test database
Waits for DB to be ready (2s)
Runs all *.e2e-spec.ts files
Tears down test database when done

Code Quality
We're using Husky for git hooks to ensure code quality:

Pre-commit: Runs linting and formatting
Commit-msg: Enforces conventional commit messages

API Documentation
Once running, visit:

Swagger UI: http://localhost:3000/api
pgAdmin: http://localhost:5050

Next Steps
Some areas I'm planning to improve:
1. Database Migrations

Move away from synchronize: true
Proper version control for schema

2. Docker Optimization

Multi-stage builds
Better caching
Production-ready setup

3. Document Management

Implement file storage
Handle different document types
Version control

4. Performance

Load testing
Query optimization
Caching strategy

5. CI/CD Pipeline

Automated testing
Deployment workflows
Environment management

What Could Be Better
A few things I'd like to enhance:

Proper logging setup
Error handling middleware
Request validation pipeline
API rate limiting
Health checks
Docker watch mode
Documentation generation
Unit test coverage

Contributing
Feel free to open issues or submit PRs. Make sure to:

Follow the existing code style
Add tests for new features
Update documentation
Use conventional commits

```
