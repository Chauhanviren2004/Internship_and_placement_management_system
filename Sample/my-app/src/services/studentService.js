import api from "../api";


import api from "../api";

export const LoginStudent = async (credentials) => {
  const response = await api.post("/student/login", credentials);
  return response.data; // This usually contains the token
};

export const getStudentProfile = async (studentId) => {
  const response = await api.get(`/student/profile/${studentId}`);
  return response.data;
};



// Call register student API
export const registerStudent = (data) => api.post("/student/register", data);

// Call login API
export const loginStudent = (data) => api.post("/student/login", data);

// Get all students
export const getAllStudents = () => api.get("/student/getall");

// Get profile by id
export const getProfile = (id) => api.get(`/student/profile/${id}`);






