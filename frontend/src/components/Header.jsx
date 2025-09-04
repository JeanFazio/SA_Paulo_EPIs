import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../SASS/homeStyle.scss';

const navVariants = {
    hover: { scale: 1.1, color: '#8AF0B3', transition: { type: 'spring', stiffness: 300 } }
};

function Header() {
    return (
    <header className="header">
            <div className="header-logo">
                <motion.img src="./src/assets/logo.png" alt="Logo" className="logo" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.7 }}/>
                <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>Master EPIs Manager</motion.h1>
            </div>
            <nav className="header-nav">
                <motion.div style={{ display: 'flex', gap: '20px' }}>
                    <motion.div whileHover="hover" variants={navVariants}>
                        <Link to="/" className="nav-link">Home</Link>
                    </motion.div>
                    <motion.div whileHover="hover" variants={navVariants}>
                        <Link to="/Funcionarios" className="nav-link">Funcionários</Link>
                    </motion.div>
                    <motion.div whileHover="hover" variants={navVariants}>
                        <Link to="/Epi" className="nav-link">Equipamento</Link>
                    </motion.div>
                    <motion.div whileHover="hover" variants={navVariants}>
                        <Link to="/Historico" className="nav-link">Histórico</Link>
                    </motion.div>
                </motion.div>
            </nav>
    </header>
    );
}

export default Header;
