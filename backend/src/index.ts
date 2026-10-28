import express from 'express';
import cors from 'cors';
import rutas from './routes/index.js';

const app = express();
const PORT = 3001;

// Permitir solicitudes desde el frontend de Angular
app.use(
  cors({
    origin: 'http://localhost:4200',
  }),
);

// Permitir recibir datos en formato JSON
app.use(express.json());

// Conectar las rutas generales de la API
app.use('/', rutas);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor de VetControl funcionando en http://localhost:${PORT}`);
});
