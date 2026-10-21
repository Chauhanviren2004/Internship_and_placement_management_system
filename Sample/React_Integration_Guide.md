# Intelliplace Frontend Integration Guide

This guide will help you connect your React frontend to the newly built FastAPI backend using Axios.

## 1. Install Axios
If you haven't already, install Axios in your React project:
```bash
npm install axios
```

## 2. Setup Axios Instance with Interceptors
Create a central configuration for axios (e.g., `src/api/axios.js`) so that you don't have to attach the JWT token manually on every request.

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Your FastAPI backend URL
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Automatically attaches token
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
```

## 3. Authentication Hooks or Services

### Login Function
FastAPI uses `OAuth2PasswordRequestForm` under the hood for our `/auth/login` route. This means it expects parameters as `application/x-www-form-urlencoded` instead of standard JSON.

```javascript
import api from './api/axios';

const loginUser = async (email, password) => {
  try {
    const formData = new URLSearchParams();
    formData.append('username', email); // Backend expects the field to be called 'username'
    formData.append('password', password);

    const response = await api.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    // Save token to localStorage
    localStorage.setItem('token', response.data.access_token);
    return response.data;
  } catch (error) {
    console.error("Login failed:", error.response?.data?.detail);
    throw error;
  }
};
```

### Register Function
The register endpoint uses standard JSON.
```javascript
import api from './api/axios';

const registerUser = async (email, fullName, password, role) => {
  try {
    const response = await api.post('/auth/register', {
      email,
      full_name: fullName,
      password,
      role // 'student', 'company', or 'admin'
    });
    return response.data;
  } catch (error) {
    console.error("Registration failed:", error.response?.data?.detail);
    throw error;
  }
};
```

## 4. Protected Routes Example (Get My Profile)
Because we use Axios interceptors (Step 2), the token is sent automatically when you fetch `/users/me`.

```javascript
import api from './api/axios';

const getCurrentUser = async () => {
    try {
        const response = await api.get('/users/me');
        return response.data; // Includes user id, email, full_name, role
    } catch (error) {
        console.error("Error fetching user data", error);
        throw error;
    }
}
```

## 5. File Uploads (Resumes)
```javascript
import api from './api/axios';

const uploadResume = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/resumes/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      } // Axios handles boundary creation automatically
    });
    return response.data;
  } catch (error) {
    console.error("Failed to upload resume", error.response?.data?.detail);
    throw error;
  }
};
```

## Next Steps
1. Navigate to the backend folder: `cd backend`
2. Install dependencies: `pip install -r requirements.txt`
3. Configure the `.env` file with your **MongoDB Atlas URL** and a robust **JWT Secret Key**.
4. Run the server: `uvicorn main:app --reload`
5. Visit `http://localhost:8000/docs` in your browser to view the interactive OpenAPI documentation where you can test the APIs natively without a frontend!
