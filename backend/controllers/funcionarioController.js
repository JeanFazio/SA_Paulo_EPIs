import { listarFuncionarios, criarFuncionario, editarFuncionario, deletarFuncionario } from '../models/Funcionario.js';

const getFuncionarios = async (req, res) => {
  try {
    const funcionarios = await listarFuncionarios();
    res.json(funcionarios);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar Funcionarios' });
  }
};

const postFuncionario = async (req, res) => {
  try {
    const { nome, cargo, setor, email } = req.body;
    if (!nome || !cargo || !setor || !email) {
      return res.status(400).json({ error: 'Preencha todos os campos obrigatórios: nome, cargo, setor e email.' });
    }
    const novoFuncionario = await criarFuncionario(nome, cargo, setor, email);
    res.json(novoFuncionario);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar Funcionario', error });
  }
};

const putFuncionario = async (req, res) => {
  const { id } = req.params;
  const dadosAtualizados = req.body;

  try {
    const funcionarioAtualizado = await editarFuncionario(id, dadosAtualizados);

    if (!funcionarioAtualizado) {
      return res.status(404).send({ mensagem: 'Funcionário não encontrado' });
    }

    res.status(200).send({ mensagem: 'Funcionário atualizado com sucesso', funcionario: funcionarioAtualizado });
  } catch (error) {
    res.status(500).send({ mensagem: 'Erro ao atualizar Funcionário', error: error.message });
  }
};


const deleteFuncionario = async (req, res) => {
  const { id } = req.params;

  try {
    const funcionarioDelete = await deletarFuncionario(id)
    if (!funcionarioDelete) {
      return res.status(200).send({ mensagem: 'Você foi promovido a cliente' });;
    }
  } catch (error) {
    res.status(500).send({ mensagem: 'Erro ao deletar Funcionario', error: error.message });
  }
};

export { getFuncionarios, postFuncionario, putFuncionario, deleteFuncionario }