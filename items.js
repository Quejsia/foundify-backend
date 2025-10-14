const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const User = require('../models/User');
const auth = require('../middleware/auth');

router.post('/', auth, async (req,res)=>{
  try{
    const { title, description, location, type, photo, reward } = req.body;
    const it = new Item({ title, description, location, type, photo, owner: req.user._id, reward: reward||0, claimCode: Math.random().toString(36).slice(2,8) });
    await it.save();
    res.json(it);
  }catch(e){ console.error(e); res.status(500).json({ error: 'Server error' }); }
});

router.get('/', async (req,res)=>{
  try{
    const items = await Item.find().populate('owner','name email');
    res.json(items);
  }catch(e){ console.error(e); res.status(500).json({ error: 'Server error' }); }
});

router.post('/:id/claim', auth, async (req,res)=>{
  try{
    const it = await Item.findById(req.params.id);
    if(!it) return res.status(404).json({ error: 'Not found' });
    const reqObj = { requester: req.user._id, message: req.body.message||'', status: 'pending', time: Date.now() };
    it.claimRequests.push(reqObj); await it.save();
    res.json({ ok:true });
  }catch(e){ console.error(e); res.status(500).json({ error: 'Server error' }); }
});

router.post('/:id/verify', auth, async (req,res)=>{
  try{
    const it = await Item.findById(req.params.id);
    if(!it) return res.status(404).json({ error: 'Not found' });
    const code = req.body.code;
    if(code === it.claimCode || req.user.role === 'admin'){
      it.claimed = true; await it.save();
      const r = it.claimRequests[0];
      if(r){
        const user = await User.findById(r.requester);
        if(user && it.reward) { user.totalRewards = (user.totalRewards||0) + it.reward; await user.save(); }
      }
      res.json({ ok:true });
    } else res.status(400).json({ error: 'Invalid code' });
  }catch(e){ console.error(e); res.status(500).json({ error: 'Server error' }); }
});

module.exports = router;
