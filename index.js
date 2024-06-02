import express from "express";
import path from "path";
import session from "express-session";
//Não é o HTTP que agora terá o estado e sim a nossa aplicação.
//Esse estado é conhecido como sessão.

//Para permitir que informações sejam mantidas e trocadas entre cliente e servidor,
//tais informações podem ser armazenadas em cookies.
//Para possibilitar que nossa aplicação manipule cookies será necessário instalar
//o módulo cookieParser (npm install cookie-parser);
import cookieParser from "cookie-parser";

const host = "0.0.0.0";
const porta = 3000;

let listaProdutos = [];

const app = express();

// Configuração da sessão
app.use(
  session({
    secret: "MinH4Ch4v3S3cr3t4", //chave para assinar os dados da sessão
    resave: true, //salva a sessão a cada requisição HTTP
    saveUninitialized: true,
    cookie: {
      //tempo de vida da sessão
      maxAge: 1000 * 60 * 15, //15 minutos
    },
  })
);
// Cookie Parser
app.use(cookieParser());

// Configuração para manipular dados POST
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use(express.static(path.join(process.cwd(), "publico")));

// Rota raiz redireciona para a página de login
app.get("/", (req, res) => {
  res.redirect("/login");
});

// Página de login
app.get("/login", (req, res) => {
  res.sendFile(path.join(process.cwd(), "publico", "login.html"));
});

// Processamento do login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Autenticação
  if (username === "usuario" && password === "senha") {
    res.cookie("ultimoAcesso", new Date().toLocaleString(), {
      maxAge: 900000,
      httpOnly: true,
    });
    req.session.username = username;
    res.redirect("/cadastrarProduto");
  } else {
    res.send(
      'Usuário ou senha inválidos. <a href="/login">Tente novamente</a>.'
    );
  }
});

// Página de cadastro de produtos
app.get("/cadastrarProduto", (req, res) => {
  if (!req.session.username) {
    res.send('Você precisa realizar o login. <a href="/login">Login</a>');
  } else {
    res.sendFile(
      path.join(process.cwd(), "protegido", "cadastrarProduto.html")
    );
  }
});

function cadastrarProduto(req, res) {
  const {
    codigoBarras,
    descricaoProduto,
    precoCusto,
    precoVenda,
    dataValidade,
    qtdEstoque,
    nomeFabricante,
  } = req.body;

  if (
    codigoBarras &&
    descricaoProduto &&
    precoCusto &&
    precoVenda &&
    dataValidade &&
    qtdEstoque &&
    nomeFabricante
  ) {
    if (parseFloat(precoVenda) > parseFloat(precoCusto)) {
      listaProdutos.push({
        codigoBarras,
        descricaoProduto,
        precoCusto,
        precoVenda,
        dataValidade,
        qtdEstoque,
        nomeFabricante,
      });
      res.redirect("/listarProdutos");
    } else {
      res.send(
        'O preço de venda deve ser maior que o preço de custo. <a href="/cadastrarProduto">Tente novamente</a>.'
      );
    }
  } else {
    res.send(
      'Todos os campos são obrigatórios. <a href="/cadastrarProduto">Tente novamente</a>.'
    );
  }
}

// Rota para cadastrar produto
app.post("/cadastrarProduto", cadastrarProduto);

// Rota para listar produtos cadastrados
app.get("/listarProdutos", (req, res) => {
  if (!req.session.username) {
    res.send('Você precisa realizar o login. <a href="/login">Login</a>');
  } else {
    res.write("<html>");
    res.write("<head>");
    res.write("<title>Produtos Cadastrados</title>");
    res.write('<meta charset="utf-8">');
    res.write(
      '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">'
    );
    res.write("</head>");
    res.write("<body>");
    res.write("<h1>Lista de Produtos</h1>");
    res.write(`<p>Último acesso: ${req.cookies.ultimoAcesso}</p>`);
    res.write('<table class="table table-striped">');
    res.write("<tr>");
    res.write("<th>Código de Barras</th>");
    res.write("<th>Descrição</th>");
    res.write("<th>Preço de Custo</th>");
    res.write("<th>Preço de Venda</th>");
    res.write("<th>Data de Validade</th>");
    res.write("<th>Quantidade em Estoque</th>");
    res.write("<th>Nome do Fabricante</th>");
    res.write("</tr>");
    for (let i = 0; i < listaProdutos.length; i++) {
      res.write("<tr>");
      res.write(`<td>${listaProdutos[i].codigoBarras}</td>`);
      res.write(`<td>${listaProdutos[i].descricaoProduto}</td>`);
      res.write(`<td>${listaProdutos[i].precoCusto}</td>`);
      res.write(`<td>${listaProdutos[i].precoVenda}</td>`);
      res.write(`<td>${listaProdutos[i].dataValidade}</td>`);
      res.write(`<td>${listaProdutos[i].qtdEstoque}</td>`);
      res.write(`<td>${listaProdutos[i].nomeFabricante}</td>`);
      res.write("</tr>");
    }
    res.write("</table>");
    res.write('<a href="/cadastrarProduto">Cadastrar novo produto</a>');
    res.write("</body>");
    res.write(
      '<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>'
    );
    res.write("</html>");
    res.end();
  }
});

app.listen(porta, host, () => {
  console.log(`Servidor rodando em http://${host}:${porta}`);
});
