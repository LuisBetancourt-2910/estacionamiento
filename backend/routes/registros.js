import express from 'express';
import { registrarEntrada, registrarSalida } from '../controllers/registrosController.js';
import { obtenerVehiculosActivos } from '../controllers/registrosController.js';
import { obtenerVehiculos } from '../controllers/registrosController.js';
import { obtenerTarifasDelDia } from '../controllers/registrosController.js';

const router = express.Router();

router.post('/entrada', registrarEntrada);
router.post('/salida', registrarSalida);
router.get('/activos', obtenerVehiculosActivos);
router.get('/vehiculos', obtenerVehiculos);
router.get('/tarifas-dia', obtenerTarifasDelDia);

export default router;