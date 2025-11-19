const express = require('express');
const multer = require('multer');
const cors = require('cors');

const app = express();

// Enable CORS for frontend dev server
app.use(cors());

// Memory store
let images = [];

// Multer config
const upload = multer({
  limits: { fileSize: 3 * 1024 * 1024 }, // 3MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
});

// Upload route
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const img = {
    id: Date.now().toString(),
    filename: req.file.originalname,
    mimeType: req.file.mimetype,
    data: req.file.buffer
  };

  images.push(img);
  res.status(201).json({ message: 'Uploaded', id: img.id });
});

// List images (metadata only)
app.get('/images', (req, res) => {
  const list = images.map(({ id, filename, mimeType }) => ({ id, filename, mimeType }));
  res.json(list);
});

// Get image binary data
app.get('/images/:id/data', (req, res) => {
  const id = req.params.id;
  const found = images.find((img) => img.id === id);
  if (!found) return res.status(404).json({ error: 'Not found' });
  res.set('Content-Type', found.mimeType);
  res.send(found.data);
});

// Delete route
app.delete('/images/:id', (req, res) => {
  const id = req.params.id;
  images = images.filter(img => img.id !== id);
  res.status(200).json({ message: 'Deleted' });
});

// Error handling for multer and validation
app.use((err, req, res, next) => {
  if (err) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ error: 'File too large (max 3MB)' });
    }
    if (err.message === 'Invalid file type') {
      return res.status(415).json({ error: 'Unsupported media type (only JPEG/PNG)' });
    }
    return res.status(400).json({ error: err.message || 'Upload error' });
  }
  next();
});

module.exports = app;
