# Make My Marriage

Make My Marriage is a wedding planning application scaffolded as a modular monolith with a React frontend, a Spring Boot backend, and PostgreSQL persistence.

## Overview

This repository is intentionally scaffolded for local development and future feature work. It includes a responsive wedding dashboard shell, backend health and API scaffolding, tenant-aware Java package structure, local PostgreSQL configuration, and automated build/test checks.

## Technology stack

### Frontend
- React
- TypeScript
- Vite
- React Router
- Zod

### Backend
- Java 21
- Spring Boot 3.3.5
- Maven
- Spring Web
- Spring Validation
- Spring Security
- Spring Data JPA
- PostgreSQL driver
- Flyway
- Spring Boot Actuator
- SpringDoc OpenAPI UI

### Data and infrastructure
- PostgreSQL 16
- Flyway migrations
- Docker Compose for local database setup

## Repository structure

```text
make-my-marriage/
├── docs/
│   ├── architecture/
│   ├── reference/
│   ├── PRD.pdf
│   ├── SYSTEM_DESIGN.pdf
│   ├── DB_Design.pdf
│   └── API_Design.pdf
├── frontend/
├── backend/
├── .editorconfig
├── .env.example
├── .gitignore
├── README.md
├── docker-compose.yml
└── .github/
```

## Prerequisites

- Node.js 20+
- npm 10+
- Java 21
- Maven 3.9+
- Docker Desktop or another local Docker runtime (optional but recommended for PostgreSQL)
- PostgreSQL 16 or an equivalent local installation (optional if using Docker)

## Environment setup

### Root environment file

Copy the root `.env.example` file to `.env` and adjust values as needed.

### Frontend environment file

Copy `frontend/.env.example` to `frontend/.env`.

### Backend environment file

Copy `backend/.env.example` to `backend/.env`.

## Start PostgreSQL

### Option 1: Docker Compose

```bash
docker compose up -d postgres
```

The database configuration is defined in `docker-compose.yml` and reads environment variables for credentials.

### Option 2: Local PostgreSQL instance

Configure PostgreSQL locally and ensure the database name, user, and password match the values in the backend environment file.

## Start the Spring Boot backend

From the repository root:

```bash
cd backend
cp .env.example .env
mvn spring-boot:run
```

The app runs by default on:
- http://localhost:8080

## Start the React frontend

From the repository root:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev -- --host 0.0.0.0
```

The app runs by default on:
- http://localhost:5173

## Run tests and builds

### Frontend

```bash
cd frontend
npm install
npm run test
npm run build
```

### Backend

```bash
cd backend
mvn test
mvn package
```

## Health-check and Swagger URLs

- Health: http://localhost:8080/actuator/health
- Swagger UI: http://localhost:8080/swagger-ui/index.html
- OpenAPI JSON: http://localhost:8080/v3/api-docs

## Git workflow for future development

1. Create a feature branch from `main`.
2. Keep commits small and reviewable.
3. Run targeted tests before opening a PR.
4. Keep environment files out of Git.
5. Merge only after CI and local validation succeed.

## Features intentionally not implemented yet

- Full JWT or session authentication
- Complete wedding planning business logic
- Real photo uploads and storage integrations
- Payment and invoicing flows
- E-mail delivery providers
- Production deployment automation
- Tenant onboarding and role management beyond the scaffolded structure

## Notable limitations

The requirement PDFs were not readable from this environment, so the final database schema and API contract should be validated against those source documents before production work begins. This scaffold intentionally keeps the user experience and project shell working without pretending the full product is implemented.
