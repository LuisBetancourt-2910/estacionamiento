import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth'; 

export const registrarUsuario = async (usuario) => {
  const response = await axios.post(`${API_URL}/register`, usuario);
  return response.data;
};

export const obtenerUsuarios = async () => {
  const response = await axios.get('http://localhost:3000/api/auth/users');
  return response.data;
};

export const eliminarUsuario = async (username) => {
  const response = await axios.delete(`${API_URL}/register/${username}`);
  return response.data;
};