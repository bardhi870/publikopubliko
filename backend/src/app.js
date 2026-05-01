const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");

const routes = require("./routes");

const app = express();

/* SECURITY HEADERS */
app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);

/* CORS */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "https://publiko.biz",
      "https://www.publiko.biz"
    ],
    credentials: true
  })
);

/* BODY PARSER */
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

/* STATIC UPLOADS */
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);

app.get("/", (req, res) => {
  res.send("Backend working");
});

app.use("/api", routes);

module.exports = app;