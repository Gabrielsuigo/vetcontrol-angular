import { Request, Response } from 'express';
import { pool } from '../config/database.js';
import { RequestAutenticado } from '../middleware/auth.middleware.js';

// Obtener los datos de la veterinaria del usuario autenticado
export async function obtenerEmpresa(req: RequestAutenticado, res: Response): Promise<void> {
  const empresaId = req.usuario?.empresaId;

  if (!empresaId) {
    res.status(401).json({
      mensaje: 'Debés iniciar sesión para consultar los datos de la veterinaria',
    });
    return;
  }

  try {
    const resultado = await pool.query(
      `SELECT
        id,
        nombre_comercial AS "nombreComercial",
        razon_social AS "razonSocial",
        pais,
        direccion,
        telefono
      FROM empresas
      WHERE id = $1`,
      [empresaId],
    );

    if (resultado.rowCount === 0) {
      res.status(404).json({
        mensaje: 'No se encontraron los datos de la veterinaria',
      });
      return;
    }

    res.json(resultado.rows[0]);
  } catch (error) {
    console.error('Error al obtener los datos de la veterinaria:', error);

    res.status(500).json({
      mensaje: 'No se pudieron obtener los datos de la veterinaria',
    });
  }
}

// Actualizar los datos de la veterinaria del usuario autenticado
export async function actualizarEmpresa(req: RequestAutenticado, res: Response): Promise<void> {
  const empresaId = req.usuario?.empresaId;

  if (!empresaId) {
    res.status(401).json({
      mensaje: 'Debés iniciar sesión para actualizar los datos de la veterinaria',
    });
    return;
  }

  const { nombreComercial, razonSocial, pais, direccion, telefono } = req.body;

  if (
    typeof nombreComercial !== 'string' ||
    !nombreComercial.trim() ||
    typeof razonSocial !== 'string' ||
    !razonSocial.trim() ||
    typeof pais !== 'string' ||
    !pais.trim() ||
    typeof direccion !== 'string' ||
    !direccion.trim() ||
    typeof telefono !== 'string' ||
    !telefono.trim()
  ) {
    res.status(400).json({
      mensaje: 'Completá correctamente todos los datos de la veterinaria',
    });
    return;
  }

  try {
    const resultado = await pool.query(
      `UPDATE empresas
       SET nombre_comercial = $1,
           razon_social = $2,
           pais = $3,
           direccion = $4,
           telefono = $5
       WHERE id = $6
       RETURNING
         id,
         nombre_comercial AS "nombreComercial",
         razon_social AS "razonSocial",
         pais,
         direccion,
         telefono`,
      [
        nombreComercial.trim(),
        razonSocial.trim(),
        pais.trim(),
        direccion.trim(),
        telefono.trim(),
        empresaId,
      ],
    );

    if (resultado.rowCount === 0) {
      res.status(404).json({
        mensaje: 'No se encontró la veterinaria',
      });
      return;
    }

    res.json({
      mensaje: 'Datos de la veterinaria actualizados correctamente',
      empresa: resultado.rows[0],
    });
  } catch (error) {
    console.error('Error al actualizar la veterinaria:', error);

    res.status(500).json({
      mensaje: 'No se pudieron actualizar los datos de la veterinaria',
    });
  }
}
