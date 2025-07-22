import axios from 'axios';

const API_URL = 'http://localhost:3333/api/auth';

export const register = async (email: string, username: string, password: string) => {
  const res = await axios.post(`${API_URL}/register`, { email, username, password });
  return res.data;
};

export const login = async (email: string, password: string) => {
  const res = await axios.post(`${API_URL}/login`, { email, password });
  const token = res.data.token;
  localStorage.setItem('token', token);
  return res.data;
};

export const getMe = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found');

  const res = await axios.get(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return res.data;
};

export const logout = () => {
  localStorage.removeItem('token');
};