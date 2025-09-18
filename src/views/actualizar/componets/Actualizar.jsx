import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router";
import { useState, useEffect } from "react";

export default function UpdateBootcamp() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    mode: 'onChange', // Validar mientras se escribe
  });
  const [isLoading, setIsLoading] = useState(false);
  const [bootcampData, setBootcampData] = useState(null);
  const [submitError, setSubmitError] = useState("");
  
  const technologies = watch("technologies", "");

  // Validación personalizada para tecnologías
  const validateTechnologies = (value) => {
    if (!value) return 'Debes agregar al menos una tecnología';
    const techArray = value.split(',').map(t => t.trim()).filter(t => t);
    return techArray.length >= 1 || 'Debes agregar al menos una tecnología';
  };

  // Cargar datos existentes del bootcamp
  useEffect(() => {
    const fetchBootcampData = async () => {
      try {
        setIsLoading(true);
        setSubmitError("");
        
        const response = await fetch(`http://localhost:8000/api/auth/bootcamps/all`);
        
        if (response.ok) {
          const bootcamps = await response.json();
          
          // Buscar el bootcamp con el ID específico
          const bootcamp = bootcamps.find(b => b.id === parseInt(id));
          
          if (bootcamp) {
            setBootcampData(bootcamp);
            setValue("name", bootcamp.name);
            setValue("description", bootcamp.description);
            setValue("technologies", bootcamp.technologies.join(", "));
          } else {
            setSubmitError("Bootcamp no encontrado");
            setTimeout(() => {
              navigate("/dashboard");
            }, 2000);
          }
        } else {
          throw new Error("Error al cargar los datos del bootcamp");
        }
      } catch (error) {
        console.error("Error fetching bootcamp data:", error);
        
        // Mostrar un mensaje más específico según el tipo de error
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
          setSubmitError('Error de conexión. Verifica que el servidor esté ejecutándose.');
        } else {
          setSubmitError(`Error: ${error.message}`);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchBootcampData();
    } else {
      setSubmitError("ID de bootcamp no encontrado");
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    }
  }, [id, setValue, navigate]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setSubmitError("");
    
    try {
      const formattedData = {
        name: data.name,
        description: data.description,
        technologies: data.technologies.split(",").map((t) => t.trim())
      };

      const response = await fetch(`http://localhost:8000/api/auth/bootcamps/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        if (response.status === 404) throw new Error("Bootcamp no encontrado");
        if (response.status === 400) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error al actualizar el bootcamp");
        }
        throw new Error("Error al actualizar el bootcamp");
      }

      const result = await response.json();
      
      // Redirigir al dashboard con mensaje de éxito
      navigate("/dashboard", { 
        state: { message: "✅ Bootcamp actualizado correctamente" } 
      });
      
    } catch (error) {
      console.error("Error updating bootcamp:", error);
      setSubmitError(`❌ Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackClick = (e) => {
    e.preventDefault();
    if (window.confirm('¿Estás seguro de que quieres salir? Los cambios no guardados se perderán.')) {
      navigate("/dashboard");
    }
  };

  // Función para actualizar la vista previa de tecnologías
  const updateTechPreview = () => {
    if (!technologies) return [];
    return technologies.split(',').map(tech => tech.trim()).filter(tech => tech);
  };

  // Mostrar estado de carga
  if (!bootcampData && isLoading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p>Cargando información del bootcamp...</p>
        </div>
      </div>
    );
  }

  // Mostrar error si no se encuentra el bootcamp
  if (submitError && !bootcampData) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="alert alert-danger text-center">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {submitError}
              <div className="mt-3">
                <button className="btn btn-primary" onClick={() => navigate("/dashboard")}>
                  Volver al Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <a href="#" className="back-link" onClick={handleBackClick}>
            <i className="bi bi-arrow-left me-2"></i> Volver al Dashboard
          </a>
          
          <div className="form-container">
            <div className="form-header">
              <h1 className="h3 mb-0">Actualizar Bootcamp</h1>
              <p className="mb-0 mt-2 opacity-75">Modifica la información de tu bootcamp</p>
            </div>
            
            <div className="form-body">
              {submitError && (
                <div className="alert alert-danger">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {submitError}
                </div>
              )}
              
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                  <label htmlFor="name" className="form-label">
                    <i className="bi bi-tag-fill me-1 text-primary"></i>Nombre del Bootcamp
                  </label>
                  <input 
                    type="text" 
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    id="name"
                    placeholder="Ingresa el nombre del bootcamp"
                    {...register("name", { 
                      required: "El nombre es obligatorio",
                      minLength: {
                        value: 3,
                        message: "El nombre debe tener al menos 3 caracteres"
                      }
                    })}
                  />
                  {errors.name && (
                    <div className="error-message">
                      <i className="bi bi-exclamation-circle"></i> {errors.name.message}
                    </div>
                  )}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="description" className="form-label">
                    <i className="bi bi-text-paragraph me-1 text-primary"></i>Descripción
                  </label>
                  <textarea 
                    className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                    id="description" 
                    rows="4"
                    placeholder="Describe los detalles y objetivos del bootcamp"
                    {...register("description", { 
                      required: "La descripción es obligatoria",
                      minLength: {
                        value: 10,
                        message: "La descripción debe tener al menos 10 caracteres"
                      }
                    })}
                  ></textarea>
                  {errors.description && (
                    <div className="error-message">
                      <i className="bi bi-exclamation-circle"></i> {errors.description.message}
                    </div>
                  )}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="technologies" className="form-label">
                    <i className="bi bi-code-slash me-1 text-primary"></i>Tecnologías
                  </label>
                  <input 
                    type="text" 
                    className={`form-control ${errors.technologies ? 'is-invalid' : ''}`}
                    id="technologies"
                    placeholder="Ej: JavaScript, React, Node.js"
                    {...register("technologies", { 
                      required: "Debes agregar al menos una tecnología",
                      validate: validateTechnologies
                    })}
                  />
                  <div className="info-text">
                    Separa las tecnologías con comas
                  </div>
                  {errors.technologies && (
                    <div className="error-message">
                      <i className="bi bi-exclamation-circle"></i> {errors.technologies.message}
                    </div>
                  )}
                  
                  <div className="tech-preview mt-2">
                    {updateTechPreview().map((tech, index) => (
                      <span key={index} className="tech-badge">{tech}</span>
                    ))}
                  </div>
                </div>
                
                <div className="d-grid">
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Procesando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle-fill me-2"></i>Actualizar Bootcamp
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          <div className="text-center mt-4 text-muted">
            <small>¿Necesitas ayuda? Contacta a nuestro equipo de soporte.</small>
          </div>
        </div>
      </div>

      {/* Overlay de carga */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      )}

      <style jsx>{`
        :root {
          --primary-color: #6f42c1;
          --secondary-color: #20c997;
          --gradient-start: #6f42c1;
          --gradient-end: #6610f2;
        }
        
        .form-container {
          background: white;
          border-radius: 15px;
          box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.1);
          overflow: hidden;
          margin-top: 2rem;
          margin-bottom: 2rem;
        }
        
        .form-header {
          background: linear-gradient(120deg, var(--gradient-start), var(--gradient-end));
          color: white;
          padding: 2rem;
          text-align: center;
        }
        
        .form-body {
          padding: 2rem;
        }
        
        .form-label {
          font-weight: 600;
          color: #495057;
          margin-bottom: 0.5rem;
        }
        
        .form-control {
          border-radius: 8px;
          padding: 0.75rem 1rem;
          border: 1px solid #ced4da;
          transition: all 0.3s;
        }
        
        .form-control:focus {
          border-color: var(--primary-color);
          box-shadow: 0 0 0 0.25rem rgba(111, 66, 193, 0.25);
        }
        
        .btn-primary {
          background: linear-gradient(120deg, var(--gradient-start), var(--gradient-end));
          border: none;
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          border-radius: 8px;
          transition: all 0.3s;
        }
        
        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }
        
        .error-message {
          color: #dc3545;
          font-size: 0.875rem;
          margin-top: 0.25rem;
          display: flex;
          align-items: center;
        }
        
        .error-message i {
          margin-right: 0.5rem;
        }
        
        .info-text {
          font-size: 0.875rem;
          color: #6c757d;
          margin-top: 0.25rem;
        }
        
        .back-link {
          color: var(--primary-color);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          margin-bottom: 1rem;
          font-weight: 500;
        }
        
        .back-link:hover {
          text-decoration: underline;
        }
        
        .tech-preview {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }
        
        .tech-badge {
          background-color: #e9ecef;
          color: #495057;
          padding: 0.35em 0.65em;
          border-radius: 50rem;
          font-size: 0.75rem;
          font-weight: 600;
        }
        
        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(255, 255, 255, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }
        
        .spinner-border {
          width: 3rem;
          height: 3rem;
          color: var(--primary-color);
        }
      `}</style>
    </div>
  );
}