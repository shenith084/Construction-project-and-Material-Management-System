# 🔧 Backend API — Construction Management System

Shared REST API server built with **Next.js 16 API Routes** and **MongoDB / Mongoose 9**.  
Serves both the Admin Panel and the public Website.

- **Port:** `http://localhost:3002`
- **Database:** MongoDB (local or Atlas)

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Create environment file

```bash
cp .env.example .env.local
```

Edit `backend/.env.local`:

```env
# Local MongoDB
MONGODB_URI=mongodb://127.0.0.1:27017/construction-db

# OR MongoDB Atlas
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.mongodb.net/construction-db

JWT_SECRET=construction_secret_key_2026_change_in_production
NEXT_PUBLIC_BACKEND_URL=http://localhost:3002
```

### 3. Run the development server

```bash
npm run dev
```

Server starts on **http://localhost:3002**

### 4. Seed demo data (run once)

```bash
curl -X POST http://localhost:3002/api/auth/seed-data
```

**Default admin credentials:**
```
Email:    admin@construction.com
Password: admin123456
```

---

## 📁 Structure

```
backend/
├── app/api/
│   ├── auth/           # login, logout, me, seed, seed-data
│   ├── dashboard/      # Analytics summary
│   ├── projects/       # CRUD + [id]
│   ├── materials/      # CRUD + [id]
│   ├── workers/        # CRUD + [id]
│   ├── suppliers/      # CRUD + [id]
│   ├── contacts/       # Submit + [id]
│   └── assignments/    # CRUD + [id]
├── models/
│   ├── Admin.js        # bcrypt password hashing
│   ├── Project.js      # milestones[], progress tracking
│   ├── Material.js     # auto status (In Stock / Low / Out)
│   ├── Worker.js       # skills[], project assignment ref
│   ├── Supplier.js     # supplyHistory[]
│   ├── Assignment.js   # worker ↔ project link
│   └── Contact.js      # form submissions
├── lib/
│   ├── mongodb.js      # Mongoose connection with caching
│   └── auth.js         # JWT sign / verify / extract
├── proxy.js            # CORS handler (Next.js 16)
└── .env.local          # Environment variables
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | Admin login |
| `POST` | `/api/auth/logout` | Logout |
| `GET` | `/api/auth/me` | Current admin info |
| `POST` | `/api/auth/seed` | Create admin user |
| `POST` | `/api/auth/seed-data` | Seed full demo data |
| `GET` | `/api/dashboard` | Analytics summary |
| `GET/POST` | `/api/projects` | List / Create projects |
| `GET/PUT/DELETE` | `/api/projects/:id` | Single project operations |
| `GET/POST` | `/api/materials` | List / Add materials |
| `GET/PUT/DELETE` | `/api/materials/:id` | Single material operations |
| `GET/POST` | `/api/workers` | List / Add workers |
| `GET/PUT/DELETE` | `/api/workers/:id` | Single worker operations |
| `GET/POST` | `/api/suppliers` | List / Add suppliers |
| `GET/PUT/DELETE` | `/api/suppliers/:id` | Single supplier operations |
| `GET/POST` | `/api/contacts` | List / Submit messages |
| `PUT/DELETE` | `/api/contacts/:id` | Update / Delete message |
| `GET/POST` | `/api/assignments` | List / Create assignments |
| `PUT/DELETE` | `/api/assignments/:id` | Update / Remove assignment |

---

## 📝 Notes

- Uses **Next.js 16 App Router** — not Express.js or Pages Router
- CORS is handled by `proxy.js` (Next.js 16 renamed `middleware` → `proxy`)
- Mongoose models use `mongoose.models.X || mongoose.model(...)` pattern to prevent hot-reload errors
- Material status is auto-calculated via Mongoose `pre('save')` async hook
