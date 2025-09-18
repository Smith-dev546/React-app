import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home'; 

function App() {
  return (
    <Router>
      <Navbar /> {/* El Navbar se mantiene fijo en todas las paginas */}
      <main style={{ padding: '20px 5%' }}>
        {/* 2. <Routes> define las rutas de la aplicacion */}
        <Routes>
          {/* RUTA PRINCIPAL: (el listado de bootcamps) */}
          <Route path="/" element={<Home />} />
          
          {/* RUTAS/COMPAÑEROS: use elementos temporales para que la app no falle */}
          <Route 
            path="/register" 
            element={<h2 style={{color: '#e94560'}}>Componente de Crear Usuario</h2>} 
          />
          <Route 
            path="/login" 
            element={<h2 style={{color: '#e94560'}}>Componente de Inicio de Sesión</h2>} 
          />
          <Route 
            path="/dashboard" 
            element={<h2 style={{color: '#e94560'}}>Dashboard de Usuario</h2>} 
          />
          
          <Route path="*" element={<h2>Error 404: Página No Encontrada</h2>} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;