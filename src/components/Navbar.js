import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    // La estructura de la barra de navegación
    <nav style={styles.navbar}>
      {/* Link de la marca (siempre vuelve al Home) */}
      <Link to="/" style={styles.brand}>
        ⚛️ Kodigo Bootcamp App
      </Link>
      
      {/* Contenedor de enlaces */}
      <div style={styles.links}>
        {/* Tu parte */}
        <Link to="/" style={styles.link}>Inicio (Bootcamps)</Link>
        
        {/* (Registro y Login) */}
        <Link to="/register" style={styles.link}>Crear Usuario</Link>
        <Link to="/login" style={styles.link}>Iniciar Sesión</Link>
        <Link to="/dashboard" style={styles.link}>Dashboard</Link>
      </div>
    </nav>
  );
}


const styles = {
    navbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 30px',
        backgroundColor: '#1a1a2e', 
        color: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    brand: {
        color: '#e94560', // la marca
        textDecoration: 'none',
        fontSize: '1.6rem',
        fontWeight: '900',
    },
    links: {
        display: 'flex',
        gap: '25px',
    },
    link: {
        color: 'white',
        textDecoration: 'none',
        fontSize: '1rem',
        padding: '5px 10px',
        borderRadius: '4px',
        transition: 'background-color 0.3s',
    }
};

export default Navbar;