import express from 'express';
import { config } from './dbconfig.js'; 

// Importar rutas
import userRoutes from './routes/userRoutes.js';
import cancionRoutes from './routes/cancionRoutes.js';
import escuchaRoutes from './routes/escuchaRoutes.js';

const app = express();
const PORT = 8000;

app.use(express.json());

app.use('/api', userRoutes);
app.use('/api', cancionRoutes);
app.use('/api', escuchaRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});