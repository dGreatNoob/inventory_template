import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    // Add any default headers here
  },
  // You can add withCredentials: true if you use cookies for auth
});

export default api; 