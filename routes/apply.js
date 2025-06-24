const fs = require('fs');
const path = require('path');
const express = require('express');

const router = express.Router();
const filePath = path.join(__dirname, '../data/apply.json');

router.get('/apply', (req, res) => {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    const list = JSON.parse(data);
    res.json(list.reverse()); // 最新的在最前
  } catch (err) {
    res.status(500).json({ error: 'Failed to load apply data' });
  }
});


router.post('/apply', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ success: false, message: 'Missing name or email' });
  }

  let list = [];
  try {
    list = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    list = [];
  }

  list.push({ name, email, time: new Date().toISOString() });

  fs.writeFileSync(filePath, JSON.stringify(list, null, 2), 'utf-8');

  res.json({ success: true });
});

module.exports = router;
