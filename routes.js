//importar o express
const express = require("express");

//roteador
const route = express.Router();

//importar os controllers
const homeController = require("./src/controllers/homeController");
const contatoController = require("./src/controllers/contatoController");

//Rotas da home:
route.get("/", homeController.paginaInicial);
route.post("/", homeController.trataPost);

//Rotas de contato:
route.get("/contato", contatoController.paginaInicial);

//exportar
module.exports = route;
