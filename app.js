const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./src/config/db");
const articleRoutes = require("./src/routes/ArticleRoutes");
const newsRoutes = require("./src/routes/newsRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

connectDB();

app.use("/article", articleRoutes);
app.use("/news", newsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
