import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router";
import { useState } from "react";

export default function CrearBootcamp() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm({
    mode: 'onChange',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const technologies = watch("technologies", "");

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError("");
    setSuccess("");
    
    try {
      const formattedData = {
        name: data.name,
        description: data.description,
        technologies: data.technologies.split(",").map((t) => t.trim()).filter(t => t)
      };

      const response = await fetch("http://localhost:8000/api/auth/bootcamps/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formattedData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Error al crear el bootcamp");
      }

      setSuccess("✅ Bootcamp creado correctamente");
      
      // Limpiar el formulario
      reset();
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate("/dashboard", { 
          state: { message: "Bootcamp creado correctamente" } 
        });
      }, 2000);
      
    } catch (error) {
      console.error("Error creating bootcamp:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateTechPreview = () => {
    if (!technologies) return [];
    return technologies.split(',').map(tech => tech.trim()).filter(tech => tech);
  };

  const handleCancel = () => {
    if (window.confirm('¿Estás seguro de que quieres cancelar? Los datos no guardados se perderán.')) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/dashboard" className="text-decoration-none">
                  Dashboard
                </Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Crear Bootcamp
              </li>
            </ol>
          </nav>

          {/* Card principal */}
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h4 className="card-title mb-0">
                <i className="bi bi-plus-circle me-2"></i>
                Crear Nuevo Bootcamp
              </h4>
            </div>
            <div className="card-body p-4">
              {error && (
                <div className="alert alert-danger">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </div>
              )}

              {success && (
                <div className="alert alert-success">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  {success}
                  <div className="mt-2">
                    <div className="spinner-border spinner-border-sm" role="status">
                      <span className="visually-hidden">Redirigiendo...</span>
                    </div>
                    <span className="ms-2">Redirigiendo al dashboard...</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Campo Nombre */}
                <div className="mb-4">
                  <label htmlFor="name" className="form-label">
                    <i className="bi bi-tag-fill me-1 text-primary"></i>
                    Nombre del Bootcamp *
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    id="name"
                    placeholder="Ej: Bootcamp Full Stack Developer"
                    {...register("name", { 
                      required: "El nombre es obligatorio",
                      minLength: {
                        value: 3,
                        message: "El nombre debe tener al menos 3 caracteres"
                      },
                      maxLength: {
                        value: 100,
                        message: "El nombre no puede exceder los 100 caracteres"
                      }
                    })}
                    disabled={isLoading || success}
                  />
                  {errors.name && (
                    <div className="invalid-feedback d-flex align-items-center">
                      <i className="bi bi-exclamation-circle me-1"></i>
                      {errors.name.message}
                    </div>
                  )}
                  <div className="form-text">
                    El nombre debe ser descriptivo y único.
                  </div>
                </div>

                {/* Campo Descripción */}
                <div className="mb-4">
                  <label htmlFor="description" className="form-label">
                    <i className="bi bi-text-paragraph me-1 text-primary"></i>
                    Descripción *
                  </label>
                  <textarea
                    className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                    id="description"
                    rows="4"
                    placeholder="Describe los objetivos, contenido y duración del bootcamp..."
                    {...register("description", { 
                      required: "La descripción es obligatoria",
                      minLength: {
                        value: 10,
                        message: "La descripción debe tener al menos 10 caracteres"
                      },
                      maxLength: {
                        value: 500,
                        message: "La descripción no puede exceder los 500 caracteres"
                      }
                    })}
                    disabled={isLoading || success}
                  />
                  {errors.description && (
                    <div className="invalid-feedback d-flex align-items-center">
                      <i className="bi bi-exclamation-circle me-1"></i>
                      {errors.description.message}
                    </div>
                  )}
                  <div className="form-text">
                    {watch('description')?.length || 0}/500 caracteres
                  </div>
                </div>

                {/* Campo Tecnologías */}
                <div className="mb-4">
                  <label htmlFor="technologies" className="form-label">
                    <i className="bi bi-code-slash me-1 text-primary"></i>
                    Tecnologías *
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.technologies ? 'is-invalid' : ''}`}
                    id="technologies"
                    placeholder="Ej: JavaScript, React, Node.js, Express, MongoDB"
                    {...register("technologies", { 
                      required: "Debes agregar al menos una tecnología",
                      validate: {
                        minTechnologies: (value) => {
                          const techs = value.split(',').map(t => t.trim()).filter(t => t);
                          return techs.length >= 1 || 'Debes agregar al menos una tecnología';
                        },
                        maxTechnologies: (value) => {
                          const techs = value.split(',').map(t => t.trim()).filter(t => t);
                          return techs.length <= 10 || 'Máximo 10 tecnologías permitidas';
                        }
                      }
                    })}
                    disabled={isLoading || success}
                  />
                  {errors.technologies && (
                    <div className="invalid-feedback d-flex align-items-center">
                      <i className="bi bi-exclamation-circle me-1"></i>
                      {errors.technologies.message}
                    </div>
                  )}
                  <div className="form-text">
                    Separa las tecnologías con comas. Máximo 10 tecnologías.
                  </div>

                  {/* Vista previa de tecnologías */}
                  <div className="mt-3">
                    <h6 className="text-muted mb-2">Vista previa:</h6>
                    <div className="tech-preview">
                      {updateTechPreview().length > 0 ? (
                        updateTechPreview().map((tech, index) => (
                          <span key={index} className="tech-badge">
                            {tech}
                          </span>
                        ))
                      ) : (
                        <span className="text-muted">No hay tecnologías agregadas</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn btn-outline-secondary me-md-2"
                    disabled={isLoading}
                  >
                    <i className="bi bi-x-circle me-1"></i>
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading || success}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                        Creando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-plus-circle me-1"></i>
                        Crear Bootcamp
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Información adicional */}
          <div className="card mt-4">
            <div className="card-body">
              <h6 className="card-title">
                <i className="bi bi-info-circle me-1 text-info"></i>
                Información importante
              </h6>
              <ul className="list-unstyled mb-0">
                <li><small>• Todos los campos marcados con * son obligatorios</small></li>
                <li><small>• El bootcamp se creará con estado "activo" por defecto</small></li>
                <li><small>• Puedes editar el bootcamp después de crearlo</small></li>
                <li><small>• Verifica que el nombre no exista previamente</small></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .breadcrumb {
          background-color: transparent;
          padding: 0;
        }
        
        .card {
          border-radius: 12px;
          overflow: hidden;
          border: none;
          box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.08);
        }
        
        .card-header {
          border-bottom: none;
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
        
        .form-control:disabled {
          background-color: #f8f9fa;
          opacity: 0.7;
        }
        
        .btn {
          border-radius: 8px;
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          transition: all 0.3s;
        }
        
        .btn:hover:not(:disabled) {
          transform: translateY(-2px);
        }
        
        .tech-preview {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          padding: 1rem;
          background-color: #f8f9fa;
          border-radius: 8px;
          min-height: 60px;
          align-items: center;
        }
        
        .tech-badge {
          background: linear-gradient(120deg, #6f42c1, #8c68cd);
          color: white;
          padding: 0.35em 0.65em;
          border-radius: 50rem;
          font-size: 0.875rem;
          font-weight: 600;
        }
        
        .alert {
          border-radius: 8px;
          border: none;
        }
        
        .invalid-feedback {
          display: flex;
          align-items: center;
          margin-top: 0.25rem;
        }
        
        .form-text {
          font-size: 0.875rem;
          color: #6c757d;
          margin-top: 0.25rem;
        }
      `}</style>
    </div>
  );
}