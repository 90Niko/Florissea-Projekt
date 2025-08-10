// src/services/authService.js
import axios from 'axios';

const API_URL = 'https://example.com/api/auth'; // смени с твоя бекенд URL

export async function login(email, password) {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data; // тук можеш да върнеш токен или user данни
  }
  catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
}

export async function register(userData) {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  }
  catch (error) {
    throw error.response?.data || { message: 'Registration failed' };
  }
}
