import 'dotenv/config';

import { Pool } from 'pg';

const esProduccion = Boolean(process.env['DATABASE_URL']);

export const pool = new Pool(
  esProduccion
    ? {
        // Producción: conexión con Neon mediante DATABASE_URL
        connectionString: process.env['DATABASE_URL'],
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {
        // Desarrollo local: conexión con PostgreSQL instalado en Windows
        host: process.env['DB_HOST'] || '127.0.0.1',
        port: Number(process.env['DB_PORT'] || 5432),
        database: process.env['DB_NAME'] || 'vetcontrol_db',
        user: process.env['DB_USER'] || 'vetcontrol_user',
        password: process.env['DB_PASSWORD'] || undefined,
      },
);

pool.on('error', (error) => {
  console.error('Error inesperado en el pool de PostgreSQL:', error.message);
});
