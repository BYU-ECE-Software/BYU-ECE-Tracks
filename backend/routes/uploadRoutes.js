const express = require('express');
const multer = require('multer');
const { minioClient, BUCKET, ensureBucketExists } = require('../utils/minio');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    await ensureBucketExists();

    const file = req.file;
    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;

    await minioClient.putObject(BUCKET, filename, file.buffer, {
      'Content-Type': file.mimetype,
    });

    // const imageUrl = await minioClient.presignedGetObject(BUCKET, filename, 60 * 60); // 1 hour
    // res.json({ imageUrl });
    res.json({ imageKey: filename });
  } catch (err) {
    console.error('Upload failed:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

router.get('/image-url/:key', async (req, res) => {
  const key = req.params.key;
  try {
    const url = await minioClient.presignedGetObject(BUCKET, key, 60 * 60); // 1 hour
    res.json({ url });
  } catch (err) {
    console.error('Error generating pre-signed URL:', err);
    res.status(500).json({ error: 'Could not generate image URL' });
  }
});

module.exports = router;
