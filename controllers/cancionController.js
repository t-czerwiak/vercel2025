import { executeQuery } from '../services/dbService.js';

export async function crearCancion(req, res) {
  const { id, nombre } = req.body;
  if (!id || !nombre) {
    return res.status(400).json({ message: 'ID y nombre requeridos' });
  }

  try {
    const result = await executeQuery(
      'INSERT INTO cancion (id, nombre) VALUES ($1, $2) RETURNING *',
      [id, nombre]
    );
    res.status(201).json({ message: 'Canción creada', data: result.rows[0] });
  } catch (error) {
    console.error('Error al crear canción:', error);
    if (error.code === '23505') {
      return res.status(409).json({ message: 'Canción ya existe' });
    }
    return res.status(500).json({ message: error.message });
  }
}

export async function actualizarCancion(req, res) {
  const { id, nombre } = req.body;
  if (!id || !nombre) {
    return res.status(400).json({ message: 'ID y nombre requeridos' });
  }

  try {
    const result = await executeQuery(
      'UPDATE cancion SET nombre = $1 WHERE id = $2 RETURNING *',
      [nombre, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Canción no encontrada' });
    }

    res.json({ message: 'Canción actualizada', data: result.rows[0] });
  } catch (error) {
    console.error('Error al actualizar canción:', error);
    return res.status(500).json({ message: error.message });
  }
}

export async function eliminarCancion(req, res) {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: 'ID requerido' });
  }

  try {
    const result = await executeQuery(
      'DELETE FROM cancion WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Canción no encontrada' });
    }

    res.json({ message: 'Canción eliminada', data: result.rows[0] });
  } catch (error) {
    console.error('Error al eliminar canción:', error);
    return res.status(500).json({ message: error.message });
  }
}