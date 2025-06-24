const fs = require('fs');
const path = require('path');
const express = require('express');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 通用上传逻辑：传 page=home/news/events，更新对应 JSON
const handleUpload = (pageName) => async (req, res) => {
  try {
    const { title, desc, link, index } = req.body;

    const stream = cloudinary.uploader.upload_stream(
      { folder: pageName },
      async (error, result) => {
        if (error) return res.status(500).json({ error });

        const imageUrl = result.secure_url;

        // 读取对应 JSON 文件
        const filePath = path.join(__dirname, `../data/${pageName}.json`);
        let list = [];

        try {
          list = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        } catch (err) {
          console.error('读取 JSON 出错，初始化为空数组');
        }

        // 确保 index 有效
        const idx = Math.max(0, Math.min(Number(index), 2));

        list[idx] = {
          image: imageUrl,
          title,
          desc,
          link
        };

        fs.writeFileSync(filePath, JSON.stringify(list, null, 2), 'utf-8');

        res.json({ success: true, data: list[idx] });
      }
    );

    req.file.stream.pipe(stream);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 三个上传接口
router.post('/upload/home', upload.single('image'), handleUpload('home'));
router.post('/upload/news', upload.single('image'), handleUpload('news'));
router.post('/upload/events', upload.single('image'), handleUpload('events'));

module.exports = router;
