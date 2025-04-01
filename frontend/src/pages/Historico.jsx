import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../SASS/historicoStyle.scss';

const Historico = () => {
    const [movimentacoes, setMovimentacoes] = useState([]);

    useEffect(() => {
        async function fetchMovimentacoes() {
            try {
                const response = await axios.get('http://localhost:3000/epis/historico');
                setMovimentacoes(response.data);
            } catch (error) {
                console.error("Erro ao buscar movimentações:", error);
                setMovimentacoes([]);
            }
        }

        fetchMovimentacoes();
    }, []);

    const deletarHistorico = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/epis/historico/${id}`);
            setMovimentacoes(prev => prev.filter(item => item.id !== id));
        } catch (error) {
            console.error("Erro ao deletar histórico:", error);
        }
    };

    return (
        <div className="container">
            <header className="header">
                <div className="header-logo">
                    <img src="./src/assets/logo.png" alt="Logo" className="logo" />
                    <h1>Master EPIs Manager</h1>
                </div>
                <nav className="header-nav">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/Funcionarios" className="nav-link">Funcionários</Link>
                    <Link to="/Epi" className="nav-link">Equipamento</Link>
                    <Link to="/Historico" className="nav-link">Histórico</Link>
                </nav>
            </header>


            <section className='container-movimentacoes'>
                <h2>Histórico de Uso de EPIs</h2>
                <div className="movimentacoes-list">
                    {Array.isArray(movimentacoes) && movimentacoes.length > 0 ? (
                        movimentacoes.map((mov) => (
                            <div key={mov.id} className="movimentacao-card">
                                <h3>{mov.nome}</h3>
                                <p className="funcionario">Utilizado por: {mov.funcionario}</p>
                                <p className="data">Data: {new Date(mov.data).toLocaleDateString('pt-BR')}</p>
                                <button onClick={() => deletarHistorico(mov.id)}>Excluir</button>
                            </div>
                        ))
                    ) : (
                        <p>Sem movimentações para exibir.</p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Historico
