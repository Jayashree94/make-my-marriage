# Architecture Notes

This repository uses a modular monolith architecture:

- Frontend: React + TypeScript + Vite for a responsive wedding planning dashboard.
- Backend: Spring Boot 3.x modular monolith with domain packages for auth, tenancy, guests, expenses, vendors, events, photos, settings, notifications, audit, and shared infrastructure.
- Data layer: PostgreSQL with Flyway-based schema migrations and tenant scoping through `marriage_id`.
- Security: secure default configuration with explicit public endpoints for health, Swagger, and API documentation; production authorization should be tightened once the final auth design is confirmed.

This scaffold intentionally keeps the application shell and local developer workflow runnable without implementing all business features.
