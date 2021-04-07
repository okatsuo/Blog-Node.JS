//carregando os módulos
const express = require("express");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const app = express();
const admin = require("./routes/admin");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");

//Configurações
//session
app.use(
  session({
    secret: "segredosecreto",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());
//Middleware
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

//body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//handleBars
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//mongoose
mongoose.Promise = global.Promise;
mongoose
  .connect("mongodb://localhost/blogapp")
  .then(() => {
    console.log("conectado ao mongodb");
  })
  .catch((err) => {
    console.log("erro ao se conectar" + err);
  });

// Public

app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
  console.log("Salve, sou o MIDDLEWARE");
  next();
});

//Rotas
app.use("/admin", admin);
//Outros
const port = 8081;
app.listen(port, () => {
  console.log("servidor rodando!");
});
