import express from 'express';
import path from 'node:path';
import routes from './routes/index.mjs';
import 'dotenv/config';

const app = express();

app.use(express.static('public'));

app.set('views', path.resolve('views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));

app.use('/', routes);

const PORT = process.env.PORT || 6972;
app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));
