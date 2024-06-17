const errorMiddleware = require("./middlewares/errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();

const categories = require("./routes/category");
const products = require("./routes/product");

var cors = require("cors");

app.use(
  cors({
    origin: `${process.env.FRONTEND_URL}`,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

app.use("/api/v1", categories);
app.use("/api/v1", products);

app.use(errorMiddleware);

module.exports = app;
