# 🏗️ Construction Project & Material Management System

A full-stack construction management platform built with **Next.js 16**, **MongoDB**, and **Tailwind CSS**. Developed as part of a practical full-stack learning project (29 May – 04 June 2026).

---

## 🌐 System Overview

| App | Description | Port |
|-----|-------------|------|
| `website/` | Public-facing portal | `localhost:3000` |
| `admin/` | Admin management panel | `localhost:3001` |
| `backend/` | Shared REST API + MongoDB | `localhost:3002` |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or MongoDB Atlas)

### 1. MongoDB Setup

Set your MongoDB URI in `backend/.env.local`:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/construction-db
JWT_SECRET=construction_secret_key_2026_change_in_production
NEXT_PUBLIC_BACKEND_URL=http://localhost:3002
```

Or for MongoDB Atlas:
```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.mongodb.net/construction-db
```

### 2. Install & Run All Apps

Open **3 separate terminals**:

**Terminal 1 – Backend API (Port 3002):**
```bash
cd backend
npm install
npm run dev
```

**Terminal 2 – Admin Panel (Port 3001):**
```bash
cd admin
npm install
npm run dev
```

**Terminal 3 – Website (Port 3000):**
```bash
cd website
npm install
npm run dev
```

### 3. Seed Demo Data

After the backend starts, run this **once** to populate the database with sample data:

```bash
# Using curl:
curl -X POST http://localhost:3002/api/auth/seed-data

# Or seed just the admin user:
curl -X POST http://localhost:3002/api/auth/seed
```

Or use Postman/Insomnia to POST to `http://localhost:3002/api/auth/seed-data`

**Default Admin Credentials:**
```
Email:    admin@construction.com
Password: admin123456
```

**Seed data includes:**
- 1 Admin user
- 5 Construction projects (with milestones)
- 8 Construction materials
- 6 Workers (with roles and skills)
- 3 Suppliers (with supply history)
- 3 Contact messages
- 4 Project-worker assignments

---

## 📦 Tech Stack

| Category | Technology |
|----------|-----------| 
| Frontend (Website) | Next.js 16 (App Router, SSR) |
| Frontend (Admin) | Next.js 16 (App Router, CSR) |
| Backend | Next.js 16 API Routes |
| Database | MongoDB + Mongoose ODM |
| Styling | Tailwind CSS v4 + Custom CSS |
| Authentication | JWT + bcryptjs |
| Charts | Recharts |
| Icons | Lucide React |

---

## 📁 Project Structure

```
Construction Project & Material Management System/
│
├── backend/                    # Shared REST API + MongoDB models
│   ├── app/api/
│   │   ├── auth/               # login, logout, me, seed, seed-data
│   │   ├── dashboard/          # Analytics summary endpoint
│   │   ├── projects/           # CRUD + [id] routes
│   │   ├── materials/          # CRUD + [id] routes
│   │   ├── workers/            # CRUD + [id] routes
│   │   ├── suppliers/          # CRUD + [id] routes
│   │   ├── contacts/           # Submit + [id] routes
│   │   └── assignments/        # CRUD + [id] routes
│   ├── models/
│   │   ├── Admin.js            # Admin user with bcrypt password
│   │   ├── Project.js          # Projects with milestones
│   │   ├── Material.js         # Materials with auto-status
│   │   ├── Worker.js           # Workers with assignments
│   │   ├── Supplier.js         # Suppliers with supply history
│   │   ├── Assignment.js       # Worker-project assignments
│   │   └── Contact.js          # Contact form submissions
│   ├── lib/
│   │   ├── mongodb.js          # Mongoose connection with caching
│   │   └── auth.js             # JWT sign/verify utilities
│   └── .env.local              # MongoDB URI + JWT Secret
│
├── admin/                      # Admin management panel (port 3001)
│   ├── app/
│   │   ├── login/page.js       # Secure JWT login
│   │   ├── dashboard/          # Analytics + charts
│   │   ├── projects/           # CRUD with modal forms
│   │   ├── materials/          # Stock management
│   │   ├── workforce/          # Workers + project assignment
│   │   ├── suppliers/          # Suppliers + supply history
│   │   └── contacts/           # View, mark read, delete
│   ├── components/
│   │   ├── Sidebar.js          # Navigation + logout
│   │   └── Header.js           # Page header + admin info
│   └── lib/api.js              # Admin API client
│
└── website/                    # Public website (port 3000)
    ├── app/
    │   ├── page.js             # Home (hero, features, projects)
    │   ├── about/page.js       # Company info, values, timeline
    │   ├── projects/
    │   │   ├── page.js         # All projects listing
    │   │   └── [id]/page.js    # Project detail with milestones
    │   ├── materials/page.js   # Stock & availability display
    │   ├── workforce/page.js   # Worker cards with roles
    │   └── contact/page.js     # Contact form with validation
    ├── components/
    │   ├── Navbar.js           # Responsive navigation
    │   └── Footer.js           # Footer with links
    └── lib/api.js              # Website API client
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin login (returns JWT) |
| POST | `/api/auth/logout` | Clear auth cookie |
| GET | `/api/auth/me` | Get current admin info |
| POST | `/api/auth/seed` | Create first admin user |
| POST | `/api/auth/seed-data` | Seed full demo data |
| GET | `/api/dashboard` | Analytics summary |
| GET/POST | `/api/projects` | List / Create projects |
| GET/PUT/DELETE | `/api/projects/:id` | Get / Update / Delete project |
| GET/POST | `/api/materials` | List / Add materials |
| GET/PUT/DELETE | `/api/materials/:id` | Get / Update / Delete material |
| GET/POST | `/api/workers` | List / Add workers |
| GET/PUT/DELETE | `/api/workers/:id` | Get / Update / Delete worker |
| GET/POST | `/api/suppliers` | List / Add suppliers |
| GET/PUT/DELETE | `/api/suppliers/:id` | Get / Update / Delete supplier |
| GET/POST | `/api/contacts` | List / Submit contact message |
| PUT/DELETE | `/api/contacts/:id` | Update status / Delete message |
| GET/POST | `/api/assignments` | List / Create assignments |
| PUT/DELETE | `/api/assignments/:id` | Update / Remove assignment |

---

## 🗄️ Database Collections

| Collection | Key Fields | Purpose |
|-----------|-----------|---------| 
| `admins` | name, email, password (hashed), role | Admin login credentials |
| `projects` | title, location, budget, progress, status, milestones | Construction projects |
| `materials` | name, category, stockQuantity, usedQuantity, unitPrice | Material inventory |
| `workers` | name, role, skills, dailyWage, status, assignedProject | Workforce records |
| `suppliers` | companyName, materials[], supplyHistory[] | Supplier information |
| `assignments` | project, worker, role, status | Worker-project assignments |
| `contacts` | name, email, subject, message, status | Contact form submissions |

---

## 📋 Website Pages

| Page | URL | Description |
|------|-----|-------------|
| Home | `/` | Landing with hero, stats, features, and featured projects |
| About | `/about` | Company mission, values, and timeline |
| Projects | `/projects` | All construction projects with filters |
| Project Detail | `/projects/:id` | Full project info, progress, budget & milestones |
| Materials | `/materials` | Stock levels and availability tracking by category |
| Workforce | `/workforce` | Worker cards with roles, skills, and assignments |
| Contact | `/contact` | Contact form with validation and success feedback |

---

## 🔐 Admin Panel Pages

| Page | URL | Features |
|------|-----|---------|
| Login | `/login` | Secure JWT login with password visibility toggle |
| Dashboard | `/dashboard` | KPI cards, charts (bar + pie), stock alerts, quick actions |
| Projects | `/projects` | Full CRUD with modal forms, progress slider, status badges |
| Materials | `/materials` | Stock management, category filtering, reorder levels |
| Workforce | `/workforce` | Worker management + project assignment dropdown |
| Suppliers | `/suppliers` | Supplier CRUD + supply history tracking per supplier |
| Messages | `/contacts` | View full messages, mark as read, delete |

---

## 🔐 Security Features

- JWT token-based authentication (stored in cookie + localStorage)
- bcryptjs password hashing (12 rounds)
- Protected admin routes (localStorage token check)
- Form validation on frontend and backend
- CORS configured for API routes

---

## 📅 Project Info

- **Duration:** 29th May 2026 – 4th June 2026
- **Technology:** Full-Stack Next.js + MongoDB
- **Purpose:** Learning advanced full-stack development, backend API architecture, JWT authentication, and MongoDB schema design

---

## 🧪 Testing the API

You can test all APIs using:
- **Postman** or **Insomnia**
- **Thunder Client** (VS Code extension)
- **curl** command line

Example test flow:
```bash
# 1. Seed the database
curl -X POST http://localhost:3002/api/auth/seed-data

# 2. Login as admin
curl -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@construction.com","password":"admin123456"}'

# 3. Get all projects
curl http://localhost:3002/api/projects

# 4. Get dashboard stats
curl http://localhost:3002/api/dashboard
```
