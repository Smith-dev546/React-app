import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

const Register = () => {
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm();

  const password = watch('password');

  // useEffect para limpiar mensajes después de 5 segundos
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
        setIsError(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  // useEffect para redirección después de registro exitoso
  useEffect(() => {
    if (showSuccess) {
      const redirectTimer = setTimeout(() => {
        window.location.href = '/login';
      }, 2000);

      return () => clearTimeout(redirectTimer);
    }
  }, [showSuccess]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setMessage('');
    setIsError(false);
    setShowSuccess(false);

    try {
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: data.username,
          password: data.password
        })
      });

      if (response.status === 201) {
        setMessage('✅ ¡Usuario registrado exitosamente! Redirigiendo al login...');
        setIsError(false);
        setShowSuccess(true);
        reset();
      } else if (response.status === 400) {
        setIsError(true);
        setMessage('❌ El nombre de usuario ya existe. Por favor elige otro.');
      } else {
        setIsError(true);
        setMessage('❌ Error inesperado al registrar usuario');
      }
    } catch (error) {
      setIsError(true);
      setMessage('❌ Error de conexión. Verifica que el servidor esté funcionando.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #2c3e50 100%)',
      padding: '20px'
    }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-lg border-0" style={{
              background: 'rgba(33, 37, 41, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '15px'
            }}>
              <div className="card-body p-5">
                
                {/* Header */}
                <div className="text-center mb-4">
                  <div className="mb-3">
                    <i className="bi bi-person-plus-fill" style={{
                      fontSize: '3rem',
                      background: 'linear-gradient(45deg, #6f42c1, #e83e8c)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}></i>
                  </div>
                  <h2 className="text-white fw-bold">Crear Cuenta</h2>
                  <p className="text-muted">Únete a nuestra comunidad Kodigo</p>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit(onSubmit)}>
                  
                  {/* Campo Usuario */}
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label text-white fw-semibold">
                      <i className="bi bi-person me-2"></i>Nombre de Usuario
                    </label>
                    <input
                      type="text"
                      id="username"
                      className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid #495057',
                        color: 'white',
                        borderRadius: '8px'
                      }}
                      placeholder="Ingresa tu usuario"
                      {...register('username', {
                        required: 'El nombre de usuario es requerido',
                        minLength: {
                          value: 3,
                          message: 'Mínimo 3 caracteres'
                        },
                        maxLength: {
                          value: 20,
                          message: 'Máximo 20 caracteres'
                        },
                        pattern: {
                          value: /^[a-zA-Z0-9_]+$/,
                          message: 'Solo letras, números y guiones bajos'
                        }
                      })}
                    />
                    {errors.username && (
                      <div className="invalid-feedback d-block">
                        <i className="bi bi-exclamation-circle me-1"></i>
                        {errors.username.message}
                      </div>
                    )}
                  </div>

                  {/* Campo Contraseña */}
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label text-white fw-semibold">
                      <i className="bi bi-lock me-2"></i>Contraseña
                    </label>
                    <input
                      type="password"
                      id="password"
                      className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid #495057',
                        color: 'white',
                        borderRadius: '8px'
                      }}
                      placeholder="Mínimo 6 caracteres"
                      {...register('password', {
                        required: 'La contraseña es requerida',
                        minLength: {
                          value: 6,
                          message: 'Mínimo 6 caracteres'
                        }
                      })}
                    />
                    {errors.password && (
                      <div className="invalid-feedback d-block">
                        <i className="bi bi-exclamation-circle me-1"></i>
                        {errors.password.message}
                      </div>
                    )}
                  </div>

                  {/* Campo Confirmar Contraseña */}
                  <div className="mb-4">
                    <label htmlFor="confirmPassword" className="form-label text-white fw-semibold">
                      <i className="bi bi-shield-lock me-2"></i>Confirmar Contraseña
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid #495057',
                        color: 'white',
                        borderRadius: '8px'
                      }}
                      placeholder="Repite tu contraseña"
                      {...register('confirmPassword', {
                        required: 'Confirma tu contraseña',
                        validate: value => value === password || 'Las contraseñas no coinciden'
                      })}
                    />
                    {errors.confirmPassword && (
                      <div className="invalid-feedback d-block">
                        <i className="bi bi-exclamation-circle me-1"></i>
                        {errors.confirmPassword.message}
                      </div>
                    )}
                  </div>

                  {/* Botón de Registro */}
                  <button 
                    type="submit" 
                    className="btn w-100 py-2 fw-bold"
                    disabled={isLoading}
                    style={{
                      background: 'linear-gradient(45deg, #6f42c1, #e83e8c)',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '1.1rem',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 5px 15px rgba(111, 66, 193, 0.4)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Registrando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-person-plus me-2"></i>
                        Crear Cuenta
                      </>
                    )}
                  </button>
                </form>

                {/* Mensajes de feedback */}
                {message && (
                  <div className={`alert ${isError ? 'alert-danger' : 'alert-success'} mt-4`} role="alert">
                    <i className={`bi ${isError ? 'bi-exclamation-triangle' : 'bi-check-circle'} me-2`}></i>
                    {message}
                  </div>
                )}

                {/* Link a Login */}
                <div className="text-center mt-4">
                  <p className="text-muted mb-0">
                    ¿Ya tienes una cuenta?{' '}
                    <a 
                      href="/login" 
                      style={{
                        color: '#6f42c1',
                        textDecoration: 'none',
                        fontWeight: '600'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.color = '#e83e8c';
                        e.target.style.textDecoration = 'underline';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.color = '#6f42c1';
                        e.target.style.textDecoration = 'none';
                      }}
                    >
                        Inicia Sesión
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;