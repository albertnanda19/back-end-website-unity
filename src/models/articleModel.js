const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({
  content_type: { type: String, enum: ["text", "image"], required: true },
  text: { type: String },
  image_url: { type: String },
});

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  thumbnail: { type: String, required: true },
  contents: [contentSchema],
});

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
