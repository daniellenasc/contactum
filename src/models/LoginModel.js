const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");

const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const LoginModel = mongoose.model("Login", LoginSchema);

class Login {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.user = null;
  }

  async register() {
    this.valida(); //checa os dados
    if (this.errors.length > 0) return;

    await this.userExists(); //checa se o e-mail já foi cadastrado anteriormente
    if (this.errors.length > 0) return;

    const salt = bcryptjs.genSaltSync(); //criando o salt
    this.body.password = bcryptjs.hashSync(this.body.password, salt); //fazendo o hash da senha, baseado no valor da senha e no salt gerado
    try {
      this.user = await LoginModel.create(this.body);
    } catch (e) {
      console.error(e);
    }
  }

  async userExists() {
    const user = await LoginModel.findOne({ email: this.body.email });
    if (user) this.errors.push("E-mail already taken.");
  }

  valida() {
    this.cleanUp();
    //validação com o pacote validator
    //o email precisa ser válido: se o email não for válido, vai adicionar uma mensagem de erro no array this.erros
    if (!validator.isEmail(this.body.email)) this.errors.push("Invalid email.");
    //a senha precisa ter entre 3 e 50 caracteres
    if (this.body.password.length < 3 || this.body.password.length > 50)
      this.errors.push(
        "The password must be between 3 and 50 characters long."
      );
  }

  //para limpar o objeto
  cleanUp() {
    for (const key in this.body) {
      if (typeof this.body[key] !== "string") {
        this.body[key] = "";
      }
    }
    this.body = {
      email: this.body.email,
      password: this.body.password,
    };
  }
}

module.exports = Login;
