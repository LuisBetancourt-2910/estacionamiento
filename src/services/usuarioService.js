import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth'; 

export const registrarUsuario = async (usuario) => {
  const response = await axios.post(`${API_URL}/register`, usuario);
  return response.data;
};
