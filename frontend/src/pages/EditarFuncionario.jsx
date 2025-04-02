import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import '../SASS/funcionarioStyle.scss'

function EditarFuncionario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listaFuncionarios, setListaFuncionarios] = useState([]);
  const [erro, setErro] = useState('')
  const [funcionario, setFuncionario] = useState({
    nome: '',
    cargo: '',
    setor: '',
    email: ''
  });

  useEffect(() => {
    carregarFuncionario();
}, []);

  const handleChange = (e) => {
    setFuncionario({ ...funcionario, [e.target.name]: e.target.value });
  };

  const atualizarFuncionario = async (e) => {
    e.preventDefault();

    const nomeExistente = listaFuncionarios.some(funcionarioExistente =>
      funcionarioExistente.nome.toLowerCase() === funcionario.nome.toLowerCase()
    );
    if (nomeExistente) {
      setErro('Nome do funcionário já cadastrado!');
      return alert('Funcionário já cadastrado!');
    }
    setErro('');

    const dadosAtualizados = Object.fromEntries(
      Object.entries(funcionario).filter(([, value]) => value !== '')
    );
    try {
      await axios.put(`http://localhost:3000/funcionarios/${id}`, dadosAtualizados);
      navigate('/funcionarios');
    } catch (error) {
      console.error("Erro ao atualizar funcionário:", error);
    }
  };

  const carregarFuncionario = async () => {
    try {
      const response = await axios.get('http://localhost:3000/funcionarios');
      setListaFuncionarios(response.data);
    } catch (error) {
      console.error("Erro ao carregar funcionários:", error);
    }
  };

  return (
    <div className="editar-funcionario-page">
      <header className="header">
        <div className="header-logo">
          <button className='btn-voltar' onClick={() => navigate('/funcionarios')}>⬅</button>
          <h1>Master EPIs Manager</h1>
        </div>
      </header>

      <h2>Editar Funcionário</h2>
      <form onSubmit={atualizarFuncionario}>
        <input
          type="text"
          name="nome"
          value={funcionario.nome}
          onChange={handleChange}
          placeholder="Nome"
        />
        <input
          type="text"
          name="cargo"
          value={funcionario.cargo}
          onChange={handleChange}
          placeholder="Cargo"
        />
        <input
          type="text"
          name="setor"
          value={funcionario.setor}
          onChange={handleChange}
          placeholder="Setor"
        />
        <input
          type="email"
          name="email"
          value={funcionario.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <button type="submit">Salvar Alterações</button>
      </form>
    </div>
  );
}

export default EditarFuncionario;