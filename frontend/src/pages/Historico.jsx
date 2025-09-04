import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import '../SASS/historicoStyle.scss';
import { FaTimes } from 'react-icons/fa';

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
            <Header />


            <section className='container-movimentacoes'>
                <h2>Histórico de Uso de EPIs</h2>
                <div className="movimentacoes-list">
                    {Array.isArray(movimentacoes) && movimentacoes.length > 0 ? (
                        movimentacoes.map((mov) => (
                            <div key={mov.id} className="movimentacao-card">
                                <button className="close-btn" onClick={() => deletarHistorico(mov.id)}>
                                    <FaTimes />
                                </button>
                                <h3>{mov.nome}</h3>
                                <p className="funcionario"><strong>Utilizado por:</strong> {mov.funcionario}</p>
                                <p className="data"><strong>Data:</strong> {new Date(mov.data).toLocaleDateString('pt-BR')}</p>
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
