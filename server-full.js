
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = 3000;
const apiRoutes = require('./routes/api');

app.use('/', apiRoutes);
app.use(cors());
app.use(express.json()); // 允许处理 JSON 请求体
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use(express.static(path.join(__dirname, "public")));

// 挂载模块化路由
app.use('/api', require('./routes/home'));
app.use('/api', require('./routes/news'));
app.use('/api', require('./routes/events'));
app.use('/api', require('./routes/upload'));

app.listen(PORT, () => {
  console.log('Server running on http://localhost:' + PORT);
});

// server.js 或 routes/click.js 中
app.post('/api/track-click', (req, res) => {
  const { page, slot, time } = req.body;
  console.log(`[TRACK] Page: ${page}, Slot: ${slot}, Time: ${time}`);
  res.status(200).send({ success: true });
});
