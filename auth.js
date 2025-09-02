app.post('/createuser', async (req, res) => {
 const user = req.body; // si falla esto es porque falta app.use(express.json());
 if (!user.nombre || !user.userid || !user.password) {
     return res.status(400).json({ message: "Debe completar todos los campos" });
 }
 try {
   const client = new Client(config);
   await client.connect();
   const hashedPassword = await bcrypt.hash(user.password, 10);
   user.password = hashedPassword;
   let result = await client.query("insert into usuario values($1, $2, $3) returning *",[user.userid, user.nombre, user.password]);
   await client.end();
   console.log("Rows creadas:" ,result.rowCount);
   res.send(result.rows)
 }
 catch (error) {
   return res.status(500).json({ message: error.message });
}
})


app.post('/login', async (req, res) => {
 const user = req.body; 
 if (!user.userid || !user.password) {
     return res.status(400).json({ message: "Debe completar todos los campos" });
 }
 try {
   let result = await client.query("select * from usuario where userid=$1",[user.userid]);
   if (result.rowCount === 0) {
     return res.status(404).json({ message: "Usuario no encontrado" });
   }
   let dbUser = result.rows[0];
   const passOK=await bcrypt.compare(user.password,dbUser.password);
   if (passOK)
   {
     res.send(nombre: dbUser.nombre)
   } else {     res.send("Clave invalida" )}
 } catch (error) {
return res.status(500).json({ message: error.message });
}})
