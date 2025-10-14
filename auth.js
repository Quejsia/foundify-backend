const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer');

router.post('/signup', async (req,res)=>{
  try{
    const { name, email, password } = req.body;
    if(!email||!password) return res.status(400).json({ error: 'Missing fields' });
    let u = await User.findOne({ email });
    if(u) return res.status(400).json({ error: 'User exists' });
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    u = new User({ name, email, password: hash });
    await u.save();
    const token = jwt.sign({ id: u._id }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
    res.json({ user: { id: u._id, name: u.name, email: u.email, role: u.role }, token });
  }catch(e){ console.error(e); res.status(500).json({ error: 'Server error' }); }
});

router.post('/login', async (req,res)=>{
  try{
    const { email, password } = req.body;
    const u = await User.findOne({ email });
    if(!u) return res.status(400).json({ error: 'No user' });
    const ok = await bcrypt.compare(password, u.password);
    if(!ok) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: u._id }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
    res.json({ user: { id: u._id, name: u.name, email: u.email, role: u.role }, token });
  }catch(e){ console.error(e); res.status(500).json({ error: 'Server error' }); }
});

router.post('/forgot', async (req,res)=>{
  try{
    const { email } = req.body;
    const u = await User.findOne({ email });
    if(!u) return res.status(400).json({ error: 'No user with that email' });
    const token = Math.random().toString(36).slice(2,10);
    u.resetToken = token; u.resetExpires = Date.now() + 1000*60*60; await u.save();
    let transporter;
    if(process.env.SMTP_HOST && process.env.SMTP_USER){
      transporter = nodemailer.createTransport({ host: process.env.SMTP_HOST, port: process.env.SMTP_PORT||587, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } });
    } else {
      const test = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({ host: test.smtp.host, port: test.smtp.port, secure: test.smtp.secure, auth: { user: test.user, pass: test.pass } });
    }
    const link = `${process.env.CLIENT_URL||'http://localhost:5173'}/reset-password?token=${token}&email=${encodeURIComponent(u.email)}`;
    const info = await transporter.sendMail({ from: process.env.SMTP_FROM||'Foundify <no-reply@foundify.local>', to: u.email, subject: 'Foundify password reset', html: `<p>Reset: <a href="${link}">${link}</a></p>` });
    res.json({ ok: true, info: nodemailer.getTestMessageUrl ? nodemailer.getTestMessageUrl(info) : info.messageId });
  }catch(e){ console.error(e); res.status(500).json({ error: 'Server error' }); }
});

router.post('/reset', async (req,res)=>{
  try{
    const { email, token, password } = req.body;
    const u = await User.findOne({ email, resetToken: token, resetExpires: { $gt: Date.now() } });
    if(!u) return res.status(400).json({ error: 'Invalid or expired token' });
    const salt = await bcrypt.genSalt(10);
    u.password = await bcrypt.hash(password, salt);
    u.resetToken = undefined; u.resetExpires = undefined;
    await u.save();
    res.json({ ok: true });
  }catch(e){ console.error(e); res.status(500).json({ error: 'Server error' }); }
});

module.exports = router;
