import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import vehiculosRoutes from './routes/vehiculos.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/vehiculos', vehiculosRoutes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});