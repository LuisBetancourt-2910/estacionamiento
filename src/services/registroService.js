import axios from 'axios';

const API_URL = 'http://localhost:3000/api/registros';

export const registrarEntrada = async (data) => {
    const response = await axios.post(`${API_URL}/entrada`, data);
    return response.data;
};

export const registrarSalida = async (data) => {
    const response = await axios.post(`${API_URL}/salida`, data);
    return response.data;
};

export const obtenerVehiculos = async () => {
    const response = await axios.get(`${API_URL}/activos`);
    return response.data;
};

export const obtenerTarifasDelDia = async () => {
    const response = await axios.get(`${API_URL}/tarifas-dia`);
    return response.data;
};

export const obtenerSalidasDelDia = async () => {
    const response = await axios.get(`${API_URL}/salidas-dia`);
    return response.data;
};