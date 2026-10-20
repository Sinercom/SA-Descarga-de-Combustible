const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const rootDir = path.join(__dirname, '..');
const dataDir = path.join(__dirname, 'data');
const dataFile = path.join(dataDir, 'historial.json');

app.use(cors());
app.use(express.json({ limit: '2mb' }));

function ensureDataFile() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify([], null, 2), 'utf8');
  }
}

function readHistorial() {
  ensureDataFile();
  try {
    const content = fs.readFileSync(dataFile, 'utf8');
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function writeHistorial(registros) {
  ensureDataFile();
  fs.writeFileSync(dataFile, JSON.stringify(registros, null, 2), 'utf8');
}

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    service: 'sa-descarga-de-combustible-backend',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/historial', (req, res) => {
  const registros = readHistorial();
  res.json({ ok: true, count: registros.length, registros });
});

app.post('/api/historial', (req, res) => {
  const { registros } = req.body;

  if (!Array.isArray(registros)) {
    return res.status(400).json({ ok: false, message: 'Debes enviar un arreglo en el campo registros.' });
  }

  writeHistorial(registros);
  res.json({ ok: true, count: registros.length, registros });
});

app.post('/api/registro', (req, res) => {
  const registro = req.body;

  if (!registro || !Array.isArray(registro.filas)) {
    return res.status(400).json({ ok: false, message: 'Formato inválido. Debe incluir filas como arreglo.' });
  }

  const registros = readHistorial();
  const nuevoRegistro = {
    ...registro,
    timestamp: registro.timestamp || new Date().toLocaleString('es-AR'),
    auto: Boolean(registro.auto),
    imported: Boolean(registro.imported),
  };

  registros.push(nuevoRegistro);
  writeHistorial(registros);

  res.status(201).json({ ok: true, count: registros.length, registro: nuevoRegistro });
});

app.delete('/api/historial/:index', (req, res) => {
  const { index } = req.params;
  const registros = readHistorial();
  const idx = Number(index);

  if (Number.isNaN(idx) || idx < 0 || idx >= registros.length) {
    return res.status(404).json({ ok: false, message: 'Registro no encontrado.' });
  }

  registros.splice(idx, 1);
  writeHistorial(registros);

  res.json({ ok: true, count: registros.length, registros });
});

app.delete('/api/historial', (req, res) => {
  writeHistorial([]);
  res.json({ ok: true, count: 0, registros: [] });
});

app.use(express.static(rootDir));

app.get('/', (req, res) => {
  res.sendFile(path.join(rootDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
});
