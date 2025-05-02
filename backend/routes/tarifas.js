import express from 'express';
import { obtenerTarifas, guardarTarifa, eliminarTarifa } from '../controllers/tarifasController.js';

const router = express.Router();

// Ruta para obtener todas las tarifas
router.get('/', obtenerTarifas);

// Ruta para crear o actualizar una tarifa
router.post('/', guardarTarifa);

// Ruta para eliminar una tarifa
router.delete('/:tipo', eliminarTarifa);

export default router;