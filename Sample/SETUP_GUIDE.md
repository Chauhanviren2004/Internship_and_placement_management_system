# HireHub Setup Guide

## What I changed

### Backend
- Connected FastAPI backend to MongoDB using `motor`
- Added working APIs for:
  - student/company/admin registration and login
  - profile fetch and update
  - internship/job posting
  - student job applications
  - company application review and shortlist/reject
  - feedback
  - messages
  - resume upload

### Frontend
- Connected React frontend to backend using Axios
- Added shared API config
- Added JWT storage in `localStorage`
- Added safe auth/session handling
- Added role-based navbar and dashboard redirects
- Added error handling for:
  - backend not running
  - API failures
  - invalid responses

---

## Important files

### Backend
- `backend/main.py`
- `backend/core/config.py`
- `backend/db/database.py`
- `backend/api/routes/auth.py`
- `backend/api/routes/users.py`
- `backend/api/routes/jobs.py`
- `backend/api/routes/applications.py`
- `backend/api/routes/communications.py`

### Frontend
- `my-app/src/api.js`
- `my-app/src/auth.js`
- `my-app/src/AppRoutes/AppRoutes.jsx`
- `my-app/src/Login.jsx`
- `my-app/src/Register.jsx`
- `my-app/src/Navbar.jsx`

---

## Backend .env

Create or update:

`backend/.env`

```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=hirehub
SECRET_KEY=replace_with_your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
FRONTEND_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

If using MongoDB Atlas:

```env
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
DATABASE_NAME=hirehub
SECRET_KEY=replace_with_your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
FRONTEND_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

---

## Frontend .env

Create:

`my-app/.env`

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

---

## Run backend

```powershell
cd C:\Users\khushi\Downloads\Sample\backend
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend URL:

```txt
http://127.0.0.1:8000
```

Swagger docs:

```txt
http://127.0.0.1:8000/docs
```

---

## Run frontend

```powershell
cd C:\Users\khushi\Downloads\Sample\my-app
npm install
npm run dev
```

Frontend URL:

```txt
http://localhost:5173
```

---

## Auth storage

The frontend stores login session in `localStorage` using:
- `hirehub_auth`
- `token`
- `user`

Logout clears all of them safely.

---

## API routes

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Users
- `GET /api/users/me`
- `PUT /api/users/me/profile`
- `GET /api/users?role=student`

### Jobs
- `GET /api/jobs/public`
- `GET /api/jobs`
- `POST /api/jobs`
- `PATCH /api/jobs/{job_id}/status`

### Applications
- `POST /api/applications/jobs/{job_id}`
- `GET /api/applications/mine`
- `GET /api/applications/received`
- `PATCH /api/applications/{application_id}/status`

### Messages / Feedback
- `GET /api/communications/messages`
- `POST /api/communications/messages`
- `GET /api/communications/feedback`
- `POST /api/communications/feedback`
- `POST /api/communications/public-feedback`

### Resume
- `POST /api/resumes/upload`
- `GET /api/resumes/my-resume`

---

## Verification done

### Backend
- Python import check passed

### Frontend
- Production build passed with:

```powershell
npm run build
```

---

## If you want to change something

### Backend changes
- Update routes inside `backend/api/routes/`
- Update schemas inside `backend/schemas/`
- Update Mongo config in `backend/core/config.py`

### Frontend changes
- Update API base URL in `my-app/src/api.js`
- Update auth/session logic in `my-app/src/auth.js`
- Update pages inside `my-app/src/Student/`, `my-app/src/Company/`, and `my-app/src/College/`

---

## Note

Everything is wired, but make sure:
- MongoDB is running or Atlas URL is correct
- backend `.env` is correct
- frontend `.env` points to FastAPI

