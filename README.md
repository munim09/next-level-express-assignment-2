# DevPulse

Internal Tech Issue & Feature Tracker

## Assignment Link

[View Assignment](https://github.com/Apollo-Level2-Web-Dev/B7A2)

---

## Live URL

https://devplus-assigment-2.vercel.app/

---

## Features

### Authentication

* User Registration
* User Login
* JWT-based Authentication
* Password Hashing with bcrypt

### Issue Management

* Create Issue
* Get All Issues
* Get Single Issue
* Update Issue
* Delete Issue

### Role-Based Access Control

#### Contributor

* Create issues
* View all issues
* Update own issues when status is `open`

#### Maintainer

* All contributor permissions
* Update any issue
* Delete any issue
* Change issue status

### Filtering & Sorting

* Filter issues by type
* Filter issues by status
* Sort issues by newest or oldest

---

## Tech Stack

* Node.js
* TypeScript
* Express.js
* PostgreSQL
* pg
* bcrypt
* jsonwebtoken

---

## Setup Steps

### 1. Clone Repository

```bash
git clone https://github.com/munim09/next-level-express-assignment-2.git
cd next-level-express-assignment-2
```

### 2. Install Dependencies

```
npm init --y
npm i -D typescript
npx tsc --init
npm install express
npm i --save-dev @types/express
npm install -D @types/express
npm i -D tsx 
npm i dotenv
npm i bcryptjs
npm i jsonwebtoken
npm i --save-dev @types/jsonwebtoken
npm i pg
npm i --save-dev @types/pg
npm i cors 
npm i --save-dev @types/cors
npm install http-status-codes --save

```

### 3. Configure Environment Variables

Create a `.env` file:

```env
PORT=5000
SALT=10
CONNECTIONSTRING=<postgresql_connection_string>
JWT_SECRET=<jwt_secret>
```

### 4. Run Development Server

```bash
npm run dev
```

### 5. Build Project

```bash
npm run build
```

## API Endpoints

### Authentication

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/auth/signup` | Public | Register a new user |
| `POST` | `/api/auth/login` | Public | Login and receive JWT |

### Issues

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/issues` | Authenticated | Create a new issue |
| `GET` | `/api/issues` | Public | Get all issues (with filters) |
| `GET` | `/api/issues/:id` | Public | Get a single issue |
| `PATCH` | `/api/issues/:id` | Authenticated | Update an issue |
| `DELETE` | `/api/issues/:id` | Maintainer only | Delete an issue |

### Query Parameters

```http
GET /api/issues?sort=newest
GET /api/issues?sort=oldest
GET /api/issues?type=bug
GET /api/issues?type=feature_request
GET /api/issues?status=open
GET /api/issues?status=in_progress
GET /api/issues?status=resolved
```

---

## Database Schema Summary

### users

```sql
CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'contributor'
    CHECK (role IN ('contributor', 'maintainer')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### issues

```sql
CREATE TABLE IF NOT EXISTS issues(
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL
    CHECK (LENGTH(description) >= 20),
    type VARCHAR(20) NOT NULL
    CHECK (type IN ('bug', 'feature_request')),
    status VARCHAR(20) DEFAULT 'open'
    CHECK (status IN ('open', 'in_progress', 'resolved')),
    reporter_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```
