import express from 'express';
import { registrarUsuario, loginUsuario, obtenerUsuarios} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registrarUsuario);
router.post('/login', loginUsuario);
router.get('/users', obtenerUsuarios);

export default router;
