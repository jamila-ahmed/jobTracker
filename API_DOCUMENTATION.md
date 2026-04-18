# JobTracker Backend API Documentation

## Base URL
- Local development: `http://localhost:3000`
- API prefix: `/api`

## Authentication
- Auth uses JWT Bearer tokens.
- The frontend must send the header:
  - `Authorization: Bearer <token>`
- Tokens are issued by `/api/auth/login` and expire in 24 hours.
- JWT secret is read from `process.env.JWT_SECRET` or falls back to `secretkey` in code.

---

## Auth Endpoints

### 1. Register User
- Method: `POST`
- URL: `/api/auth/register`
- Auth: None

#### Request Body
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

#### Success Response
- Status: `201 Created`
- Body:
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

#### Validation Errors
- Status: `400 Bad Request`
- When a required field is missing or the email already exists.

#### Example Error Response
```json
{
  "status": "failed",
  "message": "all fields are required"
}
```

---

### 2. Login User
- Method: `POST`
- URL: `/api/auth/login`
- Auth: None

#### Request Body
```json
{
  "email": "string",
  "password": "string"
}
```

#### Success Response
- Status: `200 OK`
- Body:
```json
{
  "status": "success",
  "message": "User logged in successfully",
  "token": "<jwt-token>"
}
```

#### Errors
- `400 Bad Request` when missing email or password.
- `404 Not Found` when user does not exist.
- `401 Unauthorized` when password is invalid.

---

### 3. Logout User
- Method: `POST`
- URL: `/api/auth/logout`
- Auth: None

#### Response
- Status: `200 OK`
- Body:
```json
{
  "status": "success",
  "message": "User logged out successfully"
}
```

> Note: This endpoint does not invalidate tokens server-side; it only returns a success message.

---

## Job Endpoints
- Prefix: `/api/jobs`
- Require: `Authorization: Bearer <token>`
- Token middleware extracts `userId` from JWT and sets `req.userId`.

### Job Model
Fields from Prisma schema:
- `id` (integer)
- `title` (string, optional)
- `company` (string)
- `role` (string)
- `status` (string)
- `appliedDate` (DateTime string)
- `notes` (string, optional)
- `userId` (integer)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

Valid statuses are not enforced in the route, but the schema defines the following enum values:
- `applied`
- `interviewing`
- `offered`

### 4. Create Job
- Method: `POST`
- URL: `/api/jobs`
- Auth: Required

#### Request Body
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

#### Success Response
- Status: `201 Created`
- Body: created job object

#### Notes
- `userId` is assigned from the authenticated user.
- `appliedDate` is converted to a `Date`.

---

### 5. Get All Jobs
- Method: `GET`
- URL: `/api/jobs`
- Auth: Required

#### Success Response
- Status: `200 OK`
- Body: array of job objects belonging to the authenticated user

#### Example
```json
[
  {
    "id": 1,
    "title": "Frontend Developer",
    "company": "Acme Corp",
    "role": "Frontend Engineer",
    "status": "applied",
    "appliedDate": "2026-04-18T00:00:00.000Z",
    "notes": "Submitted via company portal",
    "userId": 1,
    "createdAt": "2026-04-18T12:00:00.000Z",
    "updatedAt": "2026-04-18T12:00:00.000Z"
  }
]
```

---

### 6. Get Job by ID
- Method: `GET`
- URL: `/api/jobs/:id`
- Auth: Required

#### Success Response
- Status: `200 OK`
- Body: job object

#### Errors
- Status: `404 Not Found` when the job does not exist.

---

### 7. Update Job
- Method: `PUT`
- URL: `/api/jobs/:id`
- Auth: Required

#### Request Body
```json
{
  "title": "Senior Frontend Developer",
  "company": "Acme Corp",
  "role": "Frontend Engineer",
  "status": "interviewing",
  "notes": "Interview scheduled for next week"
}
```

#### Success Response
- Status: `200 OK`
- Body: updated job object

> Note: `appliedDate` is not updated by this route.

---

### 8. Delete Job
- Method: `DELETE`
- URL: `/api/jobs/:id`
- Auth: Required

#### Success Response
- Status: `200 OK`
- Body:
```json
{
  "message": "Job deleted successfully"
}
```

---

## Authorization Header Example
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Common Error Response Format
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

## Notes for Frontend
- Use `/api/auth/login` to obtain JWT before calling any `/api/jobs` endpoints.
- Store the token securely and include it on every protected request.
- `/api/auth/logout` only returns success; the backend does not revoke tokens.
- Job fetch and creation are scoped to the authenticated user via `userId`.
- The API does not currently validate `status` values in job routes, so frontend should enforce correct enum values.
