import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import vehiculosRoutes from './routes/vehiculos.js';
import registrosRoutes from './routes/registros.js';
import tarifasRoutes from './routes/tarifas.js';
import authRoutes from './routes/authRoutes.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/vehiculos', vehiculosRoutes);
app.use('/api/registros', registrosRoutes);
app.use('/api/tarifas', tarifasRoutes);
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});