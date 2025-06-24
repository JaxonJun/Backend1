const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// 动态生成上传路径和文件名
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const section = req.params.section;
    const uploadPath = path.join(__dirname, '..', 'public', 'images', section);
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

router.post('/upload/:section/:index', upload.single('image'), (req, res) => {
  const section = req.params.section;
  const index = parseInt(req.params.index, 10);
  const { title, desc} = req.body;
  let { link } = req.body;
  if (!link.startsWith('http://') && !link.startsWith('https://')) {
  link = `https://${link}`;
}

  const jsonPath = path.join(__dirname, '..', 'data', `${section}.json`);
  const imagePath = `/images/${section}/${req.file.filename}`;

  // 读取原有 JSON 数据
  let items = [];
  if (fs.existsSync(jsonPath)) {
    const raw = fs.readFileSync(jsonPath);
    items = JSON.parse(raw);
  }

  // 更新或插入第 index 个项目
  items[index] = { image: imagePath, title, desc, link};

  // 保存回 JSON 文件
  fs.writeFileSync(jsonPath, JSON.stringify(items, null, 2));

  res.status(200).json({ success: true, message: '上传成功' });
});


module.exports = router;
