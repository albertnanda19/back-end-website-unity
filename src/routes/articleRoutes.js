const express = require("express");
const router = express.Router();
const articleController = require("../controllers/ArticleController");

router.get("/articles", articleController.getAllArticles);
router.post("/add-article", articleController.addArticle);
router.put("/update-article/:idArticle", articleController.updateArticle);
router.delete("/delete-article/:idArticle", articleController.deleteArticle);

module.exports = router;
