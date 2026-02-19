# LibraFlow – Smart Library Management System 📚

A modern, full-stack **Library Management System** built for schools, colleges, or small public libraries.  
Clean UI, role-based access, borrowing/reservation logic, overdue fines, admin dashboard, and responsive design — perfect for college projects or portfolio showcase.

![LibraFlow Dashboard Preview](https://via.placeholder.com/1200x600/1e40af/ffffff?text=LibraFlow+Dashboard+Screenshot)  

## ✨ Features

### For Members / Students
- Browse & search the full book catalog (title, author, ISBN, genre)
- View book details (cover, description, availability)
- Borrow / reserve books
- See borrowed books, due dates, fines (if overdue)
- Renew books (limited attempts)
- Simple profile with borrowing history

### For Librarians / Admins
- Dashboard with key stats (total books, borrowed, overdue, new members)
- Add / edit / delete books (with cover image upload)
- Manage members (view, activate/deactivate, search)
- Issue & return books manually
- View reports: overdue list, most popular books, member activity
- Fine calculation (configurable, e.g. ₹5/day)

### General
- Role-based authentication (Member vs Admin)
- Responsive design (works on phone, tablet, desktop)
- Dark / Light mode toggle
- Search autocomplete & filters
- Loading states, toast notifications, error handling

## 🛠️ Tech Stack

| Layer          | Technology                              |
|----------------|-----------------------------------------|
| Frontend       | Vite + React (TypeScript)               |
| Styling        | Tailwind CSS + shadcn/ui                |
| State / Data   | TanStack Query, Zustand                 |
| Routing        | React Router v6                         |
| Backend        | Node.js + Express                       |
| Database       | PostgreSQL (via Prisma) or SQLite       |
| ORM            | Prisma (type-safe queries & migrations) |
| Auth           | JWT + bcrypt                            |
| Deployment     | Vercel (frontend static + serverless API) |

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js v18+
- npm or yarn
- PostgreSQL (local or Vercel Postgres / Supabase free tier) — or use SQLite for quick testing

### Setup & Run

```bash
# 1. Clone the repo
git clone https://github.com/yourusername/libraflow.git
cd libraflow

# 2. Install backend dependencies
cd backend
npm install

# 3. Install frontend dependencies
cd ../frontend
npm install

# 4. Set up environment variables
# Copy .env.example to .env in both frontend & backend folders
# Update DATABASE_URL (Prisma) and JWT_SECRET

# 5. Initialize & migrate database (backend)
cd ../backend
npx prisma generate
npx prisma migrate dev --name init

# 6. Seed sample data (optional but recommended)
npm run seed

# 7. Start backend
npm start
# → Server running on http://localhost:3001

# 8. Start frontend (in a new terminal)
cd ../frontend
npm run dev
# → Open http://localhost:5173
