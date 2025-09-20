

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";

export default function EliminarBootcamp() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bootcamp, setBootcamp] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  // Cargar datos del bootcamp específico
  useEffect(() => {
    const fetchBootcampData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:3000/api/auth/bootcamps/all");
        
        if (!response.ok) {
          throw new Error("Error al cargar los bootcamps");
        }
        
        const bootcamps = await response.json();
        const bootcampEncontrado = bootcamps.find(b => b.id === parseInt(id));
        
        if (!bootcampEncontrado) {
          throw new Error("Bootcamp no encontrado");
        }
        
        setBootcamp(bootcampEncontrado);
      } catch (error) {
        console.error("Error fetching bootcamp:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchBootcampData();
    }
  }, [id]);

  const handleEliminar = async () => {
    if (!window.confirm("¿Estás seguro de que deseas desactivar este bootcamp? Esta acción no se puede deshacer.")) {
      return;
    }

    setIsDeleting(true);
    setError("");

    try {
      const response = await fetch(`http://localhost:3000/api/auth/bootcamps/delete/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al desactivar el bootcamp");
      }

      const result = await response.json();
      
      alert("✅ Bootcamp desactivado correctamente");
      navigate("/dashboard", { 
        state: { message: "Bootcamp desactivado correctamente" } 
      });
      
    } catch (error) {
      console.error("Error deleting bootcamp:", error);
      setError(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelar = () => {
    navigate("/dashboard");
  };

  if (isLoading) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-3">Cargando información del bootcamp...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !bootcamp) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="alert alert-danger">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </div>
            <div className="text-center mt-3">
              <Link to="/dashboard" className="btn btn-primary">
                Volver al Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!bootcamp) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="alert alert-warning">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              No se encontró el bootcamp solicitado
            </div>
            <div className="text-center mt-3">
              <Link to="/dashboard" className="btn btn-primary">
                Volver al Dashboard
              </Link>
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
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/dashboard" className="text-decoration-none">
                  Dashboard
                </Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Desactivar Bootcamp
              </li>
            </ol>
          </nav>

          {/* Card de confirmación */}
          <div className="card border-danger shadow">
            <div className="card-header bg-danger text-white">
              <h4 className="card-title mb-0">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                Desactivar Bootcamp
              </h4>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </div>
              )}

              <div className="alert alert-warning">
                <h5 className="alert-heading">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  ¿Estás seguro?
                </h5>
                <p className="mb-0">
                  Estás a punto de desactivar el siguiente bootcamp. Esta acción marcará el bootcamp como inactivo, pero los datos se conservarán en el sistema.
                </p>
              </div>

              {/* Información del bootcamp */}
              <div className="bootcamp-info p-3 border rounded">
                <h5 className="text-danger">{bootcamp.name}</h5>
                <p className="text-muted">{bootcamp.description}</p>
                
                <div className="mb-2">
                  <strong>Estado:</strong>{" "}
                  <span className={`badge ${bootcamp.active ? 'bg-success' : 'bg-secondary'}`}>
                    {bootcamp.active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                
                <div>
                  <strong>Tecnologías:</strong>
                  <div className="mt-1">
                    {bootcamp.technologies.map((tech, index) => (
                      <span key={index} className="badge bg-secondary me-1 mb-1">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-muted">
                  <small>
                    <i className="bi bi-info-circle me-1"></i>
                    Nota: Esta acción no elimina permanentemente el bootcamp, solo lo marca como inactivo.
                    Puedes reactivarlo posteriormente si es necesario.
                  </small>
                </p>
              </div>

              {/* Botones de acción */}
              <div className="d-flex gap-2 mt-4">
                <button
                  onClick={handleCancelar}
                  className="btn btn-outline-secondary flex-fill"
                  disabled={isDeleting}
                >
                  <i className="bi bi-x-circle me-1"></i>
                  Cancelar
                </button>
                <button
                  onClick={handleEliminar}
                  className="btn btn-danger flex-fill"
                  disabled={isDeleting || !bootcamp.active}
                >
                  {isDeleting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                      Desactivando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-trash me-1"></i>
                      {bootcamp.active ? "Desactivar Bootcamp" : "Ya está desactivado"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}