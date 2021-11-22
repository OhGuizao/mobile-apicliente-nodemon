const nodemon = require("nodemon")

// Vamos construir um servidor usando o módulo do Express.
// Este módulo possue funções para executar e manipular um servidor node
// iniciaremos criando um referêcia do express com a importância do modulo
const express = require('express');

//Vamos importar o módulo mongoose que fará a interface entre o node.js e o banco da dados mongobd
const mongoose = require("mongoose");

//Local de conexão com o banco de dados
const url = "mongodb+srv://guilhermevfs:guilherme123@clustercliente.yaa0v.mongodb.net/primeiraapi?retryWrites=true&w=majority";
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })


// Vamos criar a estrutura de tabela cliente com o comando de Schema
const tabela = mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    cpf: { type: String, required: true, unique: true },
    usuario: { type: String, required: true, unique: true },
    senha: { type: String, required: true }
});

//Execucão da tabela
const cliente = mongoose.model("dbcliente", tabela)
//criar uma referência do servidor express para utilizá-lo
const app = express();

//fazer o servidor express recebr e tratar dados em formato json
app.use(express.json());

/*

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ CRUD ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Abaixo, iremos criar as 4 rotas para os verbos GET, POST, PUT, DELETE:
    GET -> Requisição e resposta do servidor
    POST -> Cadastro de dados 
    PUT -> Atualizar algum dado sobre um objeto
    DELETE -> Apagar algum dado sobre um objeto


    Ao final das rotas iremos aplicar ao servidor, uma porta de comunicação, no nosso caso será a porta 3000(porta padrão).


*/


//  ---------->  GET
app.get("/api/cliente/", (req, res) => {
    cliente.find((erro, dados) => {
        if (erro) {
            return res.status(400).send({ output: `Erro ao tentar ler os clientes : ${erro}` });
        }
        res.status(200).send({ output: dados });
    }

    );
});



//  ----------> POST
app.post("/api/cliente/cadastro", (req, res) => {
    res.send(`Os dados enviados foram ${req.body.nome}`)
});


//  ----------> PUT
app.put("/api/cliente/atualizar/:id", (req, res) => {
    res.send(`O  id passado foi o ${req.params.id} e os dados para atualizar são ${req.body}`);
});

// ----------> DELETE
app.delete("/api/cliente/deletar/:id", (req, res) => {
    res.send(`O id passado foi ${req.params.id}`);
});


app.listen(3000, () => console.log("Servidor online em http://localhost:3000"));

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~