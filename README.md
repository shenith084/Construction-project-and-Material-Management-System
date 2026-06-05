# 🏗️ Construction Project & Material Management System

A full-stack construction management platform built with **Next.js 16**, **MongoDB**, and **CSS / Tailwind CSS**.  
Developed as a practical full-stack learning project — **29th May 2026 – 4th June 2026**.

---

## 🌐 System Overview

| App | Description | Port |
|-----|-------------|------|
| `website/` | Public-facing construction portal | `localhost:3000` |
| `admin/` | Admin management panel | `localhost:3001` |
| `backend/` | Shared REST API + MongoDB | `localhost:3002` |

All three applications share the same backend API and MongoDB database.

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or MongoDB Atlas)
- npm

---

### 1. Clone & Install

```bash
# Install backend dependencies
cd backend
npm install

# Install admin panel dependencies
cd ../admin
npm install

# Install website dependencies
cd ../website
npm install
```

---

### 2. Environment Setup

Copy the example env file and fill in your values:

```bash
cp backend/.env.example backend/.env.local
```

**`backend/.env.local`:**
```env
# Local MongoDB
MONGODB_URI=mongodb://127.0.0.1:27017/construction-db

# OR MongoDB Atlas
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.mongodb.net/construction-db?retryWrites=true&w=majority

# JWT Secret (change in production)
JWT_SECRET=construction_secret_key_2026_change_in_production

# Backend URL (used by admin & website)
NEXT_PUBLIC_BACKEND_URL=http://localhost:3002
```

**`admin/.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3002
```

**`website/.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3002
```

---

### 3. Run All Apps

**Option A — One command (Windows):**
```bash
start_system.bat
```

**Option B — Three separate terminals:**

```bash
# Terminal 1 – Backend API (Port 3002)
cd backend && npm run dev

# Terminal 2 – Admin Panel (Port 3001)
cd admin && npm run dev

# Terminal 3 – Website (Port 3000)
cd website && npm run dev
```

---

### 4. Seed Demo Data

After the backend starts, seed the database **once**:

```bash
# Full demo dataset (recommended)
curl -X POST http://localhost:3002/api/auth/seed-data

# Admin user only
curl -X POST http://localhost:3002/api/auth/seed
```

**Default Admin Login:**
```
Email:    admin@construction.com
Password: admin123456
```

**Seeded records include:**
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
| Frontend (Website) | Next.js 16 — App Router |
| Frontend (Admin) | Next.js 16 — App Router |
| Backend | Next.js 16 API Routes |
| Database | MongoDB + Mongoose 9 |
| Styling | Tailwind CSS v4 + Custom CSS |
| Authentication | JWT (`jsonwebtoken`) + `bcryptjs` |
| Icons | Lucide React |

---

## 📁 Project Structure

```
Construction Project & Material Management System/
│
├── backend/                        # Shared REST API + MongoDB models (Port 3002)
│   ├── app/api/
│   │   ├── auth/                   # login, logout, me, seed, seed-data
│   │   ├── dashboard/              # Analytics summary endpoint
│   │   ├── projects/               # CRUD + [id] dynamic routes
│   │   ├── materials/              # CRUD + [id] dynamic routes
│   │   ├── workers/                # CRUD + [id] dynamic routes
│   │   ├── suppliers/              # CRUD + [id] dynamic routes
│   │   ├── contacts/               # Submit + [id] dynamic routes
│   │   └── assignments/            # CRUD + [id] dynamic routes
│   ├── models/
│   │   ├── Admin.js                # Admin user with bcrypt password hashing
│   │   ├── Project.js              # Projects with milestones array
│   │   ├── Material.js             # Materials with auto status calculation
│   │   ├── Worker.js               # Workers with skills and assignment ref
│   │   ├── Supplier.js             # Suppliers with supply history
│   │   ├── Assignment.js           # Worker ↔ project assignments
│   │   └── Contact.js              # Contact form submissions
│   ├── lib/
│   │   ├── mongodb.js              # Mongoose connection with hot-reload caching
│   │   └── auth.js                 # JWT sign / verify / extract utilities
│   ├── proxy.js                    # CORS proxy (Next.js 16 — replaces middleware)
│   └── .env.local                  # MongoDB URI + JWT Secret
│
├── admin/                          # Admin management panel (Port 3001)
│   ├── app/
│   │   ├── login/page.js           # JWT login with password toggle
│   │   ├── dashboard/page.js       # KPI cards, charts, stock alerts
│   │   ├── projects/page.js        # Full project CRUD with modal forms
│   │   ├── materials/page.js       # Material stock management
│   │   ├── workforce/page.js       # Workers + project assignment
│   │   ├── suppliers/page.js       # Supplier CRUD + supply history
│   │   └── contacts/page.js        # View, mark read, delete messages
│   ├── components/
│   │   ├── Sidebar.js              # Navigation sidebar + logout
│   │   └── Header.js               # Page header component
│   └── lib/api.js                  # Centralised API client (fetch wrapper)
│
└── website/                        # Public website (Port 3000)
    ├── app/
    │   ├── page.js                 # Home — hero, stats, features, projects
    │   ├── about/page.js           # About — mission, values, timeline
    │   ├── projects/
    │   │   ├── page.js             # All projects listing with filters
    │   │   └── [id]/page.js        # Project detail — progress, milestones
    │   ├── materials/page.js       # Stock levels and availability by category
    │   ├── workforce/page.js       # Worker cards with roles and skills
    │   └── contact/page.js         # Contact form with validation
    ├── components/
    │   ├── Navbar.js               # Responsive navigation bar
    │   └── Footer.js               # Footer with links
    └── lib/api.js                  # Website API client
```

---

## 🔌 API Endpoints

All endpoints are served from `http://localhost:3002`.

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | Admin login — returns JWT token |
| `POST` | `/api/auth/logout` | Clear auth cookie |
| `GET` | `/api/auth/me` | Get current admin user info |
| `POST` | `/api/auth/seed` | Create first admin user |
| `POST` | `/api/auth/seed-data` | Seed full demo dataset |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/dashboard` | Analytics summary (counts, charts data) |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/projects` | List all projects (supports `?status=` filter) |
| `POST` | `/api/projects` | Create a new project |
| `GET` | `/api/projects/:id` | Get a single project |
| `PUT` | `/api/projects/:id` | Update project |
| `DELETE` | `/api/projects/:id` | Delete project |

### Materials
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/materials` | List all materials (supports `?status=`, `?category=`) |
| `POST` | `/api/materials` | Add a new material |
| `GET` | `/api/materials/:id` | Get a single material |
| `PUT` | `/api/materials/:id` | Update material |
| `DELETE` | `/api/materials/:id` | Delete material |

### Workers
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/workers` | List all workers (supports `?status=` filter) |
| `POST` | `/api/workers` | Add a new worker |
| `GET` | `/api/workers/:id` | Get a single worker |
| `PUT` | `/api/workers/:id` | Update worker |
| `DELETE` | `/api/workers/:id` | Delete worker |

### Suppliers
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/suppliers` | List all suppliers |
| `POST` | `/api/suppliers` | Add a new supplier |
| `GET` | `/api/suppliers/:id` | Get a single supplier |
| `PUT` | `/api/suppliers/:id` | Update supplier |
| `DELETE` | `/api/suppliers/:id` | Delete supplier |

### Contacts
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/contacts` | List all contact submissions |
| `POST` | `/api/contacts` | Submit contact form |
| `PUT` | `/api/contacts/:id` | Update message status (read/unread) |
| `DELETE` | `/api/contacts/:id` | Delete message |

### Assignments
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/assignments` | List all worker-project assignments |
| `POST` | `/api/assignments` | Create a new assignment |
| `PUT` | `/api/assignments/:id` | Update assignment |
| `DELETE` | `/api/assignments/:id` | Remove assignment |

---

## 🗄️ Database Collections

| Collection | Key Fields | Purpose |
|------------|-----------|---------|
| `admins` | name, email, password (hashed), role | Admin login credentials |
| `projects` | title, location, budget, progress, status, milestones[] | Construction projects |
| `materials` | name, category, unit, stockQuantity, usedQuantity, unitPrice, status | Material inventory |
| `workers` | name, role, skills[], dailyWage, status, assignedProject | Workforce records |
| `suppliers` | companyName, contact, materials[], supplyHistory[] | Supplier information |
| `assignments` | project, worker, role, startDate, status | Worker ↔ project assignments |
| `contacts` | name, email, subject, message, status | Contact form submissions |

---

## 📋 Website Pages

| Page | URL | Description |
|------|-----|-------------|
| Home | `/` | Hero section, stats, features, featured projects |
| About | `/about` | Company mission, values, and project timeline |
| Projects | `/projects` | All construction projects with status filters |
| Project Detail | `/projects/:id` | Full project info, progress bar, milestones |
| Materials | `/materials` | Stock levels, availability, category breakdown |
| Workforce | `/workforce` | Worker cards with roles, skills, and assignments |
| Contact | `/contact` | Contact form with validation and success feedback |

---

## 🔐 Admin Panel Pages

| Page | URL | Features |
|------|-----|----------|
| Login | `/login` | JWT login, password visibility toggle |
| Dashboard | `/dashboard` | KPI cards, analytics charts, stock alerts, quick actions |
| Projects | `/projects` | Create / Edit / Delete projects, progress slider, status badges |
| Materials | `/materials` | Add / Edit / Delete materials, stock tracking, reorder levels |
| Workforce | `/workforce` | Add / Edit / Remove workers, assign to projects |
| Suppliers | `/suppliers` | Supplier CRUD + supply history log per supplier |
| Messages | `/contacts` | View submissions, mark read/unread, delete messages |

---

## 🔐 Security

- JWT token authentication (stored in `localStorage`)
- `bcryptjs` password hashing (12 salt rounds)
- Protected admin routes — redirect to login if no token
- CORS configured via `proxy.js` (Next.js 16 standard)
- Frontend and backend form validation

---

## 🧪 Testing the API

Use **Postman**, **Insomnia**, **Thunder Client** (VS Code), or `curl`:

```bash
# 1. Seed the database
curl -X POST http://localhost:3002/api/auth/seed-data

# 2. Login and get a token
curl -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@construction.com","password":"admin123456"}'

# 3. Fetch all projects
curl http://localhost:3002/api/projects

# 4. Add a material
curl -X POST http://localhost:3002/api/materials \
  -H "Content-Type: application/json" \
  -d '{"name":"Portland Cement","category":"Cement","unit":"bag","stockQuantity":500,"unitPrice":12.5}'

# 5. Get dashboard stats
curl http://localhost:3002/api/dashboard
```

---

## 📅 Project Info

| | |
|-|-|
| **Project Name** | Construction Project & Material Management System |
| **Duration** | 29th May 2026 – 4th June 2026 |
| **Type** | Full-Stack Web Application |
| **Purpose** | Learning full-stack development, REST API design, JWT auth, MongoDB schema design |

---

## 📝 Notes

- The backend uses **Next.js 16 App Router API Routes** — not Express.js
- CORS is handled via `backend/proxy.js` (Next.js 16 renamed `middleware` → `proxy`)
- Mongoose model caching (`mongoose.models.X || mongoose.model(...)`) prevents duplicate model errors during hot reloads
- Material status (`In Stock` / `Low Stock` / `Out of Stock`) is automatically calculated in the Mongoose `pre('save')` hook
- All three apps must run simultaneously for full functionality
