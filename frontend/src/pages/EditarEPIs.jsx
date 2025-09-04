import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import '../SASS/epiStyle.scss'; 
import Header from '../components/Header';
function EditarEPI() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [epi, setEpi] = useState({
    nome: '',
    quantidade: '',
  });

  const handleChange = (e) => {
    setEpi({ ...epi, [e.target.name]: e.target.value });
  };

  const atualizarEpi = async (e) => {
    e.preventDefault();
    const dadosAtualizados = Object.fromEntries(
      Object.entries(epi).filter(([, value]) => value !== '')
    );
    
    try {
      await axios.put(`http://localhost:3000/epis/${id}`, dadosAtualizados);
      navigate('/Epi'); 
    } catch (error) {
      console.error("Erro ao atualizar EPI:", error);
    }
  };

  return (
    <div className="editar-epi-page">
  <Header />

      <h2>Editar EPI</h2>
      <form onSubmit={atualizarEpi}>
        <input
          type="text"
          name="nome"
          value={epi.nome}
          onChange={handleChange}
          placeholder="Nome do EPI"
        />
        <input
          type="number"
          name="quantidade"
          value={epi.quantidade}
          onChange={handleChange}
          placeholder="Quantidade"
        />
        <button type="submit">Salvar Alterações</button>
      </form>
    </div>
  );
}

export default EditarEPI;