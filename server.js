require('dotenv').config(); // Carregar variáveis de ambiente primeiro

const express = require("express");
const cors = require("cors");
const app = express();
const { salvarPessoa, salvarFilho, salvarCargo, salvarPessoaCargo, executeQuery } = require("./database"); // Adicione salvarPessoaCargo

app.use(cors());
app.use(express.json());

app.post('/pessoas', async (req, res) => {
  try {
    const { nome, dataNascimento, sexo, telefones, email, conjuge, pai, mae } = req.body;
    if (!nome || !dataNascimento || !sexo || !telefones || !email) {
      console.error('Campos obrigatórios faltando:', { nome, dataNascimento, sexo, telefones, email });
      return res.status(400).send({ message: 'Nome, data de nascimento, sexo, telefones e email são obrigatórios' });
    }
    console.log('Dados recebidos:', { nome, dataNascimento, sexo, telefones, email, conjuge, pai, mae }); // Log dos dados recebidos
    
    const pessoaId = await salvarPessoa({ nome, dataNascimento, sexo, telefones, email, conjuge, pai, mae });
    
    console.log('Pessoa cadastrada com ID:', pessoaId); // Log do ID da pessoa cadastrada

    res.status(201).send({ message: 'Pessoa cadastrada com sucesso!' });
  } catch (error) {
    console.error('Erro ao cadastrar pessoa:', error); // Log do erro
    res.status(500).send({ message: 'Erro ao cadastrar pessoa', error: error.message });
  }
});

app.post('/cargos', async (req, res) => {
  try {
    const { nome } = req.body;
    if (!nome) {
      console.error('Nome do cargo é obrigatório');
      return res.status(400).send({ message: 'Nome do cargo é obrigatório' });
    }
    console.log('Dados recebidos:', { nome }); // Log dos dados recebidos
    
    await salvarCargo({ nome });

    console.log('Cargo cadastrado com sucesso'); // Log do sucesso ao cadastrar cargo

    res.status(201).send({ message: 'Cargo cadastrado com sucesso!' });
  } catch (error) {
    console.error('Erro ao cadastrar cargo:', error); // Log do erro
    res.status(500).send({ message: 'Erro ao cadastrar cargo', error: error.message });
  }
});

app.get('/cargos', async (req, res) => {
  try {
    const rows = await executeQuery('SELECT * FROM cargos');
    console.log('Cargos carregados:', rows); // Log dos cargos carregados
    res.json(rows);
  } catch (err) {
    console.error('Erro ao obter cargos:', err); // Log do erro
    res.status(500).send('Erro ao obter cargos');
  }
});

app.get('/dados', async (req, res) => {
  try {
    const rows = await executeQuery('SELECT * FROM pessoas');
    console.log('Dados carregados:', rows); // Log para depuração
    res.json(rows);
  } catch (err) {
    console.error('Erro ao obter dados:', err); // Log do erro
    res.status(500).send('Erro ao obter dados');
  }
});

// Inicie o servidor na porta já configurada
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
