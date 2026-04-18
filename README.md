# JobTracker Backend

This repository contains the backend API for the JobTracker application.
It provides authentication, job management, and user-specific job tracking functionality.

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment:
   - Set `DATABASE_URL` for PostgreSQL.
   - Set `JWT_SECRET` for JWT token signing.
3. Run the app:
   ```bash
   npm run dev
   ```

## API Base URL
- Local development: `http://localhost:3000`
- API prefix: `/api`

---

## Authentication Endpoints

### Register
- `POST /api/auth/register`
- Request body:
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```
- Success: `201 Created`
- Response:
  ```json
  {
    "status": "success",
    "message": "user register successfully",
    "data": {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com"
    }
  }
  ```

### Login
- `POST /api/auth/login`
- Request body:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- Success: `200 OK`
- Response:
  ```json
  {
    "status": "success",
    "message": "User logged in successfully",
    "token": "<jwt-token>"
  }
  ```

### Logout
- `POST /api/auth/logout`
- Success: `200 OK`
- Response:
  ```json
  {
    "status": "success",
    "message": "User logged out successfully"
  }
  ```

> Note: logout currently only returns a success message and does not revoke JWT tokens.

---

## Job Endpoints
- All job endpoints require `Authorization: Bearer <token>`.

### Create Job
- `POST /api/jobs`
- Request body:
  ```json
  {
    "title": "Frontend Developer",
    "company": "Acme Corp",
    "role": "Frontend Engineer",
    "status": "applied",
    "appliedDate": "2026-04-18T00:00:00.000Z",
    "notes": "Submitted via company portal"
  }
  ```
- Success: `201 Created`
- Response: created job object

### Get All Jobs
- `GET /api/jobs`
- Success: `200 OK`
- Response: array of jobs belonging to the authenticated user

### Get Job by ID
- `GET /api/jobs/:id`
- Success: `200 OK`
- Response: job object

### Update Job
- `PUT /api/jobs/:id`
- Request body:
  ```json
  {
    "title": "Senior Frontend Developer",
    "company": "Acme Corp",
    "role": "Frontend Engineer",
    "status": "interviewing",
    "notes": "Interview scheduled for next week"
  }
  ```
- Success: `200 OK`
- Response: updated job object

> Note: this route does not update `appliedDate`.

### Delete Job
- `DELETE /api/jobs/:id`
- Success: `200 OK`
- Response:
  ```json
  {
    "message": "Job deleted successfully"
  }
  ```

---

## Job Model
Fields returned for jobs:
- `id` (integer)
- `title` (string | null)
- `company` (string)
- `role` (string)
- `status` (string)
- `appliedDate` (DateTime string)
- `notes` (string | null)
- `userId` (integer)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

Valid status values are defined in Prisma as:
- `applied`
- `interviewing`
- `offered`

The backend does not currently enforce status enum validation in job route handlers, so the frontend should send valid values.

---

## Authorization Header Example
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Error Responses
- Auth errors:
  ```json
  {
    "status": "failed",
    "message": "Invalid or expired token"
  }
  ```
- Server errors:
  ```json
  {
    "error": "failed to retrieve jobs"
  }
  ```

---

## Notes for Frontend
- Authenticate with `/api/auth/login` first.
- Store the JWT securely and send it on every protected request.
- `/api/auth/logout` is a client-side convenience endpoint only.
- Job endpoints are scoped to the authenticated user by `userId`.
- Use `appliedDate` as ISO 8601 timestamp.
