import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setMessage('Las contraseñas no coinciden');
      setIsError(true);
      return;
    }
    
    try {
  setMessage('Registrando usuario...');
  
  // Llamada a la API usando fetch
      
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      });

      const data = await response.json();
      console.log('Respuesta del servidor:', data);
      
      if (response.status === 201) {
        setMessage('✅ ¡Usuario registrado exitosamente!');
        setIsError(false);
        alert('201: Usuario registrado correctamente');
        
        if (data.token) {
          alert(`Token recibido: ${data.token}`);
          console.log('Token:', data.token);
        }
        
        setTimeout(() => navigate('/login'), 2000);
        
      } else if (response.status === 400) {
        setMessage('❌ Error: El usuario ya existe');
        setIsError(true);
        alert('400: El usuario ya existe');
        
      } else {
        setMessage('❌ Error al registrar usuario');
        setIsError(true);
        alert(`Error ${response.status}: ${data.message || 'Error desconocido'}`);
      }
      
    } catch (error) {
      console.error('Error en la petición:', error);
      setMessage('❌ Error de conexión');
      setIsError(true);
      alert('Error de conexión con el servidor');
    }
  };
  

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '500px',
        margin: '0 auto'
      }}>
        <div style={{
          background: '#fff',
          borderRadius: '10px',
          boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '2rem' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ marginBottom: '1rem', fontSize: '3rem', color: '#6f42c1' }}>
                <i className="bi bi-person-plus-fill"></i>
              </div>
              <h2 style={{ fontWeight: 'bold', color: '#212529', margin: '0' }}>Crear Cuenta</h2>
              <p style={{ color: '#6c757d', margin: '0.5rem 0 0 0' }}>Únete a nuestra comunidad Kodigo</p>
            </div>
          
            {message && (
              <div style={{
                padding: '0.75rem 1.25rem',
                marginBottom: '1rem',
                border: '1px solid transparent',
                borderRadius: '0.375rem',
                textAlign: 'center',
                color: isError ? '#842029' : '#0f5132',
                backgroundColor: isError ? '#f8d7da' : '#d1e7dd',
                borderColor: isError ? '#f5c2c7' : '#badbcc'
              }}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="username" style={{
                  display: 'block',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  color: '#212529'
                }}>
                  <i className="bi bi-person" style={{ marginRight: '0.5rem' }}></i>Nombre de Usuario
                </label>
                <input
                  type="text"
                  id="username"
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '0.75rem',
                    fontSize: '1rem',
                    fontWeight: '400',
                    lineHeight: '1.5',
                    color: '#212529',
                    backgroundColor: '#fff',
                    backgroundClip: 'padding-box',
                    border: '1px solid #ced4da',
                    borderRadius: '0.375rem',
                    transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
                  }}
                  placeholder="Ingresa tu usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="password" style={{
                  display: 'block',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  color: '#212529'
                }}>
                  <i className="bi bi-lock" style={{ marginRight: '0.5rem' }}></i>Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '0.75rem',
                    fontSize: '1rem',
                    fontWeight: '400',
                    lineHeight: '1.5',
                    color: '#212529',
                    backgroundColor: '#fff',
                    backgroundClip: 'padding-box',
                    border: '1px solid #ced4da',
                    borderRadius: '0.375rem',
                    transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
                  }}
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="confirmPassword" style={{
                  display: 'block',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  color: '#212529'
                }}>
                  <i className="bi bi-lock-fill" style={{ marginRight: '0.5rem' }}></i>Confirmar Contraseña
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '0.75rem',
                    fontSize: '1rem',
                    fontWeight: '400',
                    lineHeight: '1.5',
                    color: '#212529',
                    backgroundColor: '#fff',
                    backgroundClip: 'padding-box',
                    border: '1px solid #ced4da',
                    borderRadius: '0.375rem',
                    transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
                  }}
                  placeholder="Confirma tu contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button 
                type="submit" 
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#6f42c1',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease-in-out'
                }}
              >
                <i className="bi bi-person-plus" style={{ marginRight: '0.5rem' }}></i>
                Registrarse
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '2rem', color: '#6c757d' }}>
              <p style={{ margin: 0 }}>
                ¿Ya tienes una cuenta?{' '}
                <Link 
                  to="/login" 
                  style={{ 
                    color: '#6f42c1', 
                    textDecoration: 'none', 
                    fontWeight: '600' 
                  }}
                >
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;