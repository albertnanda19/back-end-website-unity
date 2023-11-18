const Article = require("../models/articleModel");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find(
      {},
      { __v: 0, "contents._id": 0, "contents.__v": 0 }
    ).lean();

    const transformedArticles = articles.map((article) => {
      const transformedContents = article.contents.map((content) => ({
        ...content,
        id: content._id,
        _id: undefined,
      }));

      return {
        id: article._id,
        ...article,
        _id: undefined,
        contents: transformedContents,
      };
    });

    res.json(transformedArticles);
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

    const newContents = contents.map((content) => {
      if (content.content_type === "image") {
        const imageName = `${uuidv4()}.png`;
        const imagePath = path.join(
          __dirname,
          `../images/article-images/images/${imageName}`
        );
        fs.writeFileSync(imagePath, content.image_url, "base64");
        return {
          content_type: "image",
          image_url: imageName,
        };
      } else if (content.content_type === "text") {
        return {
          content_type: "text",
          text: content.text,
        };
      } else {
        throw new Error("Invalid content_type");
      }
    });

    const newArticle = new Article({
      title,
      thumbnail: thumbnailName,
      contents: newContents,
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
