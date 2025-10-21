import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { executeQuery } from '../services/dbServices.js';

export async function crearUsuario(req, res) {
  const { nombre, password } = req.body;
  console.log('User  data:', { nombre, password });

  if (!nombre || !password) {
    return res.status(400).json({ message: 'Debe completar todos los campos' });
  }

  try {
    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar con rol default 'Usuario'
    const result = await executeQuery(
      'INSERT INTO usuario (nombre, password, rol) VALUES ($1, $2, $3) RETURNING *',
      [nombre, hashedPassword, 'Usuario']
    );

    console.log('Rows creadas:', result.rowCount);
    res.status(201).json(result.rows[0]);  // Retorna el usuario creado (sin password)
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    if (error.code === '23505') {  // Unique violation (si nombre es unique)
      return res.status(409).json({ message: 'Usuario ya existe' });
    }
    return res.status(500).json({ message: error.message });
  }
}

export async function login(req, res) {
  const { nombre, password } = req.body;  // Cambiado a 'nombre' para consistencia
  console.log('User  data:', { nombre, password });

  if (!nombre || !password) {
    return res.status(400).json({ message: 'Debe completar todos los campos' });
  }

  try {
    const result = await executeQuery(
      'SELECT * FROM usuario WHERE nombre = $1',
      [nombre]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const dbUser  = result.rows[0];

    // Comparar contraseña
    const passOK = await bcrypt.compare(password, dbUser .password);
    if (!passOK) {
      return res.status(401).json({ message: 'Clave inválida' });
    }

    // Generar token con rol incluido
    const payload = {
      usuarioID: dbUser .id,
      nombre: dbUser .nombre,
      rol: dbUser .rol  // Incluido para verifyAdmin
    };

    console.log('Payload del token:', payload);
    const secret = process.env.JWT_SECRET || 'contraseña';
    const options = { expiresIn: '1h' };
    const token = jwt.sign(payload, secret, options);

    // No retornar password
    const { password: _, ...userWithoutPassword } = dbUser ;
    res.json({ token });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ message: error.message });
  }
}