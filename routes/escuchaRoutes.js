import express from 'express';
import { registrarEscucha } from '../controllers/escuchaController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/escucho', verifyToken, registrarEscucha);

export default router;