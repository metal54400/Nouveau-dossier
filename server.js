

// server.js
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 5500;


app.use(bodyParser.json());

// Fichier où on stocke toutes les sauvegardes (clé = IP)
const SAVE_FILE = path.join(__dirname, 'saves.json');

// Charger les sauvegardes depuis fichier
function loadSaves() {
  try {
    if (fs.existsSync(SAVE_FILE)) {
      const data = fs.readFileSync(SAVE_FILE, 'utf-8');
      return JSON.parse(data);
    }
    return {};
  } catch (err) {
    console.error('Erreur lecture fichier:', err);
    return {};
  }
}

// Sauvegarder dans fichier
function saveSaves(saves) {
  try {
    fs.writeFileSync(SAVE_FILE, JSON.stringify(saves, null, 2), 'utf-8');
  } catch (err) {
    console.error('Erreur écriture fichier:', err);
  }
}

app.post('/save', (req, res) => {
  const { ip, data } = req.body;
  if (!ip || !data) return res.status(400).send('Données invalides');

  const saves = loadSaves();
  saves[ip] = data;
  saveSaves(saves);

  res.sendStatus(200);
});

app.get('/load', (req, res) => {
  const ip = req.query.ip;
  if (!ip) return res.status(400).send('IP manquante');

  const saves = loadSaves();
  if (!saves[ip]) return res.status(404).send('Données non trouvées');

  res.json({ data: saves[ip] });
});

app.use(express.static('public')); // Sert les fichiers front depuis dossier public

app.listen(port, () => {
  console.log(`Serveur démarré sur http://5.48.143.126:${port}/public/`);

});

