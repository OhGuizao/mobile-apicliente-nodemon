const nodemon = require("nodemon")


// Vamos construir um servidor usando o módulo do Express.
// Este módulo possue funções para executar e manipular um servidor node
// iniciaremos criando um referêcia do express com a importância do modulo
const express = require('express');

//Vamos importar o módulo mongoose que fará a interface entre o node.js e o banco da dados mongobd
const mongoose = require("mongoose");

//Importação do bcrypt para a criptografia de senhas
const bcrypt = require("bcrypt");

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

//Aplicação da cryptografia do bcrypt a tabela de cadastro de clientes será feita um passo antes do salvamento dos dados do cliente
// Vamos usar o comando pre
tabela.pre("save", function (next) {
    let cliente = this;
    if (!cliente.isModified('senha')) return next()
    bcrypt.hash(cliente.senha, 10, (erro, rs /*Resultado da cryptogração*/) => {
        if (erro) return console.log(`erro ao gerar a senha ->${erro}`);
        cliente.senha = rs;
        return next();
    })
});

//Execucão da tabela
const Cliente = mongoose.model("dbcliente", tabela)
//Criar uma referência do servidor express para utilizá-lo
const app = express();

//Fazer o servidor express recebr e tratar dados em formato json
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
    Cliente.find((erro, dados) => {
        if (erro) {
            return res.status(400).send({ output: `Erro ao tentar ler os clientes : ${erro}` });
        }
        res.status(200).send({ output: dados });
    }

    );
});

app.get("/api/cliente/:id", (req, res) => {
    Cliente.findById(req.params.id, (erro, dados) => {
        if (erro) {
            return res.status(400).send({ output: `Erro ao tentar ler os clientes : ${erro}` });
        }
        res.status(200).send({ output: dados });
    }

    );
});




//  ----------> POST
app.post("/api/cliente/cadastro", (req, res) => {
    const cliente = new Cliente(req.body);
    cliente.save().then(() => {
        res.status(201).send({ output: `Cliente cadastrado` })
    })
        .catch((erro) => res.status(400).send({ output: `Erro ao tentar cadastrar o cliente -> ${erro}` }))
});
app.post("/api/cliente/login", (req, res) => {
    const us = req.body.usuario;
    const pw = req.body.senha;
    Cliente.findOne({ usuario: us }, (erro, dados) => {
        if (erro) {
            return res.status(400).send({ output: `Usuário nao encontrado -. ${erro}` })
        }
        bcrypt.compare(pw, dados.senha, (erro, igual) => {
            if (erro) return res.status(400).send({ output: `Erro ao tentar logar ->${erro}` });
            if (!igual) return res.status(400).send({ output: `Erro ao tentar logar ->${erro}` });
            res.status(200).send({ output: `Logado`, payload: dados });
        });
    })
});

//  ----------> PUT
app.put("/api/cliente/atualizar/:id", (req, res) => {
    Cliente.findByIdAndUpdate(req.params.id, req.body, (erro, dados) => {
        if (erro) {
            return res.status(400).send({ output: `Erro ao tentar atualizar -> ${erro}` });
        }
        res.status(200).send({ output: `Dados atualizados` })
    })
});

// ----------> DELETE
app.delete("/api/cliente/deletar/:id", (req, res) => {
    Cliente.findByIdAndDelete(req.params.id, (erro, dados) => {
        if (erro) {
            return res.status(400).send({ output: `Erro ao tentar apagar o cliente ->${erro}` });
        }
        res.status(204).send({});
    })

});


app.listen(3000, () => console.log("Servidor online em http://localhost:3000"));

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~