import {config} from './dbconfig.js'
import express from "express";
import 'dotenv/config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { verifyToken, verifyAdmin } from "./middleware/auth.js";


import pkg from 'pg'
const {Client} = pkg;

const app = express()
const PORT = 8000
app.use(express.json());

app.post('/crearusuario', async (req, res) => {
  const user = req.body; 
  console.log("User data:", user);

  if (!user.nombre || !user.password) {
    return res.status(400).json({ message: "Debe completar todos los campos" });
  }

  try {
    const client = new Client(config);
    await client.connect();

    // encriptar la contraseña
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
  
    console.log("insertando usuario:", user);
    // insertar en la base de datos
    const result = await client.query(
      "INSERT INTO usuario ( nombre, password) VALUES ( $1, $2) RETURNING *",
      [user.nombre, user.password]
    );

    await client.end();

    console.log("Rows creadas:", result.rowCount);
    res.send(result.rows);

  } catch (error) {
    console.error("Error al registrar usuario:", error);
    return res.status(500).json({ message: error.message });
  }
});

app.post('/login', async (req, res) => {
  const user = req.body;
  console.log("User data:", user);

  if (!user.id || !user.password) {
    return res.status(400).json({ message: "Debe completar todos los campos" });
  }

  try {
    const client = new Client(config);
    await client.connect();

    const result = await client.query(
      "SELECT * FROM usuario WHERE id=$1",
      [user.id]
    );

    await client.end();

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const dbUser = result.rows[0];

    // comparar contraseña ingresada con la encriptada en BD
    const passOK = await bcrypt.compare(user.password, dbUser.password);

    if (!passOK) {
      return res.status(401).json({ message: "Clave inválida" });
    }

    // generar token JWT usando opciones personalizadas
    const payload = {
      usuarioID: dbUser.id,
      nombre: dbUser.nombre
    };

    console.log("Payload del token:", payload);
    const secretKey = 'contraseña';
    const options = {
      expiresIn: '1h',
    };

    const token = jwt.sign(payload, secretKey, options);

    res.json({ token });

  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({ message: error.message });
  }
});

app.post("/cancion", verifyToken, verifyAdmin, async (req, res) => {
  const { id, nombre } = req.body;
  const client = new Client(config);
  await client.connect();

  await client.query("INSERT INTO cancion (id, nombre) VALUES ($1, $2)", [id, nombre]);

  await client.end();
  res.json({ message: "Canción creada" });
});

app.put("/cancion", verifyToken, verifyAdmin, async (req, res) => {
  const { id, nombre } = req.body;
  const client = new Client(config);
  await client.connect();

  await client.query("UPDATE cancion SET nombre=$1 WHERE id=$2", [nombre, id]);

  await client.end();
  res.json({ message: "Canción actualizada" });
});

app.delete("/cancion", verifyToken, verifyAdmin, async (req, res) => {
  const { id } = req.body;
  const client = new Client(config);
  await client.connect();

  await client.query("DELETE FROM cancion WHERE id=$1", [id]);

  await client.end();
  res.json({ message: "Canción eliminada" });
});

app.post("/escucho", verifyToken, async (req, res) => {
  const { id } = req.body; // id de canción
  if (!id) {
    return res.status(400).json({ message: "ID de canción requerido" });
  }

  try {
    const client = new Client(config);
    await client.connect();

    const result = await client.query(
      `INSERT INTO escucha (usuarioid, cancionid, reproducciones) 
       VALUES ($1, $2, 1)
       ON CONFLICT (usuarioid, cancionid) 
       DO UPDATE SET reproducciones = escucha.reproducciones + 1
       RETURNING *`,
      [req.user.usuarioID, id]
    );

    await client.end();

    res.json({message: "Reproducción registrada", data: result.rows[0]});
  } catch (error) {
    console.error("Error en /escucho:", error);
    return res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
})