// 🧾 models/Item.js
const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    type: {
      type: String,
      enum: ["lost", "found"],
      required: true,
    },
    location: {
      type: String,
    },
    reward: {
      type: Number,
      default: 0,
    },
    claimed: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Item", itemSchema);
