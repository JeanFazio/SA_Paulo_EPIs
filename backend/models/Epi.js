import conexao from '../config/database.js';

const listarEPIs = async () => {
  const res = await conexao.query('SELECT * FROM epis');
  return res.rows;
};

const criarEPI = async (nome, quantidade, status) => {
  const res = await conexao.query(
    'INSERT INTO epis (nome, quantidade, status) VALUES ($1, $2, $3) RETURNING *',
    [nome, quantidade, status]
  );
  return res.rows[0];
};

const editarEPI = async (id, nome, quantidade) => {
  // Determina o status com base na quantidade, caso a quantidade seja fornecida
  const status = quantidade > 0 ? 'Disponível' : 'Indisponível';

  // Criação da query
  let query = 'UPDATE epis SET ';
  const values = [];
  let count = 1; // Contador para parâmetros da query (ex: $1, $2, etc)

  if (nome) {
    query += `nome = $${count}, `;
    values.push(nome);
    count++;
  }

  if (quantidade !== undefined) {
    query += `quantidade = $${count}, `;
    values.push(quantidade);
    count++;

    // Inclui o status apenas se a quantidade foi passada
    query += `status = $${count}, `;
    values.push(status);
    count++;
  }

  // Remove a última vírgula e espaço extra
  query = query.slice(0, -2);

  // Completa a query com a condição WHERE
  query += ` WHERE id = $${count} RETURNING *`;
  values.push(id);

  const resultado = await conexao.query(query, values);
  return resultado.rows[0]; // Retorna o EPI atualizado
};

const deletarEPI = async (id) => {
  const resultado = await conexao.query(
    'DELETE FROM epis WHERE id = $1',
    [id]
  )
  return resultado.rows[0];
}
const retirarEPI = async (id, nomeFuncionario) => {
  // Consulta na tabela 'epis' para obter os dados do EPI
  const epi = await conexao.query(
    'SELECT * FROM epis WHERE id = $1',
    [id]
  );
  // Verifica se foi encontrado o EPI
  if (epi.rows.length === 0) {
    console.log('Nenhum EPI encontrado com o ID fornecido.');
    return null; // Retorna null se não encontrar dados
  }

  const epiData = epi.rows[0];

  // Verifica se há quantidade suficiente para a retirada
  if (epiData.quantidade <= 0) {
    console.log('Quantidade de EPI insuficiente para retirada.');
    return null; // Não permite retirar se não houver quantidade disponível
  }

  // Decrementa a quantidade
  const novaQuantidade = epiData.quantidade - 1;

  // Atualiza o status dependendo da nova quantidade
  const novoStatus = novaQuantidade > 0 ? 'Disponível' : 'Indisponível';

  // 2. Atualiza a quantidade do EPI na tabela 'epis'
  await conexao.query(
    'UPDATE epis SET quantidade = $1, status = $2 WHERE id = $3 RETURNING *',
    [novaQuantidade, novoStatus, id]
  );

  // 3. Insere no histórico a retirada do EPI
  const tipo = 'retirada';
  const data = new Date().toISOString().split('T')[0]; // Obtém a data atual no formato YYYY-MM-DD

  const resultado = await conexao.query(
    'INSERT INTO historico (nome, tipo, "data",funcionario) VALUES ($1, $2, $3,$4) RETURNING *',
    [epiData.nome, tipo, data, nomeFuncionario] // Passa os dados para a inserção no histórico
  );

  console.log('Histórico inserido:', resultado.rows[0]);
  return resultado.rows[0]; // Retorna o item inserido na tabela 'historico'
}

const devolverEPI = async (id, nomeFuncionario) => {
  // Consulta na tabela 'epis' para obter os dados do EPI
  const epi = await conexao.query(
    'SELECT * FROM epis WHERE id = $1',
    [id]
  );

  // Verifica se foi encontrado o EPI
  if (epi.rows.length === 0) {
    console.log('Nenhum EPI encontrado com o ID fornecido.');
    return null; // Retorna null se não encontrar dados
  }

  const epiData = epi.rows[0];

  // Incrementa a quantidade
  const novaQuantidade = epiData.quantidade + 1;
  // Atualiza o status para "Disponível"
  const novoStatus = novaQuantidade > 0 ? 'Disponível' : 'Indisponível';
  // Atualiza a quantidade e status no banco de dados
  await conexao.query(
    'UPDATE epis SET quantidade = $1, status = $2 WHERE id = $3 RETURNING *',
    [novaQuantidade, novoStatus, id]
  );

  // Define o tipo da operação como 'devolução'
  const tipo = 'devolução';
  const data = new Date().toISOString().split('T')[0]; // Obtém a data atual no formato YYYY-MM-DD

  // Registra no histórico a devolução do EPI
  const resultado = await conexao.query(
    'INSERT INTO historico (nome, tipo, "data",funcionario) VALUES ($1, $2, $3, $4) RETURNING *',
    [epiData.nome, tipo, data, nomeFuncionario] // Passa os dados para a inserção no histórico, incluindo o epi_id
  );

  console.log('Histórico de devolução inserido:', resultado.rows[0]);
  return resultado.rows[0]; // Retorna o item inserido na tabela 'historico'
}

const listarHistorico = async () => {
  const res = await conexao.query('SELECT * FROM historico');
  return res.rows;
};

const deletarHistorico = async (id) => {
  const resultado = await conexao.query(
    'DELETE FROM historico WHERE id = $1 RETURNING *',
    [id]
  );
  return resultado.rows[0];
};


export { listarEPIs, criarEPI, editarEPI, deletarEPI, retirarEPI, devolverEPI, listarHistorico, deletarHistorico }