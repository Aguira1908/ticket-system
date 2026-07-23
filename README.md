# 🎫 Support Ticket System

A full-stack support ticket application where users can create and track support tickets, and administrators can manage ticket statuses and provide responses.

**Built as a Full-Stack Developer Technical Assessment.**

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Features](#features)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Database Migration & Seeding](#database-migration--seeding)
- [Running the Application](#running-the-application)
- [Running Tests](#running-tests)
- [API Documentation](#api-documentation)
- [Second Backend Technology](#second-backend-technology)
- [Project Structure](#project-structure)
- [Known Limitations](#known-limitations)
- [Future Improvements](#future-improvements)
- [Estimated Time Spent](#estimated-time-spent)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend (Main)** | PHP 8.3 · Laravel 13 |
| **Frontend** | React 19 · TypeScript · Inertia.js · Tailwind CSS 4 |
| **Authentication** | Laravel Sanctum (API Token) |
| **Database** | SQLite (development) / PostgreSQL (production via Docker) |
| **Build Tool** | Vite 8 |
| **Testing** | Pest PHP 4 |
| **Second Backend** | Node.js with TypeScript |

---

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                     Client (Browser)                      │
│              React 19 + TypeScript + Inertia.js           │
│              Tailwind CSS 4 · Vite HMR                    │
└───────────────────────┬──────────────────────────────────┘
                        │ Inertia Protocol / fetch()
                        ▼
┌──────────────────────────────────────────────────────────┐
│                 Laravel 13 Backend (PHP 8.3)              │
│                                                          │
│  Routes                                                  │
│  ├── web.php     → Inertia pages (/)                     │
│  └── api.php     → REST API (/api/*)                     │
│                                                          │
│  Controllers                                             │
│  ├── Api\TicketController   → CRUD + Status + Responses  │
│  ├── Api\AuthController     → Login / Logout (Sanctum)   │
│  └── Api\UserController     → User info                  │
│                                                          │
│  Models                                                  │
│  ├── Ticket           → hasMany(TicketResponse)          │
│  ├── TicketResponse   → belongsTo(Ticket, User)          │
│  └── User             → HasApiTokens (Sanctum)           │
│                                                          │
│  Middleware                                               │
│  ├── auth:sanctum     → Admin route protection           │
│  └── throttle:5,1     → Login rate limiting              │
└───────────────────────┬──────────────────────────────────┘
                        │ Eloquent ORM
                        ▼
               ┌─────────────────┐
               │  SQLite / PGSQL │
               └─────────────────┘
```

### Design Decisions

- **Inertia.js + React**: Combines the routing power of Laravel with the interactivity of React SPA. No need for a separate frontend build server or CORS configuration — Inertia acts as the glue.
- **Laravel Sanctum**: Lightweight token-based auth ideal for SPA + API use cases. Chosen over Passport since OAuth complexity is unnecessary here.
- **SQLite (development)**: Zero-configuration database for quick local setup. PostgreSQL is available via Docker Compose for production-like environments.
- **Database enum for status**: Used a database-level `enum('open', 'in_progress', 'resolved')` column with an index for data integrity and query performance.
- **Tailwind CSS 4**: Utility-first CSS framework for rapid, responsive UI development with the new Vite plugin integration.

---

## Features

### 👤 User Features
- ✅ View a list of all tickets (paginated, 15 per page)
- ✅ Create a new ticket (name, email, subject, description)
- ✅ View ticket details with admin responses
- ✅ Display ticket status with visual indicators (Open / In Progress / Resolved)
- ✅ Client-side form validation with error messages

### 🔐 Admin Features
- ✅ Login with email/password (Sanctum token auth)
- ✅ Update ticket status (Open ↔ In Progress ↔ Resolved)
- ✅ Add responses to tickets (linked to authenticated user)
- ✅ Filter tickets by status
- ✅ Logout (token revocation)

### 🛠 Technical Features
- ✅ RESTful API with proper HTTP status codes (200, 201, 401, 404, 422)
- ✅ Server-side input validation
- ✅ Loading and error states
- ✅ Responsive layout (Tailwind CSS)
- ✅ Database migrations with proper relationships
- ✅ Sample seed data (20 tickets, 3 users)
- ✅ Rate limiting on login endpoint (5 attempts/minute)
- ✅ Automated tests with Pest PHP

---

## Setup Instructions

### Prerequisites

- **PHP** >= 8.3
- **Composer** >= 2.x
- **Node.js** >= 18.x
- **npm** >= 9.x
- **SQLite** (default, pre-installed on most systems) or **PostgreSQL** 15+
- **Docker & Docker Compose** (optional, for PostgreSQL)

### 1. Clone the Repository

```bash
git clone https://github.com/Aguira1908/ticket-system.git
cd ticket-system
```

### 2. Install Root Dependencies

```bash
npm install
```

### 3. Setup the Laravel Backend

```bash
cd backend-ticket

# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Install frontend dependencies
npm install
```

### 4. (Optional) Start PostgreSQL with Docker

If you prefer PostgreSQL over SQLite:

```bash
# From the root directory
cd ..

# Update root .env with your desired password
# DB_PASSWORD=your_secure_password

docker compose up -d
```

Then update `backend-ticket/.env`:
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=ticket_system_db
DB_USERNAME=postgres
DB_PASSWORD=your_secure_password
```

---

## Environment Variables

### Root `.env`

Used by Docker Compose for PostgreSQL:

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_CONNECTION` | Database driver | `pgsql` |
| `DB_HOST` | Database host | `127.0.0.1` |
| `DB_PORT` | Database port | `5432` |
| `DB_DATABASE` | Database name | `ticket_system_db` |
| `DB_USERNAME` | Database username | `postgres` |
| `DB_PASSWORD` | Database password | *(set your own)* |

### Backend `backend-ticket/.env`

| Variable | Description | Default |
|----------|-------------|---------|
| `APP_NAME` | Application name | `Laravel` |
| `APP_ENV` | Environment | `local` |
| `APP_DEBUG` | Debug mode | `true` |
| `APP_KEY` | App encryption key | *(auto-generated)* |
| `APP_URL` | Application URL | `http://localhost:8000` |
| `DB_CONNECTION` | Database driver | `sqlite` |

> ⚠️ **Important**: Never commit the `.env` file with real credentials. Use `.env.example` as a template.

---

## Database Migration & Seeding

### Run Migrations

```bash
cd backend-ticket

# Create all tables
php artisan migrate
```

### Seed Sample Data

```bash
# Seed the database with sample users, tickets, and responses
php artisan db:seed
```

This creates:

| Seeder | Data |
|--------|------|
| `UserSeeder` | 3 users: Admin User (`admin@gmail.com`), Support Agent (`support@gmail.com`), Budi Santoso (`budi@gmail.com`) — all with password: `password` |
| `TicketSeeder` | 20 realistic support tickets in Indonesian with varying statuses and priorities |
| `TicketResponseSeeder` | Admin/agent responses on tickets, with follow-ups on in-progress and resolved tickets |

### Fresh Migration + Seed (Reset Everything)

```bash
php artisan migrate:fresh --seed
```

### Database Schema

#### `tickets`
| Column | Type | Description |
|--------|------|-------------|
| `id` | bigint (PK) | Auto-incrementing ID |
| `requester_name` | string(255) | Name of the ticket submitter |
| `requester_email` | string(255) | Email of the ticket submitter |
| `subject` | string(255) | Ticket subject line |
| `description` | text | Detailed description of the issue |
| `status` | enum | `open` \| `in_progress` \| `resolved` (default: `open`, indexed) |
| `created_at` | timestamp | Creation timestamp |
| `updated_at` | timestamp | Last update timestamp |

#### `ticket_responses`
| Column | Type | Description |
|--------|------|-------------|
| `id` | bigint (PK) | Auto-incrementing ID |
| `ticket_id` | bigint (FK) | References `tickets.id` (cascade delete) |
| `user_id` | bigint (FK) | References `users.id` (cascade delete) |
| `message` | text | Response content |
| `created_at` | timestamp | Creation timestamp |
| `updated_at` | timestamp | Last update timestamp |

#### Entity Relationships

```
User (admin/agent)
  │
  │ hasMany (via personal_access_tokens)
  │
  └── TicketResponse
        │ belongsTo
        ▼
      Ticket ──── hasMany ──── TicketResponse
```

---

## Running the Application

### Quick Start (All Services)

From the root directory:

```bash
npm run dev
```

This uses `concurrently` to start:
- 🔵 Laravel backend (`php artisan serve`)
- 🟣 Vite frontend dev server (`npm run dev`)
- 🟡 Node.js second backend (`npm run dev`)

### Run Individually

**Laravel Backend:**
```bash
cd backend-ticket
php artisan serve
# → http://localhost:8000
```

**Vite Dev Server (separate terminal):**
```bash
cd backend-ticket
npm run dev
# → Vite HMR on http://localhost:5173 (proxied through Laravel)
```

### Access Points

| Service | URL |
|---------|-----|
| Main Application | [http://localhost:8000](http://localhost:8000) |
| API Base URL | [http://localhost:8000/api](http://localhost:8000/api) |

### Default Login Credentials

| Account | Email | Password |
|---------|-------|----------|
| Admin | `admin@gmail.com` | `password` |
| Support Agent | `support@gmail.com` | `password` |
| Budi Santoso | `budi@gmail.com` | `password` |

---

## Running Tests

### Run All Tests

```bash
cd backend-ticket
php artisan test
```

Or using Pest directly:

```bash
cd backend-ticket
./vendor/bin/pest
```

### Test Configuration

Tests run against **in-memory SQLite** for speed and isolation (configured in `phpunit.xml`):

```xml
<env name="DB_CONNECTION" value="sqlite"/>
<env name="DB_DATABASE" value=":memory:"/>
```

### Test Suite

| Type | File | Description |
|------|------|-------------|
| Feature Test | `tests/Feature/ExampleTest.php` | Verifies homepage route returns 200 OK |
| Unit Test | `tests/Unit/ExampleTest.php` | Basic assertion sanity check |
| Configuration | `tests/Pest.php` | Pest setup with `RefreshDatabase` trait and helper functions |

---

## API Documentation

### Public Endpoints (No Authentication Required)

---

#### `POST /api/tickets` — Create a New Ticket

**Request Body:**
```json
{
  "requester_name": "John Doe",
  "requester_email": "john@example.com",
  "subject": "Cannot access my account",
  "description": "I've been locked out since yesterday morning..."
}
```

**Validation Rules:**

| Field | Rules |
|-------|-------|
| `requester_name` | required, string, max:255 |
| `requester_email` | required, email, max:255 |
| `subject` | required, string, max:255 |
| `description` | required, string |

**Success:** `201 Created`
**Validation Error:** `422 Unprocessable Entity`
```json
{
  "message": "The requester name field is required.",
  "errors": {
    "requester_name": ["The requester name field is required."]
  }
}
```

---

#### `GET /api/tickets` — List All Tickets

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter: `open`, `in_progress`, `resolved` |
| `page` | int | Page number (15 items per page) |

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": 1,
      "requester_name": "Andi Pratama",
      "requester_email": "andi@example.com",
      "subject": "Login gagal terus",
      "description": "...",
      "status": "open",
      "created_at": "2026-07-23T07:10:39.000000Z",
      "responses": [...]
    }
  ],
  "current_page": 1,
  "last_page": 2,
  "total": 20
}
```

---

#### `GET /api/tickets/{ticket}` — Get Ticket Details

**Response:** `200 OK` — Ticket with eager-loaded `responses.user` (id, username, email)

**Not Found:** `404 Not Found`

---

#### `POST /api/login` — Authenticate

**Request Body:**
```json
{
  "email": "admin@gmail.com",
  "password": "password"
}
```

**Success:** `200 OK`
```json
{
  "token": "1|abc123...",
  "user": {
    "id": 1,
    "username": "Admin User",
    "email": "admin@gmail.com"
  }
}
```

**Failure:** `401 Unauthorized`

> ⚡ Rate limited: **5 attempts per minute** (`throttle:5,1`)

---

### Protected Endpoints (Requires `Authorization: Bearer <token>`)

---

#### `PATCH /api/tickets/{ticket}/status` — Update Ticket Status

**Request Body:**
```json
{
  "status": "in_progress"
}
```

**Validation:** `status` must be one of: `open`, `in_progress`, `resolved`

**Success:** `200 OK`
**Unauthorized:** `401 Unauthorized`

---

#### `POST /api/tickets/{ticket}/responses` — Add Admin Response

**Request Body:**
```json
{
  "message": "We're investigating this issue and will update you shortly."
}
```

**Validation:** `message` is required, string

**Success:** `201 Created` — Response linked to authenticated user
**Unauthorized:** `401 Unauthorized`

---

#### `POST /api/logout` — Revoke Token

Deletes the current access token.

**Success:** `200 OK`

---

## Second Backend Technology

> To demonstrate knowledge of both PHP and Node.js, a standalone Node.js service is included.

The second backend is a Node.js + TypeScript application that provides a small ticket statistics endpoint. It operates independently and does not connect to the main Laravel application.

**Run it:**
```bash
npm run dev:node
# Or: cd second-backend-node && npm run dev
```

This demonstrates:
- Node.js server setup
- TypeScript configuration
- RESTful endpoint design
- JSON data processing

---

## Project Structure

```
support-ticket-system/
├── backend-ticket/                       # Laravel 13 + Inertia.js + React
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   ├── Api/
│   │   │   │   │   ├── AuthController.php        # Sanctum login/logout
│   │   │   │   │   ├── TicketController.php       # Ticket CRUD + responses
│   │   │   │   │   └── UserController.php         # User info (stub)
│   │   │   │   ├── TicketController.php           # Inertia controller (stub)
│   │   │   │   └── TicketResponseController.php   # Inertia controller (stub)
│   │   │   └── Middleware/
│   │   │       └── HandleInertiaRequests.php
│   │   ├── Models/
│   │   │   ├── Ticket.php                 # Ticket model (hasMany responses)
│   │   │   ├── TicketResponse.php         # Response model (belongsTo ticket, user)
│   │   │   └── User.php                  # User model (HasApiTokens)
│   │   └── Providers/
│   ├── config/                            # Laravel config (auth, sanctum, database, etc.)
│   ├── database/
│   │   ├── migrations/                    # 6 migration files
│   │   ├── seeders/                       # User, Ticket, TicketResponse seeders
│   │   ├── factories/                     # UserFactory
│   │   └── database.sqlite                # SQLite database file
│   ├── resources/
│   │   ├── js/
│   │   │   ├── pages/welcome.tsx          # Main React page component
│   │   │   ├── types/                     # TypeScript type definitions
│   │   │   ├── lib/utils.ts               # Tailwind merge utility
│   │   │   ├── actions/                   # Wayfinder route helpers
│   │   │   └── app.tsx                    # Inertia app entry point
│   │   └── css/
│   ├── routes/
│   │   ├── api.php                        # REST API routes
│   │   ├── web.php                        # Inertia page routes
│   │   └── console.php                    # Artisan commands
│   ├── tests/
│   │   ├── Pest.php                       # Test configuration
│   │   ├── Feature/ExampleTest.php        # Feature tests
│   │   └── Unit/ExampleTest.php           # Unit tests
│   ├── composer.json                      # PHP dependencies
│   ├── package.json                       # Node.js dependencies
│   ├── vite.config.ts                     # Vite build configuration
│   ├── phpunit.xml                        # Test runner configuration
│   └── tsconfig.json                      # TypeScript configuration
├── screenshots/                           # Application screenshots
├── docker-compose.yml                     # PostgreSQL container
├── package.json                           # Root monorepo scripts
├── .env.example                           # Environment template
├── .gitignore                             # Git ignore rules
├── AI-USAGE.md                            # AI tools documentation
└── README.md                              # This file
```

---

## Known Limitations

1. **No user registration**: Only seeded users can log in. There is no public registration endpoint — users submit tickets without an account.
2. **No ticket ownership**: Tickets are submitted with `requester_name` and `requester_email` but are not linked to a `users` account. Requesters cannot track their own tickets via login.
3. **Single-page frontend**: The React frontend is primarily contained in `welcome.tsx`. In a production app, this would be decomposed into smaller, reusable components.
4. **No real-time updates**: The ticket list does not auto-refresh. Users must manually reload to see new tickets or status changes.
5. **No file attachments**: Users cannot attach screenshots or files to tickets.
6. **No email notifications**: No email is sent when a ticket status changes or a response is added.
7. **No role-based access control**: Any authenticated user (from the `users` table) is treated as an admin. There is no granular role/permission system.
8. **SQLite limitations**: SQLite does not support concurrent writes well. PostgreSQL (available via Docker) is recommended for production.
9. **Second backend is standalone**: The Node.js service does not connect to the main database — it operates independently.
10. **Basic pagination**: Uses Laravel's default page-based pagination. No infinite scroll or cursor-based pagination.

---

## Future Improvements

Given more time, I would implement the following:

### Architecture
- [ ] Break `welcome.tsx` into reusable components (`TicketList`, `TicketForm`, `TicketDetail`, `AdminPanel`, etc.)
- [ ] Build a standalone Next.js frontend (as originally specified) in addition to the Inertia.js SPA
- [ ] Add proper API resource transformers (`JsonResource`) for consistent API responses

### Features
- [ ] User registration and account-based ticket tracking
- [ ] Role-based access control (User / Agent / Admin)
- [ ] Real-time updates using Laravel Broadcasting (WebSockets / Pusher)
- [ ] Email notifications on ticket status changes and new responses
- [ ] File attachments for tickets (images, documents)
- [ ] Full-text search across ticket subjects and descriptions
- [ ] Dashboard with analytics (ticket volume, average resolution time, SLA tracking)
- [ ] Ticket priority system with SLA deadlines

### Technical
- [ ] Comprehensive test suite with more edge cases and API integration tests
- [ ] E2E testing with Cypress or Playwright
- [ ] CI/CD pipeline (GitHub Actions for automated testing, linting, deployment)
- [ ] API versioning (`/api/v1/`)
- [ ] Request rate limiting on all public endpoints
- [ ] CSRF protection for web routes
- [ ] API documentation with Swagger/OpenAPI

---

## Estimated Time Spent

| Task | Time |
|------|------|
| Project setup & architecture planning | ~1 hour |
| Database schema design & migrations | ~30 minutes |
| Backend API (controllers, validation, auth) | ~2 hours |
| Frontend (React + Inertia.js, styling, forms) | ~3 hours |
| Database seeders & sample data | ~30 minutes |
| Testing setup & writing tests | ~1 hour |
| Second backend (Node.js) | ~30 minutes |
| Documentation (README, AI-USAGE) | ~1 hour |
| Debugging, polish & review | ~1 hour |
| **Total** | **~10.5 hours** |

---

## License

This project was created as a technical assessment submission.
