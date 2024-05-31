import express from "express";
import path from "path";

const host = "0.0.0.0";
const porta = 3000;

let listaProdutos = [];

const app = express();
// Configurar o express para manipular corretamente os dados
// quando eles forem submetidos via método POST
app.use(express.urlencoded({ extended: true })); // Habilita a biblioteca QueryString

app.use(express.static(path.join(process.cwd(), "publico")));

function cadastrarProduto(requisicao, resposta) {
  const {
    codigoBarras,
    descricaoProduto,
    precoCusto,
    precoVenda,
    dataValidade,
    qtdEstoque,
    nomeFabricante,
  } = requisicao.body;

  // Verificando se os campos foram preenchidos (não estão vazios)
  let erros = {};
  if (!codigoBarras)
    erros.codigoBarras = "Por favor, informe o código de barras.";
  if (!descricaoProduto)
    erros.descricaoProduto = "Por favor, informe a descrição do produto.";
  if (!precoCusto) erros.precoCusto = "Por favor, informe o preço de custo.";
  if (!precoVenda) erros.precoVenda = "Por favor, informe o preço de venda.";
  if (!dataValidade)
    erros.dataValidade = "Por favor, informe a data de validade.";
  if (!qtdEstoque)
    erros.qtdEstoque = "Por favor, informe a quantidade em estoque.";
  if (!nomeFabricante)
    erros.nomeFabricante = "Por favor, informe o nome do fabricante.";

  if (Object.keys(erros).length === 0) {
    listaProdutos.push({
      codigoBarras,
      descricaoProduto,
      precoCusto,
      precoVenda,
      dataValidade,
      qtdEstoque,
      nomeFabricante,
    });
    resposta.redirect("/listarProdutos");
  } else {
    resposta.write(`
        <!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Página de Cadastro de Produtos</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
                integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
        </head>
        
        <body>
            <div class="container m-5">
                <form method="POST" action='/cadastrarProduto' class="border row g-3 needs-validation" novalidate>
                    <legend>Cadastro de Produtos</legend>
                    <div class="col-md-4">
                        <label for="codigoBarras" class="form-label">Código de barras:</label>
                        <input type="text" class="form-control" id="codigoBarras" name="codigoBarras" value="${codigoBarras}" required>
                        ${
                          erros.codigoBarras
                            ? `<div class="alert alert-danger mt-2" role="alert">${erros.codigoBarras}</div>`
                            : ""
                        }
                    </div>
                    <div class="col-md-4">
                        <label for="descricaoProduto" class="form-label">Descrição do produto:</label>
                        <input type="text" class="form-control" id="descricaoProduto" name="descricaoProduto" value="${descricaoProduto}" required>
                        ${
                          erros.descricaoProduto
                            ? `<div class="alert alert-danger mt-2" role="alert">${erros.descricaoProduto}</div>`
                            : ""
                        }
                    </div>
                    <div class="col-md-4">
                        <label for="precoCusto" class="form-label">Preço de custo:</label>
                        <div class="input-group has-validation">
                            <span class="input-group-text" id="inputGroupPrepend">R$</span>
                            <input type="text" class="form-control" id="precoCusto" name="precoCusto" value="${precoCusto}" aria-describedby="inputGroupPrepend" required>
                        </div>
                        ${
                          erros.precoCusto
                            ? `<div class="alert alert-danger mt-2" role="alert">${erros.precoCusto}</div>`
                            : ""
                        }
                    </div>
                    <div class="col-md-4">
                        <label for="precoVenda" class="form-label">Preço de venda:</label>
                        <div class="input-group has-validation">
                            <span class="input-group-text" id="inputGroupPrepend">R$</span>
                            <input type="text" class="form-control" id="precoVenda" name="precoVenda" value="${precoVenda}" aria-describedby="inputGroupPrepend" required>
                        </div>
                        ${
                          erros.precoVenda
                            ? `<div class="alert alert-danger mt-2" role="alert">${erros.precoVenda}</div>`
                            : ""
                        }
                    </div>
                    <div class="col-md-4">
                        <label for="dataValidade" class="form-label">Data de validade:</label>
                        <input type="date" class="form-control" id="dataValidade" name="dataValidade" value="${dataValidade}" required>
                        ${
                          erros.dataValidade
                            ? `<div class="alert alert-danger mt-2" role="alert">${erros.dataValidade}</div>`
                            : ""
                        }
                    </div>
                    <div class="col-md-4">
                        <label for="qtdEstoque" class="form-label">Qtd em estoque:</label>
                        <input type="number" class="form-control" id="qtdEstoque" name="qtdEstoque" value="${qtdEstoque}" required>
                        ${
                          erros.qtdEstoque
                            ? `<div class="alert alert-danger mt-2" role="alert">${erros.qtdEstoque}</div>`
                            : ""
                        }
                    </div>
                    <div class="col-md-4">
                        <label for="nomeFabricante" class="form-label">Nome do fabricante:</label>
                        <input list="fabricantes" class="form-control" id="nomeFabricante" name="nomeFabricante" value="${nomeFabricante}" required>
                        <datalist id="fabricantes">
                            <option value="Fabricante A">
                            <option value="Fabricante B">
                            <option value="Fabricante C">
                            <option value="Fabricante D">
                            <option value="Fabricante E">
                        </datalist>
                        ${
                          erros.nomeFabricante
                            ? `<div class="alert alert-danger mt-2" role="alert">${erros.nomeFabricante}</div>`
                            : ""
                        }
                    </div>
                    <div class="col-12 mb-3">
                        <button class="btn btn-primary" type="submit">Cadastrar</button>
                        <a class="btn btn-secondary" href="/">Voltar</a>                   
                    </div>
                </form>
            </div>
        </body>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
        crossorigin="anonymous"></script>
        </html>`);
    resposta.end(); // Finaliza o envio da resposta!
  }
}

