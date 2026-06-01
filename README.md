# Construction Project & Material Management System

A full-stack construction management platform built with **Next.js**, **MongoDB**, and **Tailwind CSS**.

---

## 🏗️ System Overview

| App | Description | Port |
|-----|-------------|------|
| `website/` | Public-facing portal | `localhost:3000` |
| `admin/` | Admin management panel | `localhost:3001` |
| `backend/` | Shared REST API | `localhost:3002` |

---

## 🚀 Quick Start

### 1. MongoDB Setup
Set your MongoDB URI in `backend/.env.local`:
```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.mongodb.net/construction-db
JWT_SECRET=your_secret_key_here
```

### 2. Install & Run All Apps

Open **3 separate terminals**:

**Terminal 1 – Backend (Port 3002):**
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

### 3. Seed Admin User
After the backend starts, run this **once** to create the default admin:
```
POST http://localhost:3002/api/auth/seed
```

Or visit: `http://localhost:3002/api/auth/seed` in browser (use Postman/Insomnia).

**Default Admin Credentials:**
```
Email:    admin@construction.com
Password: admin123456
```

---

## 📦 Tech Stack

| Category | Technology |
|----------|-----------|
| Frontend (Website) | Next.js 16 (App Router) |
| Frontend (Admin) | Next.js 16 (App Router) |
| Backend | Next.js 16 API Routes |
| Database | MongoDB + Mongoose |
| Styling | Tailwind CSS v4 |
| Authentication | JWT + bcryptjs |
| Charts | Recharts |
| Icons | Lucide React |

---

## 📁 Project Structure

```
Construction Project & Material Management System/
├── backend/          # Shared API + MongoDB models
│   ├── app/api/      # API routes (auth, projects, materials, workers, suppliers, contacts, dashboard)
│   ├── models/       # Mongoose models (Admin, Project, Material, Worker, Supplier, Assignment, Contact)
│   ├── lib/          # MongoDB connection + JWT utilities
│   └── .env.local    # MongoDB URI + JWT Secret
│
├── admin/            # Admin management panel (port 3001)
│   ├── app/          # Pages: login, dashboard, projects, materials, workforce, suppliers, contacts
│   ├── components/   # Sidebar, Header
│   └── lib/          # API client
│
└── website/          # Public website (port 3000)
    ├── app/          # Pages: home, about, projects, materials, workforce, contact
    ├── components/   # Navbar, Footer
    └── lib/          # API client
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin login |
| POST | `/api/auth/logout` | Admin logout |
| GET | `/api/auth/me` | Get current admin |
| POST | `/api/auth/seed` | Create first admin (run once) |
| GET | `/api/dashboard` | Analytics summary |
| GET/POST | `/api/projects` | List / Create projects |
| GET/PUT/DELETE | `/api/projects/:id` | Get / Update / Delete project |
| GET/POST | `/api/materials` | List / Add materials |
| GET/PUT/DELETE | `/api/materials/:id` | Get / Update / Delete material |
| GET/POST | `/api/workers` | List / Add workers |
| GET/PUT/DELETE | `/api/workers/:id` | Get / Update / Delete worker |
| GET/POST | `/api/suppliers` | List / Add suppliers |
| GET/PUT/DELETE | `/api/suppliers/:id` | Get / Update / Delete supplier |
| GET/POST | `/api/contacts` | List / Submit contact |
| PUT/DELETE | `/api/contacts/:id` | Update / Delete contact |
| GET/POST | `/api/assignments` | List / Create assignments |
| DELETE | `/api/assignments/:id` | Remove assignment |

---

## 🗄️ Database Collections

| Collection | Purpose |
|-----------|---------|
| `admins` | Admin login credentials |
| `projects` | Construction projects |
| `materials` | Construction materials stock |
| `workers` | Workforce records |
| `suppliers` | Supplier information |
| `assignments` | Worker-project assignments |
| `contacts` | Contact form submissions |

---

## 📋 Website Pages

| Page | URL | Description |
|------|-----|-------------|
| Home | `/` | Landing with hero, features, projects |
| About | `/about` | Company mission, values, timeline |
| Projects | `/projects` | All construction projects |
| Project Detail | `/projects/:id` | Full project info with milestones |
| Materials | `/materials` | Stock & availability tracking |
| Workforce | `/workforce` | Worker cards with roles & skills |
| Contact | `/contact` | Contact form with validation |

---

## 🔐 Admin Panel Pages

| Page | URL | Features |
|------|-----|---------|
| Login | `/login` | Secure JWT login |
| Dashboard | `/dashboard` | Stats, charts, recent projects |
| Projects | `/projects` | Full CRUD with modal forms |
| Materials | `/materials` | Stock management |
| Workforce | `/workforce` | Worker + project assignment |
| Suppliers | `/suppliers` | Supplier & supply history |
| Messages | `/contacts` | View, mark read, delete |

---

## 📅 Project Info

- **Duration:** 29th May 2026 – 4th June 2026
- **Technology:** Full-Stack Next.js + MongoDB
- **Purpose:** Learning advanced full-stack development, backend API architecture, authentication, and database management
