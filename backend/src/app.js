import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const UPLOADS_DIR = path.resolve(__dirname, '../uploads');

const ensureUploadsDir = () => {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
};

const buildStorage = () => multer.diskStorage({
  destination: (req, file, cb) => {
    ensureUploadsDir();
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9-_]+/g, '-')
      .slice(0, 64) || 'file';
    const id = crypto.randomBytes(8).toString('hex');
    cb(null, `${Date.now()}-${id}-${base}${ext.toLowerCase()}`);
  },
});

export const createApp = () => {
  ensureUploadsDir();

  const app = express();
  app.use(express.json());
  app.use('/uploads', express.static(UPLOADS_DIR));

  const upload = multer({
    storage: buildStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
  });

  app.post('/api/submit', upload.single('file'), (req, res) => {
    const { name, message } = req.body;
    const filePayload = req.file
      ? {
        originalName: req.file.originalname,
        storedName: req.file.filename,
        path: `/uploads/${req.file.filename}`,
        size: req.file.size,
        mimeType: req.file.mimetype,
      }
      : null;

    res.json({ name, message, file: filePayload });
  });

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: err.message, code: err.code });
    }
    return res.status(500).json({ message: err.message || 'Internal server error' });
  });

  return app;
};
