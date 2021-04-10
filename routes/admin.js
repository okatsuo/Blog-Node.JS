const express = require("express");
const { model } = require("mongoose");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/Categoria");
const Categorias = mongoose.model("categorias");

//página principal, quando acaba de acessar a página.
router.get("/", (req, res) => {
  res.send("aaa");
});

router.get("/posts", (req, res) => {
  res.send("página dos posts");
});

router.get("/categorias", (req, res) => {
  res.render("admin/categorias");
});

router.get("/categorias/add", (req, res) => {
  res.render("admin/addcategorias");
});

router.post("/categorias/nova", (req, res) => {
  //validando para não receber formularios vazios
  var erros = [];
  //nome
  if (
    !req.body.nome ||
    typeof req.body.nome == undefined ||
    req.body.nome == null
  ) {
    erros.push({ texto: "nome inválido" });
  }
  //slug
  if (
    !req.body.slug ||
    typeof req.body.slug == undefined ||
    req.body.slug == null
  ) {
    erros.push({ texto: "slug inválido" });
  }
  //tamanho nome
  if (req.body.nome.length < 2) {
    erros.push({ texto: "nome da categoria muito pequeno" });
  }

  if (erros.length > 0) {
    res.render("admin/addcategorias", { erros: erros });
  }

  const novaCategoria = {
    nome: req.body.nome,
    slug: req.body.slug,
  };

  new Categorias(novaCategoria)
    .save()
    .then(() => {
      console.log("categoria salva com sucesso");
    })
    .catch((err) => {
      console.log("houve um erro ao cadastrar: " + err);
    });
});

module.exports = router;
