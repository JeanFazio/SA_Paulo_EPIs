import { useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../SASS/funcionarioStyle.scss';
import Header from '../components/Header';

function Funcionario() {
    const [funcionario, setFuncionario] = useState({
        nome: '',
        cargo: '',
        setor: '',
        email: ''
    });
    const [listaFuncionarios, setListaFuncionarios] = useState([]);
    const [erro, setErro] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});

    const [filtroNome, setFiltroNome] = useState('');
    const [filtroCargo, setFiltroCargo] = useState('');
    const [filtroSetor, setFiltroSetor] = useState('');

    const [modalOpen, setModalOpen] = useState(false);
    const [editFuncionario, setEditFuncionario] = useState(null);
    const [editErro, setEditErro] = useState('');
    const [editFieldErrors, setEditFieldErrors] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        carregarFuncionario();
    }, []);

    const handleChange = (e) => {
        setFuncionario({ ...funcionario, [e.target.name]: e.target.value });
    };

    const cadastrar = async (e) => {
        e.preventDefault();
        let errors = {};
        if (!funcionario.nome) errors.nome = 'Preencha o nome.';
        if (!funcionario.cargo) errors.cargo = 'Preencha o cargo.';
        if (!funcionario.setor) errors.setor = 'Preencha o setor.';
        if (!funcionario.email) errors.email = 'Preencha o email.';

        setFieldErrors(errors);
        setErro('');
        if (Object.keys(errors).length > 0) return;

        const nomeExistente = listaFuncionarios.some(funcionarioExistente =>
            funcionarioExistente.nome.toLowerCase() === funcionario.nome.toLowerCase()
        );
        if (nomeExistente) {
            setErro('Nome do Funcionário já cadastrado.');
            return alert('Funcionário já cadastrado!');
        }
        try {
            await axios.post('http://localhost:3000/funcionarios', funcionario);
            setFuncionario({ nome: '', cargo: '', setor: '', email: '' });
            setFieldErrors({});
            carregarFuncionario(); 
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                setErro(error.response.data.error);
            } else {
                setErro('Erro ao cadastrar funcionário.');
            }
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

    const deletarFuncionario = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/funcionarios/${id}`);
            setListaFuncionarios(listaFuncionarios.filter(func => func.id !== id));
            console.log("Funcionário deletado com sucesso");
        } catch (error) {
            console.error("Erro ao deletar funcionário:", error);
        }
    };

    const abrirModalEdicao = (func) => {
        setEditFuncionario({ ...func });
        setEditErro('');
        setEditFieldErrors({});
        setModalOpen(true);
    };

    const fecharModalEdicao = () => {
        setModalOpen(false);
        setEditFuncionario(null);
        setEditErro('');
        setEditFieldErrors({});
    };

    const handleEditChange = (e) => {
        setEditFuncionario({ ...editFuncionario, [e.target.name]: e.target.value });
    };

    const salvarEdicao = async (e) => {
        e.preventDefault();
        let errors = {};
        if (!editFuncionario.nome) errors.nome = 'Preencha o nome.';
        if (!editFuncionario.cargo) errors.cargo = 'Preencha o cargo.';
        if (!editFuncionario.setor) errors.setor = 'Preencha o setor.';
        if (!editFuncionario.email) errors.email = 'Preencha o email.';
        setEditFieldErrors(errors);
        setEditErro('');
        if (Object.keys(errors).length > 0) return;

        // Verifica se nome já existe (exceto o próprio)
        const nomeExistente = listaFuncionarios.some(func =>
            func.nome.toLowerCase() === editFuncionario.nome.toLowerCase() && func.id !== editFuncionario.id
        );
        if (nomeExistente) {
            setEditErro('Nome do Funcionário já cadastrado.');
            return;
        }
        try {
            await axios.put(`http://localhost:3000/funcionarios/${editFuncionario.id}`, editFuncionario);
            fecharModalEdicao();
            carregarFuncionario();
        } catch (error) {
            setEditErro('Erro ao atualizar funcionário.');
        }
    };

    const funcionariosFiltrados = listaFuncionarios.filter(func =>
        func.nome.toLowerCase().includes(filtroNome.toLowerCase()) &&
        func.cargo.toLowerCase().includes(filtroCargo.toLowerCase()) &&
        func.setor.toLowerCase().includes(filtroSetor.toLowerCase())
    );

    return (
        <div className="funcionario-page container">
            <Header />
            <main className="funcionario-main-content">
                <section className="intro">
                    <div style={{textAlign: 'center', marginBottom: '1.5rem'}}>
                        <img src="/src/assets/logo.png" alt="Logo" style={{width: '3.5rem', marginBottom: '0.5rem', opacity: 0.8}} />
                        <h2>Cadastro de Funcionário</h2>
                        <p style={{fontSize: '1rem', color: '#555', margin: '0 auto', maxWidth: '22rem'}}>Adicione novos funcionários à equipe de forma rápida e fácil. Todos os campos são obrigatórios.</p>
                    </div>
                    <form onSubmit={cadastrar} autoComplete="off">
                        {erro && <div className="form-error-global" role="alert">{erro}</div>}
                        <div className="form-group">
                            <label htmlFor="nome" style={{fontWeight: 500, marginBottom: '0.3rem'}}>Nome</label>
                            <input id='nome' type="text" name="nome" onChange={handleChange} value={funcionario.nome} placeholder="Nome completo" autoFocus />
                            {fieldErrors.nome && <div className="form-error-field">{fieldErrors.nome}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="cargo" style={{fontWeight: 500, marginBottom: '0.3rem'}}>Cargo</label>
                            <input id='cargo' type="text" name="cargo" onChange={handleChange} value={funcionario.cargo} placeholder="Cargo" />
                            {fieldErrors.cargo && <div className="form-error-field">{fieldErrors.cargo}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="setor" style={{fontWeight: 500, marginBottom: '0.3rem'}}>Setor</label>
                            <input id='setor' type="text" name="setor" onChange={handleChange} value={funcionario.setor} placeholder="Setor" />
                            {fieldErrors.setor && <div className="form-error-field">{fieldErrors.setor}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="email" style={{fontWeight: 500, marginBottom: '0.3rem'}}>Email</label>
                            <input id='email' type="email" name="email" onChange={handleChange} value={funcionario.email} placeholder="Email" />
                            {fieldErrors.email && <div className="form-error-field">{fieldErrors.email}</div>}
                        </div>
                        <button type="submit" className="btn-cadastrar">Cadastrar</button>
                    </form>
                </section>

                <section className="lista-funcionarios">
                    <div style={{textAlign: 'center', marginBottom: '1.2rem'}}>
                        <h2>Funcionários Cadastrados</h2>
                        <p style={{fontSize: '1rem', color: '#555', margin: '0 auto', maxWidth: '22rem'}}>Veja, filtre e edite os funcionários cadastrados. Use os campos de busca para encontrar rapidamente.</p>
                    </div>
                    <div className="filtro-funcionarios">
                        <input
                            type="text"
                            placeholder="Buscar por nome"
                            value={filtroNome}
                            onChange={(e) => setFiltroNome(e.target.value)}
                            aria-label="Buscar por nome"
                        />
                        <input
                            type="text"
                            placeholder="Filtrar por cargo"
                            value={filtroCargo}
                            onChange={(e) => setFiltroCargo(e.target.value)}
                            aria-label="Filtrar por cargo"
                        />
                        <input
                            type="text"
                            placeholder="Filtrar por setor"
                            value={filtroSetor}
                            onChange={(e) => setFiltroSetor(e.target.value)}
                            aria-label="Filtrar por setor"
                        />
                    </div>
                    <div className="funcionarios-cards">
                        {funcionariosFiltrados.length === 0 ? (
                            <div style={{textAlign: 'center', color: '#888', fontSize: '1.1rem', padding: '2rem 0'}}>Nenhum funcionário encontrado.</div>
                        ) : (
                            funcionariosFiltrados.map((func, index) => (
                                <div key={index} className="funcionario-card">
                                    <h3 style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                                        <FaUser style={{fontSize: '1.2rem', opacity: 0.7, color: '#43ba7c'}} />
                                        {func.nome}
                                    </h3>
                                    <p><strong>Cargo:</strong> {func.cargo}</p>
                                    <p><strong>Setor:</strong> {func.setor}</p>
                                    <p><strong>Email:</strong> {func.email}</p>
                                    <div style={{display: 'flex', gap: '0.5rem', marginTop: '0.7rem'}}>
                                        <button className="btn-editar"
                                            title="Editar funcionário"
                                            onClick={() => abrirModalEdicao(func)}>
                                            Editar
                                        </button>
                                        <button className="btn-deletar"
                                            title="Deletar funcionário"
                                            onClick={() => deletarFuncionario(func.id)}>
                                            Deletar
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </main>

        {modalOpen && (
            <div className="modal-overlay">
                <div className="modal-content">
                    <button className="modal-close" onClick={fecharModalEdicao} title="Fechar">×</button>
                    <h2 style={{marginBottom: '1rem'}}>Editar Funcionário</h2>
                    <form onSubmit={salvarEdicao} autoComplete="off">
                        {editErro && <div className="form-error-global" role="alert">{editErro}</div>}
                        <div className="form-group">
                            <label htmlFor="edit-nome" style={{fontWeight: 500, marginBottom: '0.3rem'}}>Nome</label>
                            <input id="edit-nome" type="text" name="nome" value={editFuncionario.nome} onChange={handleEditChange} placeholder="Nome completo" autoFocus />
                            {editFieldErrors.nome && <div className="form-error-field">{editFieldErrors.nome}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="edit-cargo" style={{fontWeight: 500, marginBottom: '0.3rem'}}>Cargo</label>
                            <input id="edit-cargo" type="text" name="cargo" value={editFuncionario.cargo} onChange={handleEditChange} placeholder="Cargo" />
                            {editFieldErrors.cargo && <div className="form-error-field">{editFieldErrors.cargo}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="edit-setor" style={{fontWeight: 500, marginBottom: '0.3rem'}}>Setor</label>
                            <input id="edit-setor" type="text" name="setor" value={editFuncionario.setor} onChange={handleEditChange} placeholder="Setor" />
                            {editFieldErrors.setor && <div className="form-error-field">{editFieldErrors.setor}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="edit-email" style={{fontWeight: 500, marginBottom: '0.3rem'}}>Email</label>
                            <input id="edit-email" type="email" name="email" value={editFuncionario.email} onChange={handleEditChange} placeholder="Email" />
                            {editFieldErrors.email && <div className="form-error-field">{editFieldErrors.email}</div>}
                        </div>
                        <button type="submit" className="btn-cadastrar">Salvar Alterações</button>
                    </form>
                </div>
            </div>
        )}
        </div>
    );
}

export default Funcionario;