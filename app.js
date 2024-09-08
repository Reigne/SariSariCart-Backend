const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");

const errorMiddleware = require("./middlewares/errors");
const categories = require("./routes/category");
const products = require("./routes/product");
const users = require("./routes/user");
const orders = require("./routes/order");

const allowedOrigins = [`http://localhost:3000`, `${process.env.FRONTEND_URL}`];

app.use(cookieParser());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use("/api/v1", categories);
app.use("/api/v1", products);
app.use("/api/v1", users);
app.use("/api/v1", orders);

app.use(errorMiddleware);

module.exports = app;
