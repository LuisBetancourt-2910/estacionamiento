import axios from 'axios';

const API_URL = 'http://localhost:3000/api/tarifas';

export const obtenerTarifas = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const guardarTarifa = async (data) => {
    const response = await axios.post(API_URL, data);
    return response.data;
};

export const eliminarTarifa = async (tipo) => {
    const response = await axios.delete(`${API_URL}/${tipo}`);
    return response.data;
};