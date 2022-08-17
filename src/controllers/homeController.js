/* const Contato = require("../models/ContatoModel");

exports.index = async (req, res) => {
  const contatos = await Contato.buscaContatos();
  res.render("index", { contatos });
};
 */

const Contato = require("../models/ContatoModel");
exports.index = async (req, res) => {
  let logado = false;
  if (req.session.user) {
    const contatos = await Contato.buscaContatos(req.session.user._id);
    res.render("index", { contatos }, logado);
  } else {
    let contatos = {};
    res.render("index", { contatos });
  }
};
