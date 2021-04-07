const express = require("express");
const { model } = require("mongoose");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("admin/index");
});

router.get("/posts", (req, res) => {
  res.send("página dos posts");
});

router.get("/categorias", (req, res) => {
  res.render("admin/categorias");
});

module.exports = router;
