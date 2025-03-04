const ejs = require("ejs");
const express = require("express");
const app = express();
const port = 3000;
const db = require("./models");
const mainRoutes = require("./routes/mainRoutes");
const cookieparser = require("cookie-parser");
const ws = require("ws");

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(cookieparser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", mainRoutes);

db.sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("DB 연결 성공, 테이블 생성됨");
  })
  .catch(console.error);

app.listen(3000);
