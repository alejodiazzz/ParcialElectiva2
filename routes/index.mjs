import express from 'express';
import { readFile } from 'node:fs/promises';

// Helper function to read and parse JSON files
async function readJsonFile(filePath) {
  const json = await readFile(filePath, 'utf8');
  return JSON.parse(json);
}

// In-memory store for records
const records = [];

const router = express.Router();

// Route to display the main page with records
router.get('/', async (req, res) => {
  try {
    const departments = await readJsonFile('data/departments.json');
    const towns = await readJsonFile('data/towns.json');

    const departmentMap = new Map(departments.map(d => [d.code, d.name]));
    const townMap = new Map(towns.map(t => [t.code, t.name]));

    const displayRecords = records.map(record => ({
      ...record,
      departmentName: departmentMap.get(record.department) || record.department,
      townName: townMap.get(record.town) || record.town,
    }));

    res.render('index.ejs', {
      title: "Página Principal",
      data: displayRecords
    });
  } catch (error) {
    console.error("Error reading data files:", error);
    res.status(500).send("Error loading data");
  }
});

// Route to display the form for adding a new record
router.get('/new-record', async (req, res) => {
  try {
    const departments = await readJsonFile('data/departments.json');
    // We no longer pass all towns, only departments
    res.render('add-record.ejs', {
      title: "Nuevo Registro",
      departments
    });
  } catch (error) {
    console.error("Error reading data files:", error);
    res.status(500).send("Error loading data");
  }
});

// API route to get towns for a specific department
router.get('/api/towns/:departmentCode', async (req, res) => {
  try {
    const { departmentCode } = req.params;
    const allTowns = await readJsonFile('data/towns.json');
    const filteredTowns = allTowns.filter(town => town.department === departmentCode);
    res.json(filteredTowns);
  } catch (error) {
    console.error("Error filtering towns:", error);
    res.status(500).send("Error loading towns");
  }
});

// Route to handle the submission of the new record form
router.post('/', (req, res) => {
  const { date, department, town } = req.body;
  if (!date || !department || !town) {
    return res.status(400).send("Todos los campos son requeridos.");
  }
  const newRecord = { id: records.length + 1, date, department, town };

  records.push(newRecord);
  res.redirect('/');
});

export default router;
