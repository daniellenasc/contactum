require("dotenv").config(); //variáveis de ambiente configuradas no .env
const express = require("express"); //inicia o express
const app = express();
const mongoose = require("mongoose"); //o mongoose gerencia o relacionamento entre dados, fornece a validação de esquemas e é usado como tradutor entre objetos no código e a representação desses objetos no MongoDB

//conectar com o banco de dados
mongoose
  .connect(process.env.CONNECTIONSTRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }) //retorna uma promise
  .then(() => {
    //console.log("connectei ao banco de dados!");
    app.emit("pronto"); //emite um evento informando que está conectado ao bd, para só depois o app começar a ouvir as requisições
  })
  .catch((e) => console.log(e));

const session = require("express-session"); //session é para identificar o navegador de um cliente, para o app salvar um cookie com um id, e toda vez que o cliente se conectar ao servidor, o cookie será enviado e saberá que o cliente já havia se conectado e já irá locar o cliente e seus dados no navegador
const MongoStore = require("connect-mongo"); //p/ salvar a session no banco de dados, pois por padrão, a session é salva na memória e usar memória em sessão de produção, poderemos ficar sem memória rapidamente
const flash = require("connect-flash"); //mensagens autodestrutivas (assim que lida, some da base de dados), sendo usadas para enviar feedback para o usuário (por ex. erro). essas mensagens são salvas na sessão.
const routes = require("./routes"); //rotas da aplicação (home, contato)
const path = require("path"); //caminhos absolutos
//const helmet = require("helmet"); //segurança: recomendação do express
const csrf = require("csurf"); //segurança: csrftokens para os formulários, que fazem com que nenhum app externo consiga postar coisas para dentro da nossa aplicação
const {
  middlewareGlobal,
  checkCsrfError,
  csrfMiddleware,
} = require("./src/middlewares/middleware"); //middlewares são funções que são executadas na rota

/* app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);  */ //usando o helmet
app.use(express.urlencoded({ extended: true })); //para postar formulário para dentro do app
app.use(express.json()); //para usar o json
app.use(express.static(path.resolve(__dirname, "public"))); //arquivos estáticos que devem ser acessados diretamente (ex: imagens, css, js)
//configurar a sessão:
const sessionOptions = session({
  secret: "akasdfj0út23453456+54qt23qv  qwf qwer qwer qewr asdasdasda a6()",
  store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
  resave: false,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, //quanto tempo em ms o cookie vai durar
    httpOnly: true,
  },
});
app.use(sessionOptions);
app.use(flash());
app.set("views", path.resolve(__dirname, "src", "views")); //views são os arquivos renderizados na tela
app.set("view engine", "ejs"); //a engine usada para renderizar o html será o ejs
app.use(csrf());

//Nossos próprios middlewares
//todas as requisições de todas as rotão passarão por esses middlewares
app.use(middlewareGlobal);
app.use(checkCsrfError);
app.use(csrfMiddleware);

app.use(routes); //chamando as rotas

//"porteiro"
app.on("pronto", () => {
  app.listen(3000, () => {
    console.log("Acessar http://localhost:3000");
    console.log("Servidor executando na porta 3000");
  });
});
