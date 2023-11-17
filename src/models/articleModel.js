const mongoose = require("mongoose");
const { Schema } = mongoose;

const contentSchema = new Schema({
  content_type: { type: String, enum: ["text", "image"], required: true },
  text: { type: String },
  image_url: { type: String },
});

const articleSchema = new Schema({
  title: { type: String, required: true },
  thumbnail: { type: String, required: true },
  contents: [contentSchema],
  _id: { type: Number, default: 0, unique: true },
});

articleSchema.pre("save", async function (next) {
  try {
    if (this.isNew) {
      const lastArticle = await mongoose
        .model("Article", articleSchema)
        .findOne({}, {}, { sort: { _id: -1 } });
      this._id = lastArticle ? lastArticle._id + 1 : 1;
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
