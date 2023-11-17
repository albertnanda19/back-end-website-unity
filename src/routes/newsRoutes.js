const express = require("express");
const newsController = require("../controllers/newsController");

const router = express.Router();

router.get("/news", newsController.getAllNews);
router.post("/add-news", newsController.addNews);
router.put("/update-news/:idNews", newsController.updateNews);
router.delete("/delete-news/:idNews", newsController.deleteNews);

module.exports = router;
