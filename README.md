# Finance Backend API

A production-ready backend API for a finance dashboard system built with Node.js, TypeScript, Express, Prisma, and SQLite.

## Tech Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express.js
- **ORM:** Prisma v7
- **Database:** SQLite
- **Auth:** JWT (jsonwebtoken)
- **Validation:** Zod
- **Security:** Helmet, CORS, Rate Limiting
- **Password Hashing:** bcryptjs

## Features

- JWT Authentication (register, login)
- Role-Based Access Control (VIEWER, ANALYST, ADMIN)
- Full Financial Records CRUD with filters, search, pagination, and soft delete
- Dashboard Analytics (summary, category breakdown, monthly trends, weekly summary, recent activity)
- User Management (admin only)
- Input Validation and standardized error responses

## Roles and Permissions

| Action | VIEWER | ANALYST | ADMIN |
|---|---|---|---|
| Login / Register | ✅ | ✅ | ✅ |
| View transactions | ✅ | ✅ | ✅ |
| Create transaction | ❌ | ❌ | ✅ |
| Update transaction | ❌ | ❌ | ✅ |
| Delete transaction | ❌ | ❌ | ✅ |
| View dashboard summary | ✅ | ✅ | ✅ |
| View recent activity | ✅ | ✅ | ✅ |
| View category breakdown | ❌ | ✅ | ✅ |
| View monthly trends | ❌ | ✅ | ✅ |
| View weekly summary | ❌ | ✅ | ✅ |
| Manage users | ❌ | ❌ | ✅ |

## Setup

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd finance-backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp .env.example .env
```

### 4. Run database migrations
```bash
npx prisma migrate dev --name init
```

### 5. Generate Prisma client
```bash
npx prisma generate
```

### 6. Seed the database
```bash
npm run seed
```

### 7. Start the server
```bash
npm run dev
```

Server runs at `http://localhost:3000`

## Test Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@finance.com | password123 |
| Analyst | analyst@finance.com | password123 |
| Viewer | viewer@finance.com | password123 |

## API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | None | Register new user |
| POST | /api/auth/login | None | Login and get JWT token |

### Users (Admin only)
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/users | List all users |
| GET | /api/users/:id | Get user by ID |
| PATCH | /api/users/:id/role | Update user role |
| PATCH | /api/users/:id/status | Activate or deactivate user |
| DELETE | /api/users/:id | Delete user |

### Transactions
| Method | Endpoint | Role | Description |
|---|---|---|---|
| POST | /api/transactions | ADMIN | Create transaction |
| GET | /api/transactions | ALL | List with filters |
| GET | /api/transactions/:id | ALL | Get single transaction |
| PATCH | /api/transactions/:id | ADMIN | Update transaction |
| DELETE | /api/transactions/:id | ADMIN | Soft delete |

#### Supported filters
`?type=INCOME`, `?category=Food`, `?startDate=2026-01-01`, `?endDate=2026-04-01`, `?search=salary`, `?page=1`, `?limit=10`, `?sortBy=date`, `?order=asc`

### Dashboard
| Endpoint | Role | Description |
|---|---|---|
| GET /api/dashboard/summary | ALL | Total income, expenses, net balance |
| GET /api/dashboard/recent-activity | ALL | Last 10 transactions |
| GET /api/dashboard/category-breakdown | ANALYST, ADMIN | Per category totals |
| GET /api/dashboard/monthly-trends | ANALYST, ADMIN | Monthly income vs expense |
| GET /api/dashboard/weekly-summary | ANALYST, ADMIN | Last 7 days summary |

## Assumptions

- First registered user can be assigned any role during registration for setup purposes. In production this would be restricted.
- Soft delete is used for transactions — records are never permanently removed to maintain financial audit trail.
- SQLite is used for simplicity. Can be swapped for PostgreSQL by changing the Prisma provider.

## Environment Variables

| Variable | Description |
|---|---|
| PORT | Server port (default 3000) |
| DATABASE_URL | SQLite file path |
| JWT_SECRET | Secret key for signing tokens |
| JWT_EXPIRES_IN | Token expiry duration |
| NODE_ENV | Environment (development/production) |
```

Save it.

---

Also create `.env.example` in the root:
```
PORT=3000
DATABASE_URL="file:./dev.db"
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=24h
NODE_ENV=development