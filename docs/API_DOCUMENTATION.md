# Smart IT Project Cost Estimation System — API Documentation

**Base URL:** `http://localhost:5000/api`  
**Version:** 1.0.0  
**Authentication:** JWT Bearer token (Admin routes only)

---

## Authentication

### POST `/login`

Admin login endpoint.

**Request Body:**
```json
{
  "email": "admin@smartit.com",
  "password": "admin123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "name": "System Admin",
      "email": "admin@smartit.com",
      "role": "admin"
    }
  }
}
```

**Error Responses:** `401` Invalid credentials, `403` Non-admin user

---

## Project Types

### GET `/project-types`

List all active project types.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| all | boolean | `?all=true` includes inactive (admin) |

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Website",
      "base_cost": "5000.00",
      "base_days": 14,
      "description": "Static or dynamic marketing website",
      "is_active": 1
    }
  ]
}
```

### GET `/project-types/:id`

Get single project type by ID.

### POST `/project-types` 🔒 Admin

Create project type.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "SaaS Platform",
  "base_cost": 30000,
  "base_days": 90,
  "description": "Software as a Service platform"
}
```

### PUT `/project-types/:id` 🔒 Admin

Update project type.

### DELETE `/project-types/:id` 🔒 Admin

Delete project type.

---

## Features

### GET `/features`

List all active features.

**Query Parameters:** `?all=true` for inactive included

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "feature_name": "Authentication",
      "cost": "2500.00",
      "days": 7,
      "complexity_weight": "1.50",
      "description": "User login, registration, password reset",
      "is_active": 1
    }
  ]
}
```

### GET `/features/:id`

Get single feature.

### POST `/features` 🔒 Admin

### PUT `/features/:id` 🔒 Admin

### DELETE `/features/:id` 🔒 Admin

---

## Estimations

### POST `/estimate`

Calculate project estimation. All pricing loaded from database.

**Request Body:**
```json
{
  "project_type_id": 3,
  "feature_ids": [1, 2, 6],
  "client_name": "John Doe",
  "email": "john@example.com",
  "save": true
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "total_cost": 24500,
    "total_days": 98,
    "complexity": "Simple",
    "complexity_score": 7,
    "technology_stack": {
      "frontend": "React",
      "backend": "Node.js",
      "database": "MySQL",
      "ai_service": "Python"
    },
    "cost_breakdown": [...],
    "timeline_breakdown": [...],
    "feature_count": 3,
    "project_type": { "id": 3, "name": "Web Application", "base_cost": 12000, "base_days": 35 },
    "selected_features": [...],
    "saved": true,
    "estimation_id": 1
  }
}
```

**Estimation Formula:**
- `Total Cost = Base Project Cost + Σ Feature Costs`
- `Total Time = Base Days + Σ Feature Days + QA (15%) + Deployment (10%)`
- **Complexity:** 0–3 features = Simple, 4–7 = Medium, 8+ = Complex

### GET `/estimations` 🔒 Admin

List saved estimations with search and filter.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| search | string | Client name or email |
| project_type_id | int | Filter by project type |
| complexity | string | Simple, Medium, Complex |
| page | int | Page number (default: 1) |
| limit | int | Items per page (default: 20) |

### GET `/estimations/:id`

Get estimation details by ID.

---

## Admin Routes

All routes require `Authorization: Bearer <token>` header.

### GET `/admin/dashboard`

Dashboard statistics.

```json
{
  "success": true,
  "data": {
    "total_estimations": 42,
    "total_features": 12,
    "total_project_types": 5
  }
}
```

### POST `/admin/feature`

Create feature (alias for POST `/features`).

### PUT `/admin/feature/:id`

Update feature.

### DELETE `/admin/feature/:id`

Delete feature.

### POST `/admin/project-type`

Create project type.

### PUT `/admin/project-type/:id`

Update project type.

### DELETE `/admin/project-type/:id`

Delete project type.

### GET `/admin/technology-stacks`

List technology stack rules per project type.

### PUT `/admin/technology-stack`

Create or update technology stack.

```json
{
  "project_type_id": 3,
  "frontend": "React",
  "backend": "Node.js",
  "database_name": "MySQL",
  "ai_service": null
}
```

### GET `/admin/stack-feature-rules`

List feature-based stack override rules.

### POST `/admin/stack-feature-rule`

Upsert feature stack rule.

```json
{
  "feature_id": 6,
  "stack_key": "ai_service",
  "stack_value": "Python"
}
```

### DELETE `/admin/stack-feature-rule/:id`

Delete stack feature rule.

---

## Health Check

### GET `/health`

```json
{
  "success": true,
  "message": "Smart IT Estimation API is running",
  "timestamp": "2026-06-10T12:00:00.000Z"
}
```

---

## Error Format

```json
{
  "success": false,
  "message": "Error description",
  "errors": []
}
```

**HTTP Status Codes:**
| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Validation error |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not found |
| 409 | Duplicate entry |
| 500 | Server error |
