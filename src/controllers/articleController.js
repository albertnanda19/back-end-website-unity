const Article = require("../models/articleModel");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find(
      {},
      { __v: 0, "contents._id": 0, "contents.__v": 0 }
    );
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addArticle = async (req, res) => {
  const { title, thumbnail, contents } = req.body;

  try {
    const thumbnailName = `${uuidv4()}.png`;
    const thumbnailPath = path.join(
      __dirname,
      `../images/article-images/thumbnail/${thumbnailName}`
    );
    fs.writeFileSync(thumbnailPath, thumbnail, "base64");

    const images = contents.filter(
      (content) => content.content_type === "image"
    );
    images.forEach((image, index) => {
      const imageName = `${uuidv4()}.png`;
      const imagePath = path.join(
        __dirname,
        `../images/article-images/images/${imageName}`
      );
      fs.writeFileSync(imagePath, image.image_url, "base64");
      contents[index].image_url = imageName;
    });

    const newArticle = new Article({
      title,
      thumbnail: thumbnailName,
      contents,
    });
    await newArticle.save();
    res.status(201).json(newArticle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateArticle = async (req, res) => {
  const { title, thumbnail, contents } = req.body;

  try {
    const images = contents.filter(
      (content) => content.content_type === "image"
    );
    images.forEach((image, index) => {
      const imageName = `${uuidv4()}.png`;
      const imagePath = path.join(
        __dirname,
        "../src/images/article-images/images",
        imageName
      );
      fs.writeFileSync(imagePath, image.image_url, "base64");
      contents[index].image_url = imageName;
    });

    const updatedArticle = await Article.findByIdAndUpdate(
      req.params.idArticle,
      { title, thumbnail, contents },
      { new: true }
    );

    res.json(updatedArticle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.idArticle);

    const thumbnailPath = path.join(
      __dirname,
      "../src/images/article-images/thumbnail",
      article.thumbnail
    );
    fs.unlinkSync(thumbnailPath);

    article.contents.forEach((content) => {
      if (content.content_type === "image") {
        const imagePath = path.join(
          __dirname,
          "../src/images/article-images/images",
          content.image_url
        );
        fs.unlinkSync(imagePath);
      }
    });

    await Article.findByIdAndDelete(req.params.idArticle);
    res.json({ message: "Article deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllArticles,
  addArticle,
  updateArticle,
  deleteArticle,
};
