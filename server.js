const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/api', (req, res) => res.json({ ok: true, msg: 'Foundify API running' }));

const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/items');
const uploadRoutes = require('./routes/upload');

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/upload', uploadRoutes);

const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/foundify';
mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log('Connected to MongoDB'))
  .catch(err=> console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log('Server listening on port', PORT));
