const News = require("../models/newsModel");

const newsController = {
  getAllNews: async (req, res) => {
    try {
      const news = await News.find();
      res.json(news);
    } catch (error) {
      console.error("Error getting news:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  addNews: async (req, res) => {
    const { title, thumbnail, content } = req.body;

    try {
      const newNews = new News({ title, thumbnail, content });
      await newNews.save();
      res.json(newNews);
    } catch (error) {
      console.error("Error adding news:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  updateNews: async (req, res) => {
    const { idNews } = req.params;
    const { title, thumbnail, content } = req.body;

    try {
      const updatedNews = await News.findByIdAndUpdate(
        idNews,
        { title, thumbnail, content },
        { new: true }
      );

      if (!updatedNews) {
        return res.status(404).json({ error: "News not found" });
      }

      res.json(updatedNews);
    } catch (error) {
      console.error("Error updating news:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  deleteNews: async (req, res) => {
    const { idNews } = req.params;

    try {
      const deletedNews = await News.findByIdAndDelete(idNews);

      if (!deletedNews) {
        return res.status(404).json({ error: "News not found" });
      }

      res.json(deletedNews);
    } catch (error) {
      console.error("Error deleting news:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

module.exports = newsController;
