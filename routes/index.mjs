import express from 'express';
import { records } from '../data/records.mjs'; // Simulación de base de datos

const router = express.Router();

// Ruta para mostrar la lista de elementos
router.get('/', (req, res) => {
  res.render('index.ejs', {
    title: "Página Principal",
    data: records
  });
});

// Ruta para mostrar el formulario de nuevo registro
router.get('/new-record', (req, res) => {
  res.render('add-record.ejs', { title: "Nuevo Registro" });
});

// Ruta para procesar el formulario y agregar un nuevo elemento
router.post('/', (req, res) => {
  const { date, department, town } = req.body;
  const newRecord = { id: records.length + 1, date, department, town };

  records.push(newRecord);
  res.redirect('/');
});

export default router;
