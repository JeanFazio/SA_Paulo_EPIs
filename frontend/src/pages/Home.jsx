import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../SASS/homeStyle.scss';
import Header from '../components/Header';

function Home() {
    const containerVariants = {
        hidden: { opacity: 0, x: -60 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeOut', staggerChildren: 0.2 } }
    };
    const cardVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 80 } }
    };

    return (
        <motion.div className='container' initial='hidden' animate='visible' variants={containerVariants}>
            <Header />

            <main className="home-main-content">
                <motion.section className="home-intro card" variants={cardVariants} initial="hidden" animate="visible">
                    <h2>Bem-vindo ao Master EPIs Manager!</h2>
                    <p>
                        O <strong>Master EPIs Manager</strong> é um software web projetado para melhorar a gestão de Equipamentos de Proteção Individual (EPIs),
                        funcionários e os processos de retirada e devolução desses equipamentos.
                        <p>O objetivo é garantir a saúde do colaborador e proteger
                        o empregador de problemas legais, enquanto melhora a organização e o controle dos EPIs.</p> 
                    </p>
                </motion.section>

                <motion.section className="home-features card" variants={cardVariants} initial="hidden" animate="visible">
                    <h3>O que o sistema faz</h3>
                    <ul>
                        <motion.li whileHover={{ scale: 1.08, color: '#00fd65ff', x: 70 }}>Gestão de EPIs</motion.li>
                        <motion.li whileHover={{ scale: 1.08, color: '#00fd65ff', x: 70 }}>Gestão de Funcionários</motion.li>
                        <motion.li whileHover={{ scale: 1.08, color: '#00fd65ff', x: 70 }}>Controle de Retirada e Devolução de EPIs</motion.li>
                    </ul>
                </motion.section>

                <motion.section className="home-benefits card" variants={cardVariants} initial="hidden" animate="visible">
                    <h3>Benefícios do sistema</h3>
                    <p>
                        Este sistema ajudará a melhorar o processo organizacional e de gestão, facilitando o acesso e a visualização de dados
                        relacionados ao uso e devolução de EPIs. A principal meta é minimizar perdas materiais e pessoais, ao controlar o uso adequado
                        dos equipamentos de segurança.
                    </p>
                </motion.section>
            </main>

            <motion.footer className="footer" initial={{ y: 0, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7 }}>
                <p>&copy; 2024 Master EPIs Manager - Todos os direitos reservados.</p>
            </motion.footer>
        </motion.div>
    );
}

export default Home
