import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database.js';

export async function registrar(req: Request, res: Response) {
  const { nombre, email, password, nombreComercial, razonSocial, pais, direccion, telefono } =
    req.body;

  if (
    !nombre ||
    !email ||
    !password ||
    !nombreComercial ||
    !razonSocial ||
    !pais ||
    !direccion ||
    !telefono
  ) {
    return res.status(400).json({
      mensaje: 'Todos los campos son obligatorios',
    });
  }

  const emailNormalizado = String(email).trim().toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNormalizado)) {
    return res.status(400).json({
      mensaje: 'El email no tiene un formato válido',
    });
  }

  if (typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({
      mensaje: 'La contraseña debe tener al menos 8 caracteres',
    });
  }

  const cliente = await pool.connect();
  let transaccionIniciada = false;

  try {
    const usuarioExistente = await cliente.query('SELECT id FROM usuarios WHERE email = $1', [
      emailNormalizado,
    ]);

    if (usuarioExistente.rowCount && usuarioExistente.rowCount > 0) {
      return res.status(409).json({
        mensaje: 'Ya existe un usuario con ese email',
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await cliente.query('BEGIN');
    transaccionIniciada = true;

    const empresaResultado = await cliente.query(
      `INSERT INTO empresas
        (nombre_comercial, razon_social, pais, direccion, telefono)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [
        String(nombreComercial).trim(),
        String(razonSocial).trim(),
        String(pais).trim(),
        String(direccion).trim(),
        String(telefono).trim(),
      ],
    );

    const empresaId = empresaResultado.rows[0].id;

    const usuarioResultado = await cliente.query(
      `INSERT INTO usuarios
        (empresa_id, nombre, email, password_hash, rol)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, empresa_id, nombre, email, rol, foto_perfil, created_at`,
      [empresaId, String(nombre).trim(), emailNormalizado, passwordHash, 'Administrador'],
    );

    await cliente.query('COMMIT');
    transaccionIniciada = false;

    return res.status(201).json({
      mensaje: 'Clínica y administrador registrados correctamente',
      usuario: usuarioResultado.rows[0],
    });
  } catch (error) {
    if (transaccionIniciada) {
      try {
        await cliente.query('ROLLBACK');
      } catch (errorRollback) {
        console.error('Error al deshacer la transacción:', errorRollback);
      }
    }

    console.error('Error al registrar clínica y administrador:', error);

    return res.status(500).json({
      mensaje: 'No se pudo completar el registro',
    });
  } finally {
    cliente.release();
  }
}
export async function iniciarSesion(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      mensaje: 'El email y la contraseña son obligatorios',
    });
  }

  const emailNormalizado = String(email).trim().toLowerCase();

  try {
    const resultado = await pool.query(
      `SELECT id, empresa_id, nombre, email, password_hash, rol, foto_perfil, created_at
       FROM usuarios
       WHERE email = $1`,
      [emailNormalizado],
    );

    if (resultado.rows.length === 0) {
      return res.status(401).json({
        mensaje: 'Email o contraseña incorrectos',
      });
    }

    const usuario = resultado.rows[0];

    const passwordCorrecta = await bcrypt.compare(String(password), usuario.password_hash);

    if (!passwordCorrecta) {
      return res.status(401).json({
        mensaje: 'Email o contraseña incorrectos',
      });
    }

    const secreto = process.env['JWT_SECRET'];

    if (!secreto) {
      console.error('Falta configurar JWT_SECRET en el archivo .env');

      return res.status(500).json({
        mensaje: 'Error de configuración del servidor',
      });
    }

    const token = jwt.sign(
      {
        usuarioId: usuario.id,
        empresaId: usuario.empresa_id,
        rol: usuario.rol,
      },
      secreto,
      { expiresIn: '8h' },
    );

    return res.status(200).json({
      mensaje: 'Inicio de sesión correcto',
      token,
      usuario: {
        id: usuario.id,
        empresa_id: usuario.empresa_id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        foto_perfil: usuario.foto_perfil,
        created_at: usuario.created_at,
      },
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);

    return res.status(500).json({
      mensaje: 'No se pudo iniciar sesión',
    });
  }
}
