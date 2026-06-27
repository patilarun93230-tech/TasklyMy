# Taskly - Premium MERN Stack Task Tracker

Taskly is a production-ready, highly aesthetic, and responsive Task Tracker application built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js) and styled using **Material UI**.

Featuring a dashboard similar to Notion/Trello, it supports user registration/login, JWT authentication, dark/light theme options, real-time analytics graphs, dynamic CRUD task updates without refreshing, search debouncing, advanced multi-filter matching, custom priority sorting, loading skeletons, and confirmations for delete triggers.

---

## Project Structure

```text
mern-task-tracker/
├── backend/
│   ├── config/db.js              # Database connection
│   ├── controllers/              # Request controllers (auth, task)
│   ├── middleware/authMiddleware # Route protector
│   ├── models/                   # Schemas (User, Task)
│   ├── routes/                   # Routing configuration
│   ├── server.js                 # App Entrypoint
│   ├── .env.example              # Env configuration template
│   └── package.json              # Backend dependencies
└── frontend/
    ├── src/
    │   ├── components/           # Reusable controls (Navbar, Sidebar, TaskCard, TaskForm, etc.)
    │   ├── context/              # Authentication & Theme state
    │   ├── pages/                # Views (Dashboard, Profile, Login, Register, Edit, Create, NotFound)
    │   ├── services/api.js       # Axios base instance with automatic headers
    │   ├── App.jsx               # Navigation route manager
    │   ├── index.css             # Resets and animations
    │   └── main.jsx              # Virtual DOM mount point
    ├── index.html                # App wrapper with SEO and fonts
    ├── vite.config.js            # Build and development proxy settings
    ├── .env.example              # Env configuration template
    └── package.json              # Frontend dependencies
```

---

## Installation & Setup

Ensure you have [Node.js](https://nodejs.org/) installed (v18.0.0 or higher) and [MongoDB](https://www.mongodb.com/) running locally (or have a MongoDB Atlas URI ready).

### 1. Clone or Open Project
Navigate to the root project directory:
```bash
cd mern-task-tracker
```

### 2. Configure Backend
```bash
# Go to backend folder
cd backend

# Install dependencies
npm install

# Setup env variables
cp .env.example .env
```
Open the `.env` file and configure it:
```ini
PORT=5000
MONGO_URI=mongodb://localhost:27017/task-tracker
JWT_SECRET=supersecretjwtkey12345!@#
```

### 3. Configure Frontend
```bash
# Go to frontend folder
cd ../frontend

# Install dependencies
npm install

# Setup env variables
cp .env.example .env
```
Open the `.env` file and configure the target API:
```ini
VITE_API_URL=/api
```
*(In development, Vite proxies `/api` calls directly to `http://localhost:5000` to avoid CORS issues).*

---

## Running the Application Locally

To start the full stack application, you need to run both servers concurrently.

### Run Backend
From the `backend/` directory:
```bash
# Start server in watch/dev mode
npm run dev
```
*(The backend API will start listening on `http://localhost:5000`).*

### Run Frontend
From the `frontend/` directory:
```bash
# Start client dev server
npm run dev
```
*(Open your browser at `http://localhost:3000` to interact with the application).*

---

## Environment Variables

### Backend (`backend/.env`)
| Variable | Description | Default Value |
| :--- | :--- | :--- |
| `PORT` | The port the Node.js server listens on | `5000` |
| `MONGO_URI` | The connection URI to your MongoDB database | `mongodb://localhost:27017/task-tracker` |
| `JWT_SECRET` | Secret key used to sign and verify JSON Web Tokens | *Generate a secure key* |

### Frontend (`frontend/.env`)
| Variable | Description | Value |
| :--- | :--- | :--- |
| `VITE_API_URL` | Base path/address of the backend REST APIs | `/api` |

---

## Deployment Instructions

### Backend Deployment (Render or Railway)

#### Render Setup:
1. Create a Web Service pointing to your repository.
2. Set **Root Directory** to `backend`.
3. Set **Build Command** to `npm install`.
4. Set **Start Command** to `node server.js` (or `npm start`).
5. Under **Environment Variables**, define:
   - `MONGO_URI` (pointing to MongoDB Atlas connection string)
   - `JWT_SECRET` (your JWT signature key)
   - `NODE_ENV` to `production`

#### Railway Setup:
1. Link your repo and click **New Project** -> **Deploy from GitHub repo**.
2. Go to **Settings** -> **Root Directory** and set to `/backend`.
3. Define the same variables (`MONGO_URI`, `JWT_SECRET`) in the **Variables** tab.
4. Deploy the service.

---

### Frontend Deployment (Netlify or Vercel)

Ensure your frontend knows the absolute production URL of your backend. During build, configure `VITE_API_URL` to point directly to your deployed backend (e.g. `https://task-tracker-backend.onrender.com/api`).

#### Netlify Setup:
1. Click **Add new site** -> **Import an existing project**.
2. Select your repository.
3. Configure the build parameters:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `frontend/dist`
4. Set **Environment Variables** in Netlify dashboard:
   - `VITE_API_URL` = `https://your-backend-url.com/api`
5. In the `frontend/public` folder or `frontend/dist` folder, you might need a `_redirects` file with `/* /index.html 200` to support React Router refresh. (Vite outputs index.html directly; Netlify redirects resolve navigation mismatches).

#### Vercel Setup:
1. Click **Add New** -> **Project** in Vercel.
2. Select your repository.
3. Configure settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add **Environment Variables**:
   - `VITE_API_URL` = `https://your-backend-url.com/api`
5. Click **Deploy**. Vercel natively handles SPA routing fallbacks if configured via a `vercel.json` rewrite file in the root.
