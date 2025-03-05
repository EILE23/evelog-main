const ejs = require("ejs");
const express = require("express");
const app = express();
const port = 3000;
const db = require("./models");
const mainRoutes = require("./routes/mainRoutes");
const bodyParser = require("body-parser");

const cookieparser = require("cookie-parser");
const ws = require("ws");

app.set("view engine", "ejs");
app.set("views", "./views");
app.use("/public", express.static("public"));
app.use("/uploads", express.static("uploads"));

// Increase payload limit
app.use(bodyParser.json({ limit: "50mb" })); // Adjust limit as needed
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true })); // Adjust limit as needed

app.use(cookieparser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", mainRoutes);

db.sequelize
  .sync({ alter: false, force: false }) //alter : true 속성이면 테이블이 생성되고 테이블이 생성 되어 있으면 생성x
  .then(() => {
    console.log("DB 연결 성공, 테이블 생성됨");
  })
  .catch(console.error);

app.listen(3000);
