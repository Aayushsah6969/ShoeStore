# 🚀 Project Guide for Your Shoe e‑Commerce App

Congrats on delivering the project! Here’s a structured guide to help your client set up, run, and maintain the project across **backend**, **frontend**, and **admin** apps.

---

## 🗂️ Project Folders Overview

- **backend**  
  Node.js + Express API, PostgreSQL (Supabase), JWT auth, Brevo email service.

- **frontend**  
  React customer‑facing app with shopping, login, signup, cart & checkout.

- **admin**  
  React dashboard for admin tasks: products, orders, users, stats.

---

## 🛠 Setup & Run Instructions

### 1. Prerequisites

- Node.js v18+ (or current LTS)  
- npm or yarn  
- `.env` files in each folder with environment variables:
  - **backend**: `DATABASE_URL`, `JWT_SECRET`, `BREVO_API_KEY`, `EMAIL_SENDER`, etc.
  - **frontend/admin**: `VITE_API_URL`, etc.

### 2. Start in Development

Open three terminal tabs:

```bash
# Backend (Port 5000)
cd backend
npm install
npm run dev

# Frontend (Port 3000)
cd ../frontend
npm install
npm run dev

# Admin (Port 3001)
cd ../admin
npm install
npm run dev
```

---

## 🗄️ Backend Details

### 📦 Structure

```text
/backend
  /controllers      – route handlers (auth, products, orders, dashboard)
  /routes           – API endpoints
  /db               – Supabase/Postgres pool config
  /services         – Brevo email & password reset service
  /middleware       – auth & validation logic
  .env              – environment variables
```

### ⚙️ Key Features

- Authentication: signup/login with HTTP-only JWT cookie
- Products, Orders, Dashboard stats (products, orders, sales, low stock)
- Password reset via Brevo email service
- Admin‑protected routes

> **Supabase Connection Notes**
>
> The DB is hosted on Supabase. Idle backend → pool connection may break with ECONNRESET. Fix: restart backend with `npm run dev`.

---

## 🛒 Frontend Overview

### 🗂 Structure

```text
/frontend
  /components
  /pages            – e.g. Shop, Cart, ProductDetail 
  /store            – Zustand state management
  /services         – API calls
  /utils            – transformers/helpers
  /types            – TypeScript definitions
  vite.config.js
```

### ✅ Features

- Product grid & detail pages
- Cart, checkout process
- Authentication: login/signup, password reset
- Filters, sorting, wishlist
- Token handling via JWT cookies

---

## 🧑‍💼 Admin App Overview

### 🗂 Structure

```text
/admin
  /components
  /pages            – Dashboard, Products, Orders, Users
  /store            – Zustand admin state & auth
  /services         – Admin API calls
  vite.config.js
```

### ✅ Features

- Dashboard stats: totalProducts, totalOrders, totalSales, lowStock
- CRUD for products & orders
- User management
- Admin authentication

#### 🛡️ Default Admin Panel Credentials

> **Admin Email:** `adminShoe@gmail.com`  
> **Admin Password:** `admin123`

---

## 📝 Client Handoff Steps

1. Clone repo → open each folder in separate tabs
2. Add `.env` files using `.env.sample` as reference
3. Install dependencies and run dev servers in order: backend → frontend → admin
4. Watch for DB idle issues: if idle, restart backend to restore DB connection
5. Test APIs via Postman (you already have exports)
6. Reset emails: Brevo integration works via backend controllers

---

## 🧭 Troubleshooting & Tips

| Issue                  | Fix / Tip                                                                 |
|------------------------|--------------------------------------------------------------------------|
| Supabase idle timeout  | Restart backend (`npm run dev`) to reinit DB pool                         |
| .env file changed      | Restart backend after changes                                             |
| CORS errors            | Ensure frontend/admin origins are allowed in backend `cors()` config      |
| JWT expiry (7 days)    | Tokens are valid for 7 days; after expiry users must re‑login             |
| Email not delivering   | Verify `BREVO_API_KEY` and `EMAIL_SENDER`; check spam/junk folders        |

---

## 📚 Summary & Final Notes

- Backend powers all APIs, connected to Supabase and Brevo
- Frontend serves customers; Admin serves internal users
- Always start backend first, then frontend, then admin
- Monitor Supabase idle disconnections; restart backend as needed
- Use Postman for testing and debugging API endpoints

You’ve built a full-stack solution ready for production. 🎉 If your client needs hosting advice or deployments, let me know!

_End of guide._