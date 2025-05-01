import express from 'express';
import { obtenerVehiculos, agregarVehiculo } from '../controllers/vehiculosController.js';

const router = express.Router();

router.get('/', obtenerVehiculos);
router.post('/', agregarVehiculo);

export default router;