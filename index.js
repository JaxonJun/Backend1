
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

const authRoutes = require('./routes/auth');
const homeRoutes = require('./routes/home');
const uploadRoutes = require('./routes/upload');
const newsRoutes = require('./routes/news');
const eventsRoutes = require('./routes/events');
const applyRoutes = require('./routes/apply');



// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// 例：直接在 server.js 或 routes/api.js 中添加
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'admin' && password === 'password') {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.use('/api', authRoutes);
// 路由引入
app.use('/api', homeRoutes);
app.use('/api', uploadRoutes); 
app.use('/api', newsRoutes);
app.use('/api', eventsRoutes);
app.use('/data', express.static('data'));
app.use('/api', applyRoutes);
// 启动服务
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
