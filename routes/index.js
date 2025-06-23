const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const router = express.Router();

const authRoutes = require('./auth.js');
const homeRoutes = require('./home.js');
const uploadRoutes = require('./upload.js');
const newsRoutes = require('./news.js');
const eventsRoutes = require('./events.js');
const uploadRoutes = require('./routes/upload');
app.use('/upload', uploadRoutes);
// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.use('/api', authRoutes);
// 路由引入
app.use('/api', homeRoutes);
app.use('/api', uploadRoutes); 
app.use('/api', newsRoutes);
app.use('/api', eventsRoutes);

router.use(authRoutes);
router.use(homeRoutes);
router.use(uploadRoutes);
router.use(newsRoutes);
router.use(eventsRoutes);

// 启动服务
//const PORT = process.env.PORT || 3333;
module.exports = router;


