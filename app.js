const errorMiddleware = require("./middlewares/errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();

const categories = require("./routes/category");
const products = require("./routes/product");
const users = require("./routes/user");

var cors = require("cors");

const allowedOrigins = [`${process.env.FRONTEND_URL}`];

app.use(cookieParser());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

app.use(cors({
  origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
      } else {
          callback(new Error('Not allowed by CORS'));
      }
  },
  credentials: true,
}));


// app.use(
//   cors({
//     origin: `${process.env.FRONTEND_URL}`,
//     credentials: true,
//   })
// );



app.use("/api/v1", categories);
app.use("/api/v1", products);
app.use("/api/v1", users);

app.use(errorMiddleware);

module.exports = app;
