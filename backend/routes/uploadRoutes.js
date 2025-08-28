import express from 'express';
import multer from 'multer';
import { minioClient, BUCKET, ensureBucketExists } from '../utils/minio.js';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 100 * 1024 * 1024 } }); // 100MB limit

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
    const out = new URL(url);
    const pub = new URL(process.env.PUBLIC_S3_BASE);
    out.hostname = pub.hostname;
    out.protocol = pub.protocol;
    out.port = pub.port || '';
    out.pathname = (pub.pathname.replace(/\/$/, '') || '') + out.pathname;
    res.json({ url: out.href });
  } catch (err) {
    console.error('Error generating pre-signed URL:', err);
    res.status(500).json({ error: 'Could not generate image URL' });
  }
});

export default router;
