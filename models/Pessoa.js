const mongoose = require('mongoose');

const PessoaSchema = new mongoose.Schema({
  nome: String,
  dataNascimento: Date,
  sexo: String,
  telefones: [String],
  email: String,
  departamentos: [String],
  funcoes: [String],
  conjuge: String,
  pai: String,
  mae: String,
  filhos: [String],
});

const Pessoa = mongoose.model('Pessoa', PessoaSchema);

module.exports = Pessoa;
