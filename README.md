# Trendify | Modern E-Commerce Application

A fully responsive, high-end e-commerce application built with a **Python (Django)** backend and a **React.js** frontend, incorporating **PostgreSQL**, REST APIs, **JWT Authentication**, and **Razorpay** payment integrations.

## 🚀 Features

- **Responsive UX/UI**: Beautiful fluid design with Outfit typography, custom scrollbars, animations, and four active color themes (Ocean, Sunset, Forest, Midnight).
- **Authentication**: Secure JWT-based signup and login. Includes email format validations (`@gmail.com`) and phone/name uniqueness.
- **Product Catalog**: Over 40 items across Electronics, Clothing, and Books, complete with search, category filtering, price range boundaries, and sorting.
- **Shopping Cart**: Real-time persistent cart stored server-side per authenticated user.
- **Razorpay Integration**: Clean checkout overlay dialogs and signature verification, with developer mock fallbacks.
- **Order Tracking**: Historic paid orders are committed to the database and listed on the User Profile screen.

---

## 🛠️ Tech Stack

- **Backend**: Python 3.x, Django, Django REST Framework, SimpleJWT, Razorpay SDK, Django Environ
- **Database**: PostgreSQL (with automatic SQLite fallback for simple offline development)
- **Frontend**: React.js, Vite, Vanilla CSS

---

## 💻 Setup and Installation

### 1. Django Backend

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Create a `.env` file (a template `.env` is provided in `backend/.env`) and customize credentials if desired.

4. Generate database migrations and migrate:
   ```bash
   python manage.py makemigrations api
   python manage.py migrate
   ```

5. Seed the database with the 40 default products:
   ```bash
   python manage.py seed_db
   ```

6. Start the backend server:
   ```bash
   python manage.py runserver
   ```
   The backend API will run on `http://localhost:8000`.

---

### 2. React Frontend

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install packages:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`.
