import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../SASS/epiStyle.scss';
import Header from '../components/Header';

function Epi() {
    const [epi, setEpi] = useState({
        nome: '',
        quantidade: 0,
        status: ''
    });
    const [listaEPIs, setListaEPIs] = useState([]);
    const [listaFuncionarios, setListaFuncionarios] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalInput, setModalInput] = useState('');
    const [modalCallback, setModalCallback] = useState(null);

    // Modal de edição de EPI
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editEPI, setEditEPI] = useState(null);
    const [editErro, setEditErro] = useState('');
    const [editFieldErrors, setEditFieldErrors] = useState({});

    const [filtroNome, setFiltroNome] = useState('');
    const [filtroStatus, setFiltroStatus] = useState('');

    useEffect(() => {
        carregarEPIs();
        carregarFuncionarios();
    }, []);

    const handleChange = (e) => {
        setEpi({ ...epi, [e.target.name]: e.target.value });
    };

    const carregarFuncionarios = async () => {
        try {
            const response = await axios.get('http://localhost:3000/funcionarios');
            setListaFuncionarios(response.data);
        } catch (error) {
            console.error("Erro ao carregar funcionários:", error);
        }
    };

    const carregarEPIs = async () => {
        try {
            const response = await axios.get('http://localhost:3000/epis');
            setListaEPIs(response.data);
        } catch (error) {
            console.error("Erro ao carregar EPIs:", error);
        }
    };

    const cadastrarEPI = async (e) => {
        e.preventDefault();
        const nomeExistente = listaEPIs.some(epiExistente =>
            epiExistente.nome.toLowerCase() === epi.nome.toLowerCase()
        );

        if (nomeExistente) {
            return alert('EPI já cadastrado!');
        }

        try {
            await axios.post('http://localhost:3000/epis', epi);
            setEpi({ nome: '', quantidade: 0, status: '' });
            carregarEPIs();
        } catch (error) {
            console.error("Erro ao cadastrar EPI:", error);
        }
    };

    // Modal edição EPI
    const abrirModalEdicao = (epi) => {
        setEditEPI({ ...epi });
        setEditErro('');
        setEditFieldErrors({});
        setEditModalOpen(true);
    };

    const fecharModalEdicao = () => {
        setEditModalOpen(false);
        setEditEPI(null);
        setEditErro('');
        setEditFieldErrors({});
    };

    const handleEditChange = (e) => {
        setEditEPI({ ...editEPI, [e.target.name]: e.target.value });
    };

    const salvarEdicao = async (e) => {
        e.preventDefault();
        let errors = {};
        if (!editEPI.nome) errors.nome = 'Preencha o nome.';
        setEditFieldErrors(errors);
        setEditErro('');
        if (Object.keys(errors).length > 0) return;

        // Verifica se nome já existe (exceto o próprio)
        const nomeExistente = listaEPIs.some(epi =>
            epi.nome.toLowerCase() === editEPI.nome.toLowerCase() && epi.id !== editEPI.id
        );
        if (nomeExistente) {
            setEditErro('Nome do EPI já cadastrado.');
            return;
        }
        try {
            await axios.put(`http://localhost:3000/epis/${editEPI.id}`, editEPI);
            fecharModalEdicao();
            carregarEPIs();
        } catch (error) {
            setEditErro('Erro ao atualizar EPI.');
        }
    };

    const deletarEPI = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/epis/${id}`);
            setListaEPIs(listaEPIs.filter(epi => epi.id !== id));
        } catch (error) {
            console.error("Erro ao deletar EPI:", error);
        }
    };

    const openModal = (callback) => {
        setModalCallback(() => callback);
        setModalVisible(true);
    };

    const handleModalConfirm = () => {
        if (modalCallback) {
            modalCallback(modalInput);
        }
        setModalVisible(false);
        setModalInput('');
    };

    const retirarEPI = async (epi_id, quantidadeAtual) => {
        if (quantidadeAtual > 0) {
            openModal(async (nomeFuncionario) => {
                if (!nomeFuncionario) {
                    alert('Selecione um funcionário.');
                    return;
                }
                try {
                    await axios.post(
                        `http://localhost:3000/epis/retirar/${epi_id}?nomeFuncionario=${encodeURIComponent(nomeFuncionario)}`
                    );
                    alert('Retirado com sucesso');
                    carregarEPIs();
                } catch (error) {
                    console.error("Erro ao registrar movimentação:", error);
                }
            });
        } else {
            alert("Estoque insuficiente para retirada.");
        }
    };

    const devolverEPI = async (epi_id) => {
        openModal(async (nomeFuncionario) => {
            try {
                await axios.post(
                    `http://localhost:3000/epis/devolver/${epi_id}?nomeFuncionario=${encodeURIComponent(nomeFuncionario)}`
                );
                alert("Devolvido com sucesso");
                carregarEPIs();
            } catch (error) {
                console.error("Erro ao registrar movimentação:", error);
            }
        });
    };

    const episFiltrados = listaEPIs.filter(epi =>
        epi.nome.toLowerCase().includes(filtroNome.toLowerCase()) &&
        epi.status.toLowerCase().startsWith(filtroStatus.toLowerCase())
    );

    return (
        <div className='epi-page container'>
            <Header />


            <main className="epi-main-content">
                <section className="intro-epi">
                    <div style={{textAlign: 'center', marginBottom: '1.5rem'}}>
                        <h2>Cadastro de EPI</h2>
                        <p style={{fontSize: '1rem', color: '#555', margin: '0 auto', maxWidth: '22rem'}}>Adicione novos EPIs ao estoque. Todos os campos são obrigatórios.</p>
                    </div>
                    <form onSubmit={cadastrarEPI} autoComplete="off">
                        <div className="form-group">
                            <label htmlFor="nome" style={{fontWeight: 500, marginBottom: '0.3rem'}}>Nome</label>
                            <input id='nome' type="text" name="nome" onChange={handleChange} value={epi.nome} placeholder="Nome do equipamento" autoFocus />
                        </div>
                        <div className="form-group">
                            <label htmlFor="quantidade" style={{fontWeight: 500, marginBottom: '0.3rem'}}>Quantidade</label>
                            <input id='quantidade' type="number" name="quantidade" onChange={handleChange} value={epi.quantidade} placeholder="Quantidade" />
                        </div>
                        <button type="submit" className="btn-cadastrar">Cadastrar</button>
                    </form>
                </section>

                <section className="lista-epis">
                    <div style={{textAlign: 'center', marginBottom: '1.2rem'}}>
                        <h2>EPIs Cadastrados</h2>
                        <p style={{fontSize: '1rem', color: '#555', margin: '0 auto', maxWidth: '22rem'}}>Veja, filtre e edite os EPIs cadastrados. Use os campos de busca para encontrar rapidamente.</p>
                    </div>
                    <div className="filtro-epis">
                        <input
                            type="text"
                            placeholder="Buscar por nome"
                            value={filtroNome}
                            onChange={(e) => setFiltroNome(e.target.value)}
                            aria-label="Buscar por nome"
                        />
                        <input
                            type="text"
                            placeholder="Filtrar por status"
                            value={filtroStatus}
                            onChange={(e) => setFiltroStatus(e.target.value)}
                            aria-label="Filtrar por status"
                        />
                    </div>
                    <div className="epis-cards">
                        {episFiltrados.length === 0 ? (
                            <div style={{textAlign: 'center', color: '#888', fontSize: '1.1rem', padding: '2rem 0'}}>Nenhum EPI encontrado.</div>
                        ) : (
                            episFiltrados.map((epi) => (
                                <div key={epi.id} className="epi-card">
                                    <h3 style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                                        {/* Ícone pode ser adicionado aqui futuramente */}
                                        {epi.nome}
                                    </h3>
                                    <p><strong>Estoque:</strong> {epi.quantidade}</p>
                                    <p><strong>Status:</strong> {epi.status}</p>
                                    <div style={{display: 'flex', gap: '0.5rem', marginTop: '0.7rem'}}>
                                        <button className="btn-editar"
                                            title="Editar EPI"
                                            onClick={() => abrirModalEdicao(epi)}>
                                            Editar
                                        </button>
                                        <button className="btn-deletar"
                                            title="Deletar EPI"
                                            onClick={() => deletarEPI(epi.id)}>
                                            Deletar
                                        </button>
                                    </div>
                                    <div style={{display: 'flex', gap: '0.5rem', marginTop: '0.7rem'}}>
                                        <button className="btn-retirar" onClick={() => retirarEPI(epi.id, epi.quantidade)}>Retirar</button>
                                        <button className="btn-devolver" onClick={() => devolverEPI(epi.id)}>Devolver</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </main>

            {modalVisible && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <h3>Selecione o funcionário</h3>
                        <select
                            value={modalInput}
                            onChange={(e) => setModalInput(e.target.value)}
                        >
                            <option value="">Selecione</option>
                            {listaFuncionarios.map((funcionario) => (
                                <option key={funcionario.id} value={funcionario.nome}>
                                    {funcionario.nome}
                                </option>
                            ))}
                        </select>
                        <div className="modal-buttons">
                            <button className='btn-confirmar' onClick={handleModalConfirm}>Confirmar</button>
                            <button className='btn-cancelar' onClick={() => setModalVisible(false)}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            {editModalOpen && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <button className="modal-close" onClick={fecharModalEdicao} title="Fechar">×</button>
                        <h3 style={{marginBottom: '1rem'}}>Editar EPI</h3>
                        <form onSubmit={salvarEdicao} autoComplete="off">
                            {editErro && <div className="form-error-global" role="alert">{editErro}</div>}
                            <div className="form-group">
                                <label htmlFor="edit-nome" style={{fontWeight: 500, marginBottom: '0.3rem'}}>Nome</label>
                                <input id="edit-nome" type="text" name="nome" value={editEPI.nome} onChange={handleEditChange} placeholder="Nome do equipamento" autoFocus />
                                {editFieldErrors.nome && <div className="form-error-field">{editFieldErrors.nome}</div>}
                            </div>
                            <button type="submit" className="btn-cadastrar">Salvar Alterações</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Epi;
