//importar o express
const express = require("express");

//roteador
const route = express.Router();

//importar os controllers
const homeController = require("./src/controllers/homeController");
const loginController = require("./src/controllers/loginController");

//Rotas da home:
route.get("/", homeController.index);

//Rotas de login
route.get("/login/index", loginController.index);
route.post("/login/register", loginController.register);

//exportar
module.exports = route;
