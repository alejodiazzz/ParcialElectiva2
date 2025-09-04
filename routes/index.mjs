import express from 'express';
import { records } from '../data/records.mjs'; 

const router = express.Router();


router.get('/', (req, res) => {
  res.render('index.ejs', {
    title: "Página Principal",
    data: records
  });
});


router.get('/new-record', (req, res) => {
  res.render('add-record.ejs', { title: "Nuevo Registro" });
});


router.post('/', (req, res) => {
  const { date, department, town } = req.body;
  const newRecord = { id: records.length + 1, date, department, town };

  records.push(newRecord);
  res.redirect('/');
});

export default router;
