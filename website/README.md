# 🌐 Website — Construction Management System

Public-facing construction management portal built with **Next.js 16**.  
Displays live project data, materials, and workforce info from the shared backend API.

- **Port:** `http://localhost:3000`
- **Requires:** Backend running at `http://localhost:3002`

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Create environment file

Create `website/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3002
```

### 3. Run the development server

```bash
npm run dev
```

Website opens at **http://localhost:3000**

> Make sure the backend is running and seeded with demo data before visiting.  
> Seed command: `curl -X POST http://localhost:3002/api/auth/seed-data`

---

## 📁 Structure

```
website/
├── app/
│   ├── page.js             # Home — hero, stats, features, featured projects
│   ├── about/page.js       # About — mission, values, timeline
│   ├── projects/
│   │   ├── page.js         # All projects with status filters
│   │   └── [id]/page.js    # Project detail — progress, milestones, resources
│   ├── materials/page.js   # Stock levels and availability by category
│   ├── workforce/page.js   # Worker cards with roles and skills
│   ├── contact/page.js     # Contact form with validation
│   ├── globals.css         # Global styles
│   └── layout.js           # Root layout (Navbar + Footer)
├── components/
│   ├── Navbar.js           # Responsive navigation bar
│   └── Footer.js           # Footer with links
├── lib/
│   └── api.js              # API client (fetch wrapper for backend)
└── .env.local              # NEXT_PUBLIC_API_URL
```

---

## 🗂️ Pages

| Page | URL | Description |
|------|-----|-------------|
| Home | `/` | Hero section, project statistics, features overview, featured projects |
| About | `/about` | Company mission, core values, and project timeline |
| Projects | `/projects` | All construction projects with status filter and progress bars |
| Project Detail | `/projects/:id` | Full project info — description, budget, progress, milestones |
| Materials | `/materials` | Material stock levels, usage, availability status by category |
| Workforce | `/workforce` | Worker cards showing role, skills, and assigned project |
| Contact | `/contact` | Contact form with validation, saves to database |

---

## 🔗 API Integration

The website reads data from the backend API. No authentication required for public pages.

| Data | Endpoint |
|------|----------|
| Projects list | `GET /api/projects` |
| Project detail | `GET /api/projects/:id` |
| Materials | `GET /api/materials` |
| Workforce | `GET /api/workers` |
| Contact form | `POST /api/contacts` |

---

## 📝 Notes

- All pages fetch data client-side from `NEXT_PUBLIC_API_URL`
- The Contact page saves form submissions to MongoDB via `POST /api/contacts`
- No admin authentication — this is a public-facing read-only portal (except contact form)
- Suppliers page is **not** on the website — suppliers are managed in the Admin Panel only
