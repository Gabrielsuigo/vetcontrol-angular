import { Request, Response } from 'express';
import { pool } from '../config/database.js';
import { RequestAutenticado } from '../middleware/auth.middleware.js';

// Listar las mascotas de la clínica del usuario autenticado
export async function listarMascotas(req: RequestAutenticado, res: Response): Promise<void> {
  const empresaId = req.usuario?.empresaId;

  if (!empresaId) {
    res.status(401).json({
      mensaje: 'Debés iniciar sesión para consultar las mascotas',
    });
    return;
  }

  try {
    const resultado = await pool.query(
      `SELECT
        m.id,
        m.nombre,
        m.especie,
        m.raza,
        m.edad,
        m.duenio,
        m.imagen,
        m.fecha_registro AS "fechaRegistro",
        u.email AS "usuarioEmail"
      FROM mascotas m
      INNER JOIN usuarios u ON u.id = m.usuario_id
      WHERE m.empresa_id = $1
      ORDER BY m.id DESC`,
      [empresaId],
    );

    const mascotas = resultado.rows.map((mascota) => ({
      ...mascota,
      vacunas: [],
      consultas: [],
    }));

    res.json(mascotas);
  } catch (error) {
    console.error('Error al listar mascotas:', error);

    res.status(500).json({
      mensaje: 'No se pudieron obtener las mascotas',
    });
  }
}

// Registrar una mascota en la clínica del usuario autenticado
export async function registrarMascota(req: RequestAutenticado, res: Response): Promise<void> {
  const usuario = req.usuario;

  if (!usuario) {
    res.status(401).json({
      mensaje: 'Debés iniciar sesión para registrar una mascota',
    });
    return;
  }

  const { nombre, especie, raza, edad, duenio, imagen } = req.body;

  if (
    typeof nombre !== 'string' ||
    !nombre.trim() ||
    typeof especie !== 'string' ||
    !especie.trim() ||
    typeof raza !== 'string' ||
    typeof duenio !== 'string' ||
    !duenio.trim() ||
    !Number.isInteger(edad) ||
    edad < 0
  ) {
    res.status(400).json({
      mensaje: 'Completá correctamente los datos de la mascota',
    });
    return;
  }

  try {
    const resultado = await pool.query(
      `INSERT INTO mascotas (
        empresa_id,
        usuario_id,
        nombre,
        especie,
        raza,
        edad,
        duenio,
        imagen
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING
        id,
        nombre,
        especie,
        raza,
        edad,
        duenio,
        imagen,
        fecha_registro AS "fechaRegistro"`,
      [
        usuario.empresaId,
        usuario.usuarioId,
        nombre.trim(),
        especie.trim(),
        raza.trim(),
        edad,
        duenio.trim(),
        typeof imagen === 'string' ? imagen : '',
      ],
    );

    const usuarioResultado = await pool.query('SELECT email FROM usuarios WHERE id = $1', [
      usuario.usuarioId,
    ]);

    const mascota = {
      ...resultado.rows[0],
      usuarioEmail: usuarioResultado.rows[0]?.email ?? '',
      vacunas: [],
      consultas: [],
    };

    res.status(201).json(mascota);
  } catch (error) {
    console.error('Error al registrar mascota:', error);

    res.status(500).json({
      mensaje: 'No se pudo registrar la mascota',
    });
  }
}
