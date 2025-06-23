
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

router.get('/events', (req, res) => {
  const dataPath = path.join(__dirname, '../data/events.json');
  if (fs.existsSync(dataPath)) {
    const data = JSON.parse(fs.readFileSync(dataPath));
    res.json(data);
  } else {
    res.json([]);
  }
});

module.exports = router;
