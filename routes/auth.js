// routes/auth.js
const express = require('express');
const router = express.Router();

// 简单验证用户名和密码

router.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'admin' && password === '123456') {
    res.status(200).json({ success: true, message: 'Login successful!' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

module.exports = router;
