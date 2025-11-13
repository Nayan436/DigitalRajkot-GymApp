import API from './api';

export const login = async (username: string, password: string) => {
  const { data } = await API.post('/auth/login', { username, password });
  localStorage.setItem('token', data.token);
  return data;
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const getToken = () => localStorage.getItem('token');
