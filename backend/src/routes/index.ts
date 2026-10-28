import { Router } from 'express';
import { pool } from '../config/database.js';
import { registrar, iniciarSesion } from '../controllers/auth.controller.js';
import { autenticar } from '../middleware/auth.middleware.js';
import { listarMascotas, registrarMascota } from '../controllers/mascotas.controller.js';

const router = Router();

// Ruta principal de la API
router.get('/', (_req, res) => {
  res.json({
    mensaje: 'API de VetControl funcionando correctamente',
    estado: 'OK',
  });
});

// Comprobar conexión con PostgreSQL
router.get('/db-test', async (_req, res) => {
  try {
    const resultado = await pool.query('SELECT NOW() AS fecha');

    res.json({
      mensaje: 'Conexión con PostgreSQL exitosa',
      estado: 'OK',
      fecha: resultado.rows[0].fecha,
    });
  } catch (error) {
    console.error('Error al conectar con PostgreSQL:', error);

    res.status(500).json({
      mensaje: 'No se pudo conectar con la base de datos',
      estado: 'ERROR',
    });
  }
});

// Registrar una clínica y su administrador
router.post('/auth/register', registrar);

// Iniciar sesión
router.post('/auth/login', iniciarSesion);

// Rutas de mascotas protegidas con JWT
router.get('/mascotas', autenticar, listarMascotas);
router.post('/mascotas', autenticar, registrarMascota);

export default router;
