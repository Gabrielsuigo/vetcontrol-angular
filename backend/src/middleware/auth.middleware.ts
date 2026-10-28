import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface UsuarioAutenticado {
  usuarioId: number;
  empresaId: number;
  rol: string;
}

export interface RequestAutenticado extends Request {
  usuario?: UsuarioAutenticado;
}

export function autenticar(req: RequestAutenticado, res: Response, next: NextFunction): void {
  const autorizacion = req.headers.authorization;

  if (!autorizacion || !autorizacion.startsWith('Bearer ')) {
    res.status(401).json({
      mensaje: 'Debés iniciar sesión para realizar esta operación',
    });
    return;
  }

  const token = autorizacion.substring(7);
  const secreto = process.env['JWT_SECRET'];

  if (!secreto) {
    res.status(500).json({
      mensaje: 'Error de configuración del servidor',
    });
    return;
  }

  try {
    const datos = jwt.verify(token, secreto);

    if (
      typeof datos === 'string' ||
      typeof datos.usuarioId !== 'number' ||
      typeof datos.empresaId !== 'number' ||
      typeof datos.rol !== 'string'
    ) {
      res.status(401).json({
        mensaje: 'El token no es válido',
      });
      return;
    }

    req.usuario = {
      usuarioId: datos.usuarioId,
      empresaId: datos.empresaId,
      rol: datos.rol,
    };

    next();
  } catch {
    res.status(401).json({
      mensaje: 'La sesión expiró o el token no es válido',
    });
  }
}
