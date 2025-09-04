import express from 'express';
import path from 'node:path';
import routes from './routes/index.mjs';
import 'dotenv/config';

// 1. Inicialización de Express
const app = express();

// 2. Configuración de archivos estáticos
app.use(express.static('public'));

// 3. Configuración del motor de plantillas (EJS)
app.set('views', path.resolve('views'));
app.set('view engine', 'ejs');

// 4. Middleware para procesar datos de formularios
app.use(express.urlencoded({ extended: false }));

// 5. Uso de las rutas
app.use('/', routes);

// 6. Puerto y arranque del servidor
const PORT = process.env.PORT || 6972;
app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));
