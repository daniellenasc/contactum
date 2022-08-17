const mongoose = require("mongoose");
const validator = require("validator");

const ContatoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  sobrenome: { type: String, required: false, default: "" },
  email: { type: String, required: false, default: "" },
  telefone: { type: String, required: false, default: "" },
  criadoEm: { type: Date, default: Date.now },
  criadoPor: { type: String },
});

const ContatoModel = mongoose.model("Contato", ContatoSchema);

function Contato(body) {
  this.body = body;
  this.errors = [];
  this.contato = null;
}

Contato.prototype.register = async function (criadoPor) {
  this.valida();
  this.body.criadoPor = criadoPor;
  if (this.errors.length > 0) return;
  this.contato = await ContatoModel.create(this.body);
};

Contato.prototype.valida = function () {
  this.cleanUp();

  //validação
  //o email precisa ser válido:

  if (this.body.email && !validator.isEmail(this.body.email))
    this.errors.push("Invalid email.");

  //obrigatório enviar um nome
  if (!this.body.nome) this.errors.push("Name is a required field.");

  //precisa haver um email ou um telefone
  if (!this.body.email && !this.body.telefone)
    this.errors.push("Email or phone number must be registered.");
};

Contato.prototype.cleanUp = function () {
  for (const key in this.body) {
    if (typeof this.body[key] !== "string") {
      this.body[key] = "";
    }
  }
  this.body = {
    nome: this.body.nome,
    sobrenome: this.body.sobrenome,
    email: this.body.email,
    telefone: this.body.telefone,
  };
};

Contato.prototype.edit = async function (id) {
  if (typeof id !== "string") return;
  this.valida();
  if (this.errors.length > 0) return;
  this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, {
    new: true,
  });
};

//Métodos estáticos (não vão para o prototype e não têm acesso ao this)
Contato.buscaPorId = async function (id) {
  if (typeof id !== "string") return;
  const user = await ContatoModel.findById(id);
  return user;
};

Contato.buscaContatos = async function (user) {
  try {
    //console.log(user);
    const contatos = await ContatoModel.find({ criadoPor: user }).sort({
      criadoEm: -1,
    });
    return contatos;
  } catch (e) {
    console.log(e);
    res.render("404");
  }
};

Contato.delete = async function (id) {
  if (typeof id !== "string") return;
  const contato = await ContatoModel.findOneAndDelete({ _id: id });
  return contato;
};

module.exports = Contato;
