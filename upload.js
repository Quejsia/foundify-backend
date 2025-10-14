const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const cloudinary = require('../config/cloudinary');

router.post('/upload', auth, async (req,res)=>{
  try{
    const { data } = req.body;
    if(!data) return res.status(400).json({ error: 'No data' });
    const result = await cloudinary.uploader.upload(data, { folder: 'foundify' });
    res.json({ url: result.secure_url });
  }catch(e){ console.error(e); res.status(500).json({ error: 'Upload failed' }); }
});

module.exports = router;
