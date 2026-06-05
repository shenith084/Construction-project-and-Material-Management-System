# 🔐 Admin Panel — Construction Management System

Secure admin management panel built with **Next.js 16**.  
Connects to the shared backend API at `localhost:3002`.

- **Port:** `http://localhost:3001`
- **Requires:** Backend running at `http://localhost:3002`

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Create environment file

Create `admin/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3002
```

### 3. Run the development server

```bash
npm run dev
```

Admin panel opens at **http://localhost:3001**

### 4. Login

Make sure the backend is running and seeded, then log in:

```
Email:    admin@construction.com
Password: admin123456
```

> To seed: `curl -X POST http://localhost:3002/api/auth/seed-data`

---

## 📁 Structure

```
admin/
├── app/
│   ├── login/page.js       # JWT login with password toggle
│   ├── dashboard/page.js   # KPI cards, charts, stock alerts
│   ├── projects/page.js    # Full CRUD with modal forms
│   ├── materials/page.js   # Stock management, reorder levels
│   ├── workforce/page.js   # Worker management + project assignment
│   ├── suppliers/page.js   # Supplier CRUD + supply history
│   └── contacts/page.js    # View, mark read, delete messages
├── components/
│   ├── Sidebar.js          # Navigation sidebar + logout
│   └── Header.js           # Page header component
├── lib/
│   └── api.js              # Centralised API client (fetch + auth token)
└── .env.local              # NEXT_PUBLIC_API_URL
```

---

## 🗂️ Pages

| Page | URL | Features |
|------|-----|----------|
| Login | `/login` | JWT authentication, password visibility toggle |
| Dashboard | `/dashboard` | KPI cards, analytics charts, low-stock alerts, quick actions |
| Projects | `/projects` | Create / Edit / Delete — progress slider, status badges |
| Materials | `/materials` | Add / Edit / Delete — stock levels, category, reorder alert |
| Workforce | `/workforce` | Add / Edit / Remove workers, assign to projects |
| Suppliers | `/suppliers` | Supplier CRUD + supply history log per supplier |
| Messages | `/contacts` | View submissions, mark read/unread, delete |

---

## 🔐 Authentication

- JWT token stored in `localStorage` as `admin_token`
- Every protected page checks for the token on mount; redirects to `/login` if missing
- Token is sent as `Authorization: Bearer <token>` header on every API request
- Logout clears `localStorage` and calls `/api/auth/logout`

---

## 📝 Notes

- Admin panel is purely client-side rendered (`'use client'`)
- All data is fetched from the shared backend at `NEXT_PUBLIC_API_URL`
- No direct database connection — all operations go through the backend API
