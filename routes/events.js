const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const filePath = path.join(__dirname, '../data/events.json');

router.get('/', (req, res) => {
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) return res.status(500).json({ error: '读取失败' });
    try {
      res.json(JSON.parse(data));
    } catch (e) {
      res.status(500).json({ error: 'JSON 无效' });
    }
  });
});

module.exports = router;
