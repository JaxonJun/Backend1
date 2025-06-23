const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

if (!admin.apps.length) {
  admin.initializeApp();
}
const bucket = admin.storage().bucket();

// 设置上传中转目录
const upload = multer({ dest: path.join(__dirname, '..', 'tmp') });

// 路由：/upload/home/0
router.post('/:section/:index', upload.single('image'), async (req, res) => {
  try {
    const { section, index } = req.params;
    const { title, desc, link } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const filename = `${section}/${Date.now()}_${file.originalname}`;
    const token = uuidv4();

    // 上传图片到 Firebase Storage
    await bucket.upload(file.path, {
      destination: filename,
      metadata: {
        metadata: {
          firebaseStorageDownloadTokens: token
        }
      }
    });

    // 删除本地临时文件
    fs.unlinkSync(file.path);

    const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(filename)}?alt=media&token=${token}`;

    // 加载 JSON 数据文件
    const dataPath = path.join(__dirname, '..', 'data', `${section}.json`);
    const rawData = fs.existsSync(dataPath) ? fs.readFileSync(dataPath) : '[]';
    const jsonData = JSON.parse(rawData);

    const targetIndex = parseInt(index);
    jsonData[targetIndex] = {
      image: imageUrl,
      title,
      desc,
      link
    };

    fs.writeFileSync(dataPath, JSON.stringify(jsonData, null, 2));

    res.status(200).json({
      message: '上传成功',
      url: imageUrl,
      index: targetIndex,
      section
    });
  } catch (err) {
    console.error('❌ 上传失败:', err);
    res.status(500).json({ error: '服务器错误，上传失败' });
  }
});

module.exports = router;
