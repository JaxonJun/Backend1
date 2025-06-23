const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const uploadRoutes = require('./routes/upload');
app.use('/upload', uploadRoutes);

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态资源
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use(express.static(path.join(__dirname, 'public')));

// 你可以只保留一个简单路由测试（确保 function 能正常部署）
app.get('/api/test', (req, res) => {
  res.send('API is working!');
});

// 🚀 最终导出函数，必须是 app（不能是 router）
exports.api = functions.https.onRequest(app);
