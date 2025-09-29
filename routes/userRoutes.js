import express from 'express';
import { crearUsuario, login } from '../controllers/userController.js';

const router = express.Router();

router.post('/crearusuario', crearUsuario);
router.post('/login', login);

export default router;