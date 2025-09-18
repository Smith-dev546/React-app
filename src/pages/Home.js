import React, { useState, useEffect } from 'react';

// RUTA FINAL CORREGIDA: Apunta al puerto 3000, usa el prefijo /api/auth y la ruta /bootcamps
const API_URL = 'http://localhost:3000/api/auth/bootcamps';


// Componente Funcional: Home
function Home() {
    //manejar el estado del componente
    const [bootcamps, setBootcamps] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Hook useEffect: Se ejecuta una sola vez para obtener datos al inicio
    useEffect(() => {
        // Funcion asincrona para la peticion (Clean Code)
        const fetchBootcamps = async () => {
            try {
                const response = await fetch(API_URL);

                if (!response.ok) {
                    // Manejo de errores de HTTP (ej: 404, 500)
                    throw new Error(`Error ${response.status}: No se pudo obtener la lista de bootcamps.`);
                }

                const data = await response.json();
                setBootcamps(data); // Actualiza el estado con los datos
            } catch (err) {
                // Manejo de errores de red o del fetch (ej: API apagada)
                console.error("Error al cargar bootcamps:", err.message);
                setError("Lo sentimos. No pudimos conectar con la Kodigo-API. Asegúrate de que está ejecutándose.");
            } finally {
                setIsLoading(false); // Deja de mostrar "cargando"
            }
        };

        fetchBootcamps();
    }, []); 

    // --- LOGICA DE RENDERIZADO  ---

    if (isLoading) {
        return <h2 style={styles.loading}>Cargando Bootcamps... ⏳</h2>;
    }

    if (error) {
        return <h2 style={styles.error}>{error}</h2>;
    }

    if (bootcamps.length === 0) {
        return <h2 style={styles.noData}>No hay bootcamps disponibles en este momento.</h2>;
    }

    //lista de bootcamps
    return (
        <div style={styles.container}>
            <h1 style={styles.title}>🎓 Nuestros Bootcamps y Cursos</h1>
            <p style={styles.subtitle}>Conviertete en un experto con la mejor formacion.</p>
            
            <div style={styles.grid}>
                {bootcamps.map(bootcamp => (
                    <div key={bootcamp.id} style={styles.card}>
                        {/* *** CORRECCIÓN CLAVE: Usar bootcamp.name *** */}
                        <h3 style={styles.cardTitle}>{bootcamp.name}</h3>
                        {/* *** CORRECCIÓN CLAVE: Usar bootcamp.description *** */}
                        {bootcamp.description && <p style={styles.cardText}>{bootcamp.description}</p>}
                        {/* Se mantiene duracion, aunque es probable que no venga en la API actual */}
                        {bootcamp.duracion && <p style={styles.cardDetail}>⏳ Duracion: {bootcamp.duracion}</p>}
                        
                        <button style={styles.button}>Ver Detalles</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Estilos  
const styles = {
    container: {
        textAlign: 'center',
        padding: '40px 0',
    },
    title: {
        fontSize: '2.5rem',
        color: '#1a1a2e',
        marginBottom: '10px',
    },
    subtitle: {
        fontSize: '1.2rem',
        color: '#6b6b6b',
        marginBottom: '40px',
    },
    grid: {
        display: 'grid',
        // Responsive: 1 columna en movil, 3 en escritorio
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '30px',
        maxWidth: '1200px',
        margin: '0 auto',
    },
    card: {
        backgroundColor: '#ffffff',
        border: '1px solid #f0f0f0',
        borderRadius: '10px',
        padding: '25px',
        textAlign: 'left',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        transition: 'transform 0.3s, box-shadow 0.3s',
        cursor: 'pointer',
    },
    cardTitle: {
        color: '#e94560',
        fontSize: '1.5rem',
        marginBottom: '10px',
    },
    cardText: {
        color: '#333',
        marginBottom: '15px',
    },
    cardDetail: {
        color: '#1a1a2e',
        fontWeight: 'bold',
        marginBottom: '20px',
    },
    button: {
        backgroundColor: '#1a1a2e',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1rem',
    },
    loading: { color: '#1a1a2e', textAlign: 'center', marginTop: '50px' },
    error: { color: '#e94560', textAlign: 'center', marginTop: '50px' },
    noData: { color: '#6b6b6b', textAlign: 'center', marginTop: '50px' }
};


export default Home;