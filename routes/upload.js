const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cloudinary 配置
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 设置 Cloudinary 存储策略
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'shwelucks-uploads',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
  }
});

const upload = multer({ storage });

// 上传并更新 JSON 数据
router.post('/upload/:section/:index', upload.single('image'), (req, res) => {
  const section = req.params.section;
  const index = parseInt(req.params.index, 10);
  const { title, desc } = req.body;
  let { link } = req.body;

  if (!link.startsWith('http://') && !link.startsWith('https://')) {
    link = `https://${link}`;
  }

  const jsonPath = path.join(__dirname, '..', 'data', `${section}.json`);
  const imagePath = req.file.path; // Cloudinary 返回的 URL

  // 读取原有 JSON 数据
  let items = [];
  if (fs.existsSync(jsonPath)) {
    const raw = fs.readFileSync(jsonPath);
    items = JSON.parse(raw);
  }

  // 更新或插入第 index 个项目
  items[index] = { image: imagePath, title, desc, link };

  // 保存回 JSON 文件
  fs.writeFileSync(jsonPath, JSON.stringify(items, null, 2));

  res.status(200).json({ success: true, message: '上传成功', imageUrl: imagePath });
});

module.exports = router;
