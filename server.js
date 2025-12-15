const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'change_me_please';

// Canonical host redirect (helps SEO even if nginx routes www to the app)
app.set('trust proxy', true);
app.use((req, res, next) => {
  const host = (req.headers.host || '').split(':')[0].toLowerCase();
  if (host === 'www.sphynxdubai.ae') {
    return res.redirect(301, `https://sphynxdubai.ae${req.originalUrl}`);
  }
  next();
});

// Paths
const publicDir = path.join(__dirname, 'public');
const adminDir = path.join(__dirname, 'admin');
const dataDir = path.join(__dirname, 'data');
const catsJsonPath = path.join(dataDir, 'cats.json');
const uploadsDir = path.join(publicDir, 'uploads');

// Ensure data and uploads directories / files exist
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

if (!fs.existsSync(catsJsonPath)) {
  fs.writeFileSync(catsJsonPath, JSON.stringify([], null, 2), 'utf-8');
}

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static(uploadsDir));
app.use('/admin', express.static(adminDir));
app.use('/', express.static(publicDir));

// Multer config for uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `cat-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// Helper functions
function readCats() {
  const raw = fs.readFileSync(catsJsonPath, 'utf-8');
  try {
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.error('Failed to parse cats.json, resetting file', e);
    fs.writeFileSync(catsJsonPath, JSON.stringify([], null, 2), 'utf-8');
    return [];
  }
}

function writeCats(cats) {
  fs.writeFileSync(catsJsonPath, JSON.stringify(cats, null, 2), 'utf-8');
}

function isAdmin(req) {
  const headerPassword = req.headers['x-admin-password'];
  return headerPassword && headerPassword === ADMIN_PASSWORD;
}

// Admin login endpoint (simple check, no sessions)
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body || {};
  if (!password) {
    return res.status(400).json({ message: 'Password is required' });
  }
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Invalid password' });
  }
  // Client will store password in memory and send it as header for future requests
  res.json({ success: true });
});

// API: Get cats
app.get('/api/cats', (req, res) => {
  const cats = readCats();
  res.json(cats);
});

// Middleware to protect admin routes
function requireAdmin(req, res, next) {
  if (!isAdmin(req)) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
}

// API: Create cat
app.post('/api/cats', requireAdmin, (req, res) => {
  const { name, age, price, description, status, photos } = req.body || {};

  if (!name || !age || !price || !description) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const validStatuses = ['active', 'reserved', 'sold'];
  const finalStatus = validStatuses.includes((status || '').toLowerCase())
    ? status.toLowerCase()
    : 'active';

  const cats = readCats();
  const newCat = {
    id: uuidv4(),
    name,
    age,
    price,
    description,
    status: finalStatus,
    photos: Array.isArray(photos) ? photos.slice(0, 5) : [],
  };

  cats.push(newCat);
  writeCats(cats);
  res.status(201).json(newCat);
});

// API: Update cat
app.put('/api/cats/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { name, age, price, description, status, photos } = req.body || {};

  const cats = readCats();
  const index = cats.findIndex((c) => c.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Cat not found' });
  }

  const validStatuses = ['active', 'reserved', 'sold'];
  const finalStatus = status && validStatuses.includes(status.toLowerCase())
    ? status.toLowerCase()
    : cats[index].status;

  cats[index] = {
    ...cats[index],
    name: name ?? cats[index].name,
    age: age ?? cats[index].age,
    price: price ?? cats[index].price,
    description: description ?? cats[index].description,
    status: finalStatus,
    photos: Array.isArray(photos) ? photos.slice(0, 5) : cats[index].photos,
  };

  writeCats(cats);
  res.json(cats[index]);
});

// API: Delete cat
app.delete('/api/cats/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const cats = readCats();
  const index = cats.findIndex((c) => c.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Cat not found' });
  }

  const [removed] = cats.splice(index, 1);
  writeCats(cats);
  res.json({ success: true, removedId: removed.id });
});

// API: Upload photos (up to 5)
app.post(
  '/api/upload',
  requireAdmin,
  upload.array('photos', 5),
  (req, res) => {
    const files = req.files || [];
    const filePaths = files.map((f) => `/uploads/${f.filename}`);
    res.json({ files: filePaths });
  }
);

// Fallback routes for SPA-like behavior
app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(adminDir, 'index.html'));
});

app.get('/*', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


