import { listarEPIs, criarEPI, editarEPI, deletarEPI, retirarEPI, devolverEPI, listarHistorico, deletarHistorico } from '../models/Epi.js';

const getEPIs = async (req, res) => {
  try {
    const epis = await listarEPIs();
    res.json(epis);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar EPIs' });
  }
};

const getHistorico = async (req, res) => {
  try {
    const epis = await listarHistorico();
    res.json(epis);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar Historico' });
  }
};

const deleteHistorico = async (req, res) => {
  const { id } = req.params;

  try {
    const historicoDeletado = await deletarHistorico(id);
    if (!historicoDeletado) {
      return res.status(404).json({ mensagem: 'Registro não encontrado' });
    }

    res.status(200).json({ mensagem: 'Registro deletado com sucesso', historicoDeletado });
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao deletar histórico', error: error.message });
  }
};


const emprestarEPI = async (req, res) => {
  try {
    const { id } = req.params;
    const { nomeFuncionario } = req.query; // Captura o parâmetro enviado na URL como query string

    if (!nomeFuncionario) {
      return res.status(400).json({ error: "O nome do funcionário é obrigatório." });
    }

    const epi = await retirarEPI(id, nomeFuncionario); // Passa o nome do funcionário para a lógica de retirada
    res.json(epi);
  } catch (error) {
    res.status(500).json({ error: error + " Erro ao emprestar EPIs" });
  }
};

const receberEPI = async (req, res) => {
  try {
    const { id } = req.params;
    const { nomeFuncionario } = req.query; // Captura o parâmetro enviado na URL como query string
    const epi = await devolverEPI(id, nomeFuncionario);
    res.json(epi);
  } catch (error) {
    res.status(500).json({ error: error + ' Erro ao devolver EPIs' });
  }
};

const postEPI = async (req, res) => {
  try {
    const { nome, quantidade } = req.body;
    // Definindo o status com base na quantidade em estoque
    const status = quantidade > 0 ? 'Disponível' : 'Indisponível';
    // Criando o EPI com o status calculado
    const novoEpi = await criarEPI(nome, quantidade, status);

    res.json(novoEpi);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar EPI', error });
  }
};

const putEPI = async (req, res) => {
  const { id } = req.params;
  const { nome, quantidade } = req.body;

  try {
    const epiAtualizado = await editarEPI(id, nome, quantidade);

    if (!epiAtualizado) {
      return res.status(404).send({ mensagem: 'EPI não encontrado' });
    }

    res.status(200).send({ mensagem: 'EPI atualizado com sucesso', epi: epiAtualizado });
  } catch (error) {
    res.status(500).send({ mensagem: 'Erro ao atualizar EPI', error: error.message });
  }
};

const deleteEPI = async (req, res) => {
  const { id } = req.params;

  try {
    const epiDelete = await deletarEPI(id)
    if (!epiDelete) {
      return res.status(200).send({ mensagem: 'EPI deletado com sucesso' });;
    }
  } catch (error) {
    res.status(500).send({ mensagem: 'Erro ao deletar EPI', error: error.message });
  }
};

export { getEPIs, postEPI, putEPI, deleteEPI, emprestarEPI, receberEPI, getHistorico, deleteHistorico }