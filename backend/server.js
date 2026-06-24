const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sql = require('mssql/msnodesqlv8');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ─── CONFIGURACIÓN SQL SERVER (Windows Auth) ──────────────
const dbConfig = {
  connectionString: 'Driver={ODBC Driver 18 for SQL Server};Server=DESKTOP-JR0NAF2\\SQLEXPRESS;Database=CuidaMas;Trusted_Connection=yes;TrustServerCertificate=yes;',
  driver: 'msnodesqlv8',
};
// Conectar a la base de datos
sql.connect(dbConfig)
  .then(() => console.log('✅ Conectado a SQL Server — CuidaMas'))
  .catch(err => console.error('❌ Error de conexión:', err.message));

// ─── RUTA DE PRUEBA ───────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ mensaje: 'API CuidaMás funcionando ✅' });
});

// ─── AUTH: LOGIN ──────────────────────────────────────────
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await sql.query`
      SELECT * FROM usuarios WHERE email = ${email}
    `;
    const user = result.recordset[0];
    if (!user) return res.status(401).json({ error: 'Usuario no encontrado' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Contraseña incorrecta' });

    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
    res.json({ token, usuario: { id: user.id, nombre: user.nombre, rol: user.rol } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── MIDDLEWARE JWT ───────────────────────────────────────
function verificarToken(req, res, next) {
  const auth = req.headers['authorization'];
  if (!auth) return res.status(401).json({ error: 'Token requerido' });
  const token = auth.split(' ')[1];
  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido' });
  }
}

// ─── ADULTOS: LISTAR ──────────────────────────────────────
app.get('/api/adultos', verificarToken, async (req, res) => {
  try {
    const result = await sql.query`
      SELECT a.*, u.nombre as cuidador_nombre
      FROM adultos a
      LEFT JOIN cuidadores c ON a.cuidador_id = c.id
      LEFT JOIN usuarios u ON c.usuario_id = u.id
      ORDER BY a.created_at DESC
    `;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── ADULTOS: CREAR ───────────────────────────────────────
app.post('/api/adultos', verificarToken, async (req, res) => {
  const { dni, nombre, edad, sexo, distrito, lat, lng,
          foto, condicion, enfermedades, familiar, telefono } = req.body;
  try {
    await sql.query`
      INSERT INTO adultos
        (dni, nombre, edad, sexo, distrito, lat, lng,
         foto, condicion, enfermedades, familiar, telefono)
      VALUES
        (${dni}, ${nombre}, ${edad}, ${sexo}, ${distrito},
         ${lat}, ${lng}, ${foto}, ${condicion},
         ${enfermedades}, ${familiar}, ${telefono})
    `;
    res.json({ mensaje: 'Adulto registrado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── ADULTOS: ACTUALIZAR ESTADO ───────────────────────────
app.put('/api/adultos/:id', verificarToken, async (req, res) => {
  const { id } = req.params;
  const { condicion } = req.body;
  try {
    await sql.query`
      UPDATE adultos SET condicion = ${condicion} WHERE id = ${id}
    `;
    res.json({ mensaje: 'Estado actualizado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── ALERTAS: LISTAR ──────────────────────────────────────
app.get('/api/alertas', verificarToken, async (req, res) => {
  try {
    const result = await sql.query`
      SELECT al.*, a.nombre as adulto_nombre,
             a.distrito, a.condicion
      FROM alertas al
      JOIN adultos a ON al.adulto_id = a.id
      WHERE al.estado = 'pendiente'
      ORDER BY al.fecha DESC
    `;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── DASHBOARD: MÉTRICAS ──────────────────────────────────
app.get('/api/dashboard', verificarToken, async (req, res) => {
  try {
    const total = await sql.query`SELECT COUNT(*) as total FROM adultos`;
    const estable = await sql.query`SELECT COUNT(*) as total FROM adultos WHERE condicion = 'estable'`;
    const observacion = await sql.query`SELECT COUNT(*) as total FROM adultos WHERE condicion = 'observacion'`;
    const urgente = await sql.query`SELECT COUNT(*) as total FROM adultos WHERE condicion = 'urgente'`;
    const recientes = await sql.query`
      SELECT TOP 5 nombre, edad, distrito, condicion FROM adultos ORDER BY created_at DESC
    `;
    res.json({
      total: total.recordset[0].total,
      estable: estable.recordset[0].total,
      observacion: observacion.recordset[0].total,
      urgente: urgente.recordset[0].total,
      recientes: recientes.recordset,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── INICIAR SERVIDOR ─────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});