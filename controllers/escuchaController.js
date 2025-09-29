import { executeQuery } from '../services/dbService.js';

export async function registrarEscucha(req, res) {
  const { id } = req.body;  // id de canción
  if (!id) {
    return res.status(400).json({ message: 'ID de canción requerido' });
  }

  try {
    // Upsert atómico con ON CONFLICT (requiere unique constraint en DB)
    const result = await executeQuery(
      `INSERT INTO escucha (usuarioid, cancionid, reproducciones) 
       VALUES ($1, $2, 1)
       ON CONFLICT (usuarioid, cancionid) 
       DO UPDATE SET reproducciones = escucha.reproducciones + 1
       RETURNING *`,
      [req.user.usuarioID, id]
    );

    if (result.rowCount === 0) {
      return res.status(500).json({ message: 'Error al registrar reproducción' });
    }

    res.json({ message: 'Reproducción registrada', data: result.rows[0] });
  } catch (error) {
    console.error('Error en /escucho:', error);
    return res.status(500).json({ message: error.message });
  }
}