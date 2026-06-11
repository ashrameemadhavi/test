# Smart IT Project Cost Estimation System

A production-ready web application that helps clients estimate software development cost, timeline, complexity, and recommended technology stack based on selected project requirements.

## Features

- **Dynamic Estimation Engine** — All pricing, timelines, and stack rules loaded from MySQL
- **Client Portal** — Project type selection, feature cards, instant estimates, PDF quotations
- **Admin Panel** — Full CRUD for features, project types, pricing, tech stacks, and saved estimations
- **Modern SaaS UI** — Bootstrap 5, Inter font, responsive design

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, Bootstrap 5, Axios, React Router, jsPDF |
| Backend | Node.js, Express.js, JWT Auth |
| Database | MySQL 8 |

## Project Structure

```
smart-it-estimation/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Auth, error handling
│   ├── models/          # Data access layer
│   ├── routes/          # API routes
│   ├── services/        # Estimation engine
│   ├── scripts/         # Database seeding
│   └── server.js
├── frontend/
│   └── src/
│       ├── components/  # Reusable UI components
│       ├── pages/       # Route pages
│       ├── services/    # API client
│       └── utils/       # Formatters, PDF generator
├── database/
│   ├── schema.sql       # MySQL schema
│   └── seed.sql         # Seed data
└── docs/
    ├── API_DOCUMENTATION.md
    ├── TESTING_REPORT.md
    └── DEPLOYMENT_GUIDE.md
```

## Quick Start

### 1. Database

```bash
mysql -u root -p < database/schema.sql
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MySQL credentials
npm run seed
npm run dev
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

- **Client App:** http://localhost:5173
- **API:** http://localhost:5000/api
- **Admin Login:** http://localhost:5173/admin/login

### Default Admin

- Email: `admin@smartit.com`
- Password: `admin123`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/login` | Admin login |
| GET | `/api/project-types` | List project types |
| GET | `/api/features` | List features |
| POST | `/api/estimate` | Calculate estimation |
| GET | `/api/estimations` | List saved estimations (admin) |
| POST | `/api/admin/feature` | Create feature (admin) |
| PUT | `/api/admin/feature/:id` | Update feature (admin) |
| DELETE | `/api/admin/feature/:id` | Delete feature (admin) |

See [API Documentation](docs/API_DOCUMENTATION.md) for complete reference.

## Estimation Formula

```
Total Cost = Base Project Cost + Σ Selected Feature Costs
Total Time = Base Days + Σ Feature Days + QA (15%) + Deployment (10%)

Complexity:
  0-3 features → Simple
  4-7 features → Medium
  8+ features  → Complex
```

## Documentation

- [API Documentation](docs/API_DOCUMENTATION.md)
- [Testing Report](docs/TESTING_REPORT.md)
- [Deployment Guide](docs/DEPLOYMENT_GUIDE.md)

## License

MIT
