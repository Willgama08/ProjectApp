// database.js

const oracledb = require('oracledb');
require('dotenv').config(); // Carregar variáveis de ambiente

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

async function getConnection() {
  try {
    const connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONNECT_STRING,
    });
    console.log('Conexão com Oracle DB estabelecida com sucesso!');
    return connection;
  } catch (err) {
    console.error('Erro ao conectar no Oracle DB:', err);
    throw err;
  }
}

async function salvarPessoa(pessoa) {
  const connection = await getConnection();
  try {
    console.log('Salvando pessoa:', pessoa); // Log para depuração
    const result = await connection.execute(
      `INSERT INTO pessoas (nome, data_nascimento, sexo, telefones, email, conjuge, pai, mae) 
       VALUES (:nome, TO_DATE(:dataNascimento, 'YYYY-MM-DD'), :sexo, :telefones, :email, :conjuge, :pai, :mae) RETURNING id INTO :id`,
      {
        nome: pessoa.nome,
        dataNascimento: pessoa.dataNascimento,
        sexo: pessoa.sexo,
        telefones: pessoa.telefones,
        email: pessoa.email,
        conjuge: pessoa.conjuge,
        pai: pessoa.pai,
        mae: pessoa.mae,
        id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      },
      { autoCommit: true }
    );
    console.log('Pessoa salva com sucesso:', result);
    return result.outBinds.id[0];
  } catch (err) {
    console.error('Erro ao salvar pessoa:', err);
    throw err;
  } finally {
    await connection.close();
  }
}

async function salvarFilho(filho) {
  const connection = await getConnection();
  try {
    console.log('Salvando filho:', filho); // Log para depuração
    const result = await connection.execute(
      `INSERT INTO filhos (nome_filho, data_nascimento, pai_id, mae_id) 
       VALUES (:nome_filho, TO_DATE(:data_nascimento, 'YYYY-MM-DD'), :pai_id, :mae_id)`,
      filho,
      { autoCommit: true }
    );
    console.log('Filho salvo com sucesso:', result);
  } catch (err) {
    console.error('Erro ao salvar filho:', err);
    throw err;
  } finally {
    await connection.close();
  }
}

async function salvarDepartamento(departamento) {
  const connection = await getConnection();
  try {
    const result = await connection.execute(
      `INSERT INTO departamentos (nome) 
       VALUES (:nome)`,
      departamento,
      { autoCommit: true }
    );
    console.log('Departamento salvo com sucesso:', result);
  } catch (err) {
    console.error('Erro ao salvar departamento:', err);
    throw err;
  } finally {
    await connection.close();
  }
}

async function salvarFuncao(funcao) {
  const connection = await getConnection();
  try {
    const result = await connection.execute(
      `INSERT INTO funcoes (nome) 
       VALUES (:nome)`,
      funcao,
      { autoCommit: true }
    );
    console.log('Função salva com sucesso:', result);
  } catch (err) {
    console.error('Erro ao salvar função:', err);
    throw err;
  } finally {
    await connection.close();
  }
}

async function salvarCargo(cargo) {
  const connection = await getConnection();
  try {
    const result = await connection.execute(
      `INSERT INTO cargos (nome) 
       VALUES (:nome)`,
      { nome: cargo.nome },
      { autoCommit: true }
    );
    console.log('Cargo salvo com sucesso:', result);
  } catch (err) {
    console.error('Erro ao salvar cargo:', err);
    throw err;
  } finally {
    await connection.close();
  }
}

async function salvarPessoaDepartamento(pessoaDepartamento) {
  const connection = await getConnection();
  try {
    const result = await connection.execute(
      `INSERT INTO pessoas_departamentos (pessoa_id, departamento_id) 
       VALUES (:pessoa_id, :departamento_id)`,
      pessoaDepartamento,
      { autoCommit: true }
    );
    console.log('Pessoa-Departamento salvo com sucesso:', result);
  } catch (err) {
    console.error('Erro ao salvar Pessoa-Departamento:', err);
    throw err;
  } finally {
    await connection.close();
  }
}

async function salvarPessoaFuncao(pessoaFuncao) {
  const connection = await getConnection();
  try {
    const result = await connection.execute(
      `INSERT INTO pessoas_funcoes (pessoa_id, funcao_id) 
       VALUES (:pessoa_id, :funcao_id)`,
      pessoaFuncao,
      { autoCommit: true }
    );
    console.log('Pessoa-Função salvo com sucesso:', result);
  } catch (err) {
    console.error('Erro ao salvar Pessoa-Função:', err);
    throw err;
  } finally {
    await connection.close();
  }
}

async function salvarPessoaCargo(pessoaCargo) {
  const connection = await getConnection();
  try {
    console.log('Salvando pessoa-cargo:', pessoaCargo); // Log para depuração
    const result = await connection.execute(
      `INSERT INTO pessoas_cargos (pessoa_id, cargo_id) 
       VALUES (:pessoa_id, :cargo_id)`,
      pessoaCargo,
      { autoCommit: true }
    );
    console.log('Pessoa-Cargo salvo com sucesso:', result);
  } catch (err) {
    console.error('Erro ao salvar pessoa-cargo:', err);
    throw err;
  } finally {
    await connection.close();
  }
}

async function createPool() {
  try {
    await oracledb.createPool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONNECT_STRING,
      poolMin: 1,
      poolMax: 10,
      poolIncrement: 1,
    });
    console.log('Pool de conexões criado com sucesso!');
  } catch (err) {
    console.error('Erro ao criar pool de conexões:', err);
    throw err;
  }
}

async function executeQuery(query, params = []) {
  const connection = await getConnection();
  try {
    console.log('Executando query:', query, 'com parâmetros:', params); // Log para depuração
    const result = await connection.execute(query, params, { autoCommit: true });
    console.log('Resultado da query:', result); // Log para depuração
    return result.rows;
  } catch (err) {
    console.error('Erro ao executar query:', err);
    throw err;
  } finally {
    await connection.close();
  }
}

module.exports = { getConnection, salvarPessoa, salvarFilho, salvarDepartamento, salvarFuncao, salvarCargo, salvarPessoaDepartamento, salvarPessoaFuncao, salvarPessoaCargo, createPool, executeQuery };
