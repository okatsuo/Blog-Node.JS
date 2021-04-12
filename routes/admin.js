const express = require("express");
const { model } = require("mongoose");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/Categoria");
const Categoria = mongoose.model("categorias");

//página principal, quando acaba de acessar a página.
router.get("/", (req, res) => {
  res.send("aaa");
});

router.get("/posts", (req, res) => {
  res.send("página dos posts");
});

router.get("/categorias", (req, res) => {
  Categoria.find()
    .sort({ date: "desc" })
    .lean()
    .then((categorias) => {
      res.render("admin/categorias", { categorias: categorias });
    })
    .catch(() => {
      req.flash("error_msg", "Houve um erro ao carregar as categorias");
      res.redirect("/admin");
    });
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
  } else {
    const novaCategoria = {
      nome: req.body.nome,
      slug: req.body.slug,
    };

    new Categoria(novaCategoria)
      .save()
      .then(() => {
        req.flash("success_msg", "Categoria criada com sucesso!");
        res.redirect("/admin/categorias");
      })
      .catch((err) => {
        req.flash("error_msg", "houve um erro ao cadastrar a categoria!");
        res.redirect("/admin");
      });
  }
});

router.get("/categorias/edit/:id", (req, res) => {
  Categoria.findOne({ _id: req.params.id })
    .lean()
    .then((categoria) => {
      res.render("admin/editcategorias", { categoria: categoria });
    })
    .catch((err) => {
      req.flash("error_msg", "Esta categoria não existe");
      res.redirect("/admin/categorias");
    });
});

router.post("/categorias/edit", (req, res) => {
  Categoria.findOne({ _id: req.body.id })
    .then((categoria) => {
      categoria.nome = req.body.nome;
      categoria.slug = req.body.slug;

      categoria
        .save()
        .then(() => {
          req.flash("success_msg", "editado com sucesso");
          res.redirect("/admin/categorias");
        })
        .catch((err) => {
          req.flash("error_msg", "houve um erro ao salvar a edição");
          res.redirect("/admin/categorias");
        });
    })
    .catch((err) => {
      req.flash("error_msg", "houve um erro ao editar a categoria");
      res.redirect("/admin/categorias");
    });
});

router.post("/categorias/deletar", (req, res) => {
  Categoria.remove({ _id: req.body.id })
    .then(() => {
      req.flash("success_msg", "Categoria cadastrada com sucesso");
      res.redirect("/admin/categorias");
    })
    .catch((err) => {
      req.flash("error_msg", "houve um erro ao deletar a categoria");
      res.redirect("/admin/categorias");
    });
});

module.exports = router;