// Quando um usuário enviar uma requisição do tipo POST
// para o endpoint 'http://localhost:3000/cadastrarProduto'
// executa a função 'cadastrarProduto()'
app.post("/cadastrarProduto", cadastrarProduto);

app.get("/listarProdutos", (req, resp) => {
  resp.write("<html>");
  resp.write("<head>");
  resp.write("<title>Resultado do cadastro</title>");
  resp.write('<meta charset="utf-8">');
  resp.write(
    '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">'
  );
  resp.write("</head>");
  resp.write("<body>");
  resp.write("<h1>Lista de Produtos</h1>");
  resp.write('<table class="table table-striped">');
  resp.write("<tr>");
  resp.write("<th>Código de Barras</th>");
  resp.write("<th>Descrição do Produto</th>");
  resp.write("<th>Preço de Custo</th>");
  resp.write("<th>Preço de Venda</th>");
  resp.write("<th>Data de Validade</th>");
  resp.write("<th>Qtd em Estoque</th>");
  resp.write("<th>Nome do Fabricante</th>");
  resp.write("</tr>");
  for (let i = 0; i < listaProdutos.length; i++) {
    resp.write("<tr>");
    resp.write(`<td>${listaProdutos[i].codigoBarras}</td>`);
    resp.write(`<td>${listaProdutos[i].descricaoProduto}</td>`);
    resp.write(`<td>${listaProdutos[i].precoCusto}</td>`);
    resp.write(`<td>${listaProdutos[i].precoVenda}</td>`);
    resp.write(`<td>${listaProdutos[i].dataValidade}</td>`);
    resp.write(`<td>${listaProdutos[i].qtdEstoque}</td>`);
    resp.write(`<td>${listaProdutos[i].nomeFabricante}</td>`);
    resp.write("</tr>");
  }
  resp.write("</table>");
  resp.write('<a href="/">Voltar</a>');
  resp.write("</body>");
  resp.write(
    '<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>'
  );
  resp.write("</html>");
  resp.end();
});

app.listen(porta, host, () => {
  console.log(`Servidor rodando em http://${host}:${porta}`);
});
