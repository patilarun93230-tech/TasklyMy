# 🚀 Taskly - Premium MERN Stack Task Tracker

Taskly is a modern, full-stack Task Tracker web application built using the MERN Stack (MongoDB, Express.js, React.js, Node.js). It provides a professional task management experience with authentication, analytics, filtering, sorting, and a responsive dashboard inspired by modern productivity tools.

## ✨ Features

### 🔐 Authentication

* User Registration
* User Login
* JWT Authentication
* Protected Routes
* Logout Functionality
* Password Encryption using bcrypt

### 📝 Task Management

* Create Tasks
* View Tasks
* Update Tasks
* Delete Tasks
* Dynamic Updates without Page Refresh
* Task Categories
* Task Priorities
* Task Status Management
* Due Dates

### 🔍 Advanced Features

* Search Tasks
* Filter by Status
* Filter by Category
* Filter by Priority
* Sort Tasks
* Pagination
* Dashboard Analytics
* Loading Skeletons
* Delete Confirmation Dialog
* Toast Notifications
* Dark/Light Theme
* Responsive Design

---

## 🛠 Tech Stack

### Frontend

* React.js (Vite)
* Material UI
* React Router DOM
* Axios
* React Toastify
* Chart.js

### Backend

* Node.js
* Express.js
* JWT Authentication
* bcryptjs

### Database

* MongoDB
* Mongoose

---

## 📁 Project Structure

```bash
mern-task-tracker/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── services/
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/patilarun93230-tech/TasklyMy.git
cd TasklyMy
```

---

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Start backend:

```bash
npm run dev
```

Backend runs on:

```bash
http://localhost:5000
```

---

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

Start frontend:

```bash
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

## 🔗 REST API Endpoints

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Tasks

```http
GET    /api/tasks
GET    /api/tasks/:id
POST   /api/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id
GET    /api/tasks/stats
```

---

## 🚀 Deployment

### Backend

* Render
* Railway

### Frontend

* Netlify
* Vercel

### Database

* MongoDB Atlas

---

## 📸 Features Included

✅ JWT Authentication
✅ CRUD Operations
✅ Search & Filter
✅ Pagination
✅ Dashboard Analytics
✅ Responsive Design
✅ Dark/Light Mode
✅ Toast Notifications
✅ Loading States
✅ Protected Routes

---

## 👨‍💻 Author

**Arun Patil**

* GitHub: https://github.com/patilarun93230-tech
* LinkedIn: https://www.linkedin.com/in/patilarun011

---

## 📄 License

This project is developed for educational and internship assessment purposes.
