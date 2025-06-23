
// 引入需要的模块
const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const router = express.Router();

// 文件路径
const dataPaths = {
  home: path.join(__dirname, 'data', 'home.json'),
  news: path.join(__dirname, 'data', 'news.json'),
  events: path.join(__dirname, 'data', 'events.json'),
  clicks: path.join(__dirname, 'data', 'clicks.json')
};

// 设置 multer 存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const targetDir = path.join(__dirname, 'public', 'images', req.body.page);
    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
    cb(null, targetDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `${timestamp}${ext}`);
  }
});
const upload = multer({ storage });

// 上传接口，支持 home/news/events + index
['home', 'news', 'events'].forEach(page => {
  const { title, link } = req.body; // ✅ 需要添加这行
  router.post('/upload/:section/:index', upload.single('image'), async (req, res) => {
  const section = req.params.section; // home, news, events
  const index = parseInt(req.params.index); // 对应的卡片位置
    
    const imagePath = `/images/${section}/` + req.file.filename;
    const filePath = dataPaths[page];

    let jsonData = [];
    if (fs.existsSync(filePath)) {
      jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }

    const i = parseInt(index, 10);
    jsonData[i] = { title, link, image: imagePath };

    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), 'utf-8');
    res.json({ success: true, message: '上传成功', image: imgPath });
  });
});

// 点击记录保存
router.post('/track-click', express.json(), (req, res) => {
  const { page, index, ip, system, duration } = req.body;
  const timestamp = new Date().toISOString();
  const record = { timestamp, page, index, ip, system, duration };

  let records = [];
  if (fs.existsSync(dataPaths.clicks)) {
    records = JSON.parse(fs.readFileSync(dataPaths.clicks, 'utf-8'));
  }

  records.push(record);
  fs.writeFileSync(dataPaths.clicks, JSON.stringify(records, null, 2));
  res.json({ success: true });
});

// 提供点击数据查看
router.get('/api/clicks', (req, res) => {
  if (fs.existsSync(dataPaths.clicks)) {
    const data = JSON.parse(fs.readFileSync(dataPaths.clicks, 'utf-8'));
    res.json(data);
  } else {
    res.json([]);
  }
});

module.exports = router;
