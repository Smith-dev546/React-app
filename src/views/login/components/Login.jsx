import { useState } from "react";
import { useNavigate, Link } from "react-router";

export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al iniciar sesión");
      }

      // Guardar el token en localStorage
      localStorage.setItem("token", data.token);
      
      // Redirigir al dashboard
      navigate("/dashboard", { 
        state: { message: "¡Inicio de sesión exitoso!" } 
      });
      
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="row justify-content-center vh-100 align-items-center">
        <div className="col-md-6 col-lg-4">
          <div className="card login-card shadow">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <div className="login-icon">
                  <i className="bi bi-person-badge"></i>
                </div>
                <h2 className="login-title">Iniciar Sesión</h2>
                <p className="text-muted">Accede a tu cuenta para continuar</p>
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    <i className="bi bi-person-fill me-1"></i>Usuario
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Ingresa tu usuario"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="form-label">
                    <i className="bi bi-lock-fill me-1"></i>Contraseña
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Ingresa tu contraseña"
                    required
                    disabled={isLoading}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Iniciando sesión...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      Iniciar Sesión
                    </>
                  )}
                </button>
              </form>

              <div className="text-center mt-4">
                <p className="mb-0">
                  ¿No tienes una cuenta?{" "}
                  <Link to="/register" className="register-link">
                    Regístrate aquí
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          padding: 20px;
        }
        
        .login-card {
          border: none;
          border-radius: 15px;
          overflow: hidden;
        }
        
        .login-icon {
          font-size: 3rem;
          color: #6f42c1;
          margin-bottom: 1rem;
        }
        
        .login-title {
          color: #333;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        
        .form-label {
          font-weight: 600;
          color: #495057;
        }
        
        .form-control {
          border-radius: 8px;
          padding: 0.75rem 1rem;
          border: 1px solid #ced4da;
          transition: all 0.3s;
        }
        
        .form-control:focus {
          border-color: #6f42c1;
          box-shadow: 0 0 0 0.25rem rgba(111, 66, 193, 0.25);
        }
        
        .btn-primary {
          background: linear-gradient(120deg, #6f42c1, #8c68cd);
          border: none;
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.3s;
        }
        
        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }
        
        .btn-primary:disabled {
          opacity: 0.7;
        }
        
        .register-link {
          color: #6f42c1;
          text-decoration: none;
          font-weight: 600;
        }
        
        .register-link:hover {
          text-decoration: underline;
        }
        
        .alert {
          border-radius: 8px;
          border: none;
        }
      `}</style>
    </div>
  );
}