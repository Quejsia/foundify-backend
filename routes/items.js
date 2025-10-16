// 📦 routes/items.js
const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
const { v2: cloudinary } = require("cloudinary");

// List all items
router.get("/", async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

// Create new lost/found item
router.post("/", async (req, res) => {
  try {
    const { title, description, image, type, location } = req.body;
    if (!title || !description || !type)
      return res.status(400).json({ error: "Missing fields" });

    let imageUrl = null;
    if (image) {
      const uploaded = await cloudinary.uploader.upload(image, {
        folder: "foundify_uploads",
      });
      imageUrl = uploaded.secure_url;
    }

    const item = new Item({
      title,
      description,
      image: imageUrl,
      type,
      location,
    });

    await item.save();
    res.json(item);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
