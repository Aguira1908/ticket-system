# AI Usage Documentation

## AI Tools Used

| Tool | Version / Model | Purpose |
|------|----------------|---------|
| **Google Gemini (Antigravity)** | Claude Opus 4.6 | Code generation, architecture guidance, debugging, and documentation |
| **GitHub Copilot** | VS Code Extension | Inline code completion and suggestions while writing |

---

## Tasks AI Assisted With

### 1. Project Scaffolding & Architecture
- Generated the initial Laravel project structure using the React starter kit (`laravel/react`)
- Suggested the monorepo layout with `backend-ticket/` for the Laravel + Inertia.js application
- Recommended the use of Inertia.js + React for the frontend SPA approach

### 2. Database Schema Design
- Assisted in designing the `tickets` and `ticket_responses` migration schemas
- Suggested using database-level `enum` for the `status` column (`open`, `in_progress`, `resolved`) with an index for query performance
- Recommended cascade delete on `ticket_responses` foreign keys (`ticket_id` and `user_id`)

### 3. API Controller Logic
- Generated boilerplate for the `Api\TicketController` with CRUD operations
- Helped implement request validation rules (e.g., `requester_name` max length, `requester_email` email format, `status` enum validation with `in:open,in_progress,resolved`)
- Suggested eager loading of `responses.user` relationship to avoid N+1 queries

### 4. Authentication & Authorization
- Guided the setup of Laravel Sanctum for API token authentication
- Generated `Api\AuthController` with login/logout endpoints using `Hash::check()` for password verification
- Helped configure the `auth:sanctum` middleware for admin-only routes (status update and ticket responses)
- Suggested rate limiting on the login endpoint (`throttle:5,1`)

### 5. Database Seeders
- Generated realistic sample ticket data in Indonesian for the `TicketSeeder` (20 tickets with various statuses and priorities)
- Created `TicketResponseSeeder` with follow-up responses for in-progress and resolved tickets
- Created `UserSeeder` with 3 staff accounts (Admin User, Support Agent, Budi Santoso)

### 6. Frontend (React + TypeScript + Inertia.js)
- Assisted in building the `welcome.tsx` page component
- Generated utility functions (`cn()` using `clsx` + `tailwind-merge`)
- Helped set up Inertia.js client-side entry point with `createInertiaApp()`

### 7. Testing
- Helped configure Pest PHP with `RefreshDatabase` trait for test isolation
- Suggested PHPUnit XML configuration with in-memory SQLite for fast testing
- Assisted with structuring Feature and Unit test directories

### 8. Documentation
- Generated this `AI-USAGE.md` file
- Generated the `README.md` with setup instructions and architecture explanation

---

## Example of Incorrect or Suboptimal AI Output

### Issue: N+1 Query Problem in Ticket Listing

**What AI generated:**

```php
// Api\TicketController@index - Initial AI suggestion
public function index(Request $request)
{
    $query = Ticket::query();

    if ($request->has('status')) {
        $query->where('status', $request->status);
    }

    return response()->json($query->paginate(15));
}
```

**What was wrong:**

The AI-generated code did not include eager loading of the `responses` relationship. When the frontend displayed ticket details (including response counts), each ticket triggered a separate database query to fetch its responses — a classic **N+1 query problem**. With 15 tickets per page, this resulted in 16 queries instead of 2.

**How I fixed it:**

```php
public function index(Request $request)
{
    $query = Ticket::with('responses'); // Added eager loading

    if ($request->has('status')) {
        $query->where('status', $request->status);
    }

    return response()->json($query->paginate(15));
}
```

Adding `::with('responses')` reduced the query count from N+1 to just 2 queries (one for tickets, one for all related responses), which is significantly more efficient.

**How I identified the issue:**

I inspected the queries using Laravel's `DB::listen()` during development and noticed the repeated `SELECT * FROM ticket_responses WHERE ticket_id = ?` queries. Understanding ORM eager loading vs lazy loading from prior experience helped me recognize this immediately.

---

## How AI-Generated Code Was Reviewed and Tested

### Code Review Process

1. **Line-by-line review**: Every piece of AI-generated code was read and understood before being accepted. I did not blindly copy-paste any suggestions.

2. **Understanding the "why"**: For each suggestion, I ensured I understood *why* the AI recommended a particular approach (e.g., why Sanctum over Passport for API token auth, why enum columns for status).

3. **Security audit**: I specifically checked for:
   - SQL injection vulnerabilities (confirmed Eloquent's parameterized queries are used)
   - Mass assignment protection (`$fillable` is properly set on all models)
   - Authentication middleware correctly applied to admin-only routes
   - Password hashing (User model casts `password` as `hashed`)
   - No credentials hardcoded or committed (`.env` is in `.gitignore`)
   - Rate limiting on login endpoint to prevent brute-force attacks

4. **Type safety**: Verified that TypeScript types in the frontend matched the API response structure from the backend.

### Testing Process

1. **Manual API testing**: Used browser and `curl` to test every API endpoint with valid and invalid inputs:
   - Confirmed proper HTTP status codes (200, 201, 401, 404, 422)
   - Verified validation error messages are returned correctly
   - Tested authentication flow (login → token → authenticated request → logout)

2. **Automated tests**: Ran the Pest test suite (`php artisan test`) to verify:
   - Feature test: Homepage returns 200 status
   - Unit test: Basic assertion sanity check
   - Tests run against in-memory SQLite (configured in `phpunit.xml`)

3. **Edge cases tested manually**:
   - Submitting a ticket with empty fields → 422 with validation errors
   - Submitting a ticket with invalid email format → 422 validation error
   - Accessing admin routes without token → 401 Unauthorized
   - Requesting a non-existent ticket → 404 Not Found
   - Filtering tickets by invalid status → Returns empty results
   - Exceeding login rate limit (5 attempts/minute) → 429 Too Many Requests

4. **Frontend testing**: Manually tested all user flows in the browser:
   - Creating a ticket and seeing it appear in the list
   - Viewing ticket details with responses
   - Admin login and status update flow
   - Responsive layout on different viewport sizes

---

## Summary

AI tools were used as an **accelerator**, not a replacement for understanding. Every piece of generated code was reviewed for correctness, security, and performance before inclusion. The candidate takes full responsibility for all submitted code and can explain any part of the codebase in detail.
