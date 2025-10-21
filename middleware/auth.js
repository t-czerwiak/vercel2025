import jwt from "jsonwebtoken";

export function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(403).json({ message: "Token requerido" });
  }

  const token = authHeader.split(" ")[1]; // "Bearer token"
  if (!token) {
    return res.status(403).json({ message: "Token inválido" });
  }

  try {
    const decoded = jwt.verify(token, "contraseña");
    req.user = decoded; // guardamos datos del usuario en la request
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
}

export function verifyAdmin(req, res, next) {
  if (req.user.rol !== "Admin") {
    return res.status(403).json({ message: "Se requiere rol Admin" });
  }
  next();
}