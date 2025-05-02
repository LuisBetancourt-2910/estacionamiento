import express from 'express';
import { registrarUsuario, loginUsuario, obtenerUsuarios, eliminarUsuario} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registrarUsuario);
router.post('/login', loginUsuario);
router.get('/users', obtenerUsuarios);
router.delete('/register/:username', eliminarUsuario);

export default router;
