import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";

export default function Dashboard() {
  const [bootcamps, setBootcamps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBootcamp, setNewBootcamp] = useState({
    name: "",
    description: "",
    technologies: ""
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");
  
  const navigate = useNavigate();

  // Cargar bootcamps desde la API
  useEffect(() => {
    fetchBootcamps();
    setUser({ username: "Administrador" });
  }, []);

  const fetchBootcamps = async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await fetch("http://localhost:3000/api/auth/bootcamps/all");
      
      if (!response.ok) {
        throw new Error("Error al cargar los bootcamps");
      }
      
      const data = await response.json();
      setBootcamps(data);
    } catch (error) {
      console.error("Error fetching bootcamps:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleDelete = (id) => {
    navigate(`/bootcamps/delete/${id}`);
  };

  const handleCreateBootcamp = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError("");

    try {
      const formattedData = {
        name: newBootcamp.name,
        description: newBootcamp.description,
        technologies: newBootcamp.technologies.split(",").map((t) => t.trim()).filter(t => t)
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

      // Cerrar modal y limpiar formulario
      setShowCreateModal(false);
      setNewBootcamp({
        name: "",
        description: "",
        technologies: ""
      });
      
      // Recargar la lista de bootcamps
      fetchBootcamps();
      
      alert("✅ Bootcamp creado correctamente");
      
    } catch (error) {
      console.error("Error creating bootcamp:", error);
      setCreateError(error.message);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBootcamp(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Filtrar bootcamps según búsqueda y filtro
  const filteredBootcamps = bootcamps.filter(bootcamp => {
    const matchesSearch = bootcamp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bootcamp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bootcamp.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "active" && bootcamp.active) ||
                         (statusFilter === "inactive" && !bootcamp.active);
    
    return matchesSearch && matchesStatus;
  });

  // Estadísticas
  const activeBootcamps = bootcamps.filter(b => b.active).length;
  const inactiveBootcamps = bootcamps.filter(b => !b.active).length;
  const totalTechnologies = new Set(bootcamps.flatMap(b => b.technologies)).size;

  // Vista previa de tecnologías
  const techPreview = newBootcamp.technologies 
    ? newBootcamp.technologies.split(',').map(tech => tech.trim()).filter(tech => tech)
    : [];

  if (isLoading) {
    return (
      <div className="dashboard-container">
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p>Cargando dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <span className="navbar-brand">
            <i className="bi bi-columns-gap me-2"></i>
            Dashboard Bootcamps
          </span>
          <div className="d-flex align-items-center">
            <span className="navbar-text me-3">
              <i className="bi bi-person-circle me-1"></i>
              {user?.username || "Usuario"}
            </span>
            <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-1"></i>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>Gestión de Bootcamps</h2>
              <button 
                className="btn btn-primary"
                onClick={() => setShowCreateModal(true)}
              >
                <i className="bi bi-plus-circle me-1"></i>
                Nuevo Bootcamp
              </button>
            </div>

            {error && (
              <div className="alert alert-danger" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
              </div>
            )}

            {/* Stats Cards */}
            <div className="row mb-4">
              <div className="col-md-3 mb-3">
                <div className="card stats-card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="card-subtitle text-muted">Total Bootcamps</h6>
                        <h3 className="fw-bold mt-2">{bootcamps.length}</h3>
                      </div>
                      <div className="bg-primary p-3 rounded-circle">
                        <i className="bi bi-collection-play text-white fs-4"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-3">
                <div className="card stats-card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="card-subtitle text-muted">Activos</h6>
                        <h3 className="fw-bold mt-2">{activeBootcamps}</h3>
                      </div>
                      <div className="bg-success p-3 rounded-circle">
                        <i className="bi bi-check-circle text-white fs-4"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-3">
                <div className="card stats-card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="card-subtitle text-muted">Inactivos</h6>
                        <h3 className="fw-bold mt-2">{inactiveBootcamps}</h3>
                      </div>
                      <div className="bg-secondary p-3 rounded-circle">
                        <i className="bi bi-x-circle text-white fs-4"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-3">
                <div className="card stats-card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="card-subtitle text-muted">Tecnologías</h6>
                        <h3 className="fw-bold mt-2">{totalTechnologies}</h3>
                      </div>
                      <div className="bg-info p-3 rounded-circle">
                        <i className="bi bi-code-slash text-white fs-4"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filtros y Búsqueda */}
            <div className="card mb-4">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-search"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar por nombre, descripción o tecnología..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <select
                      className="form-select"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">Todos los estados</option>
                      <option value="active">Solo activos</option>
                      <option value="inactive">Solo inactivos</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <div className="text-muted text-end">
                      Mostrando {filteredBootcamps.length} de {bootcamps.length} bootcamps
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bootcamps Table */}
            <div className="card">
              <div className="card-header bg-light d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">Lista de Bootcamps</h5>
                <span className="badge bg-primary">
                  {filteredBootcamps.length} bootcamps
                </span>
              </div>
              <div className="card-body">
                {bootcamps.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-inbox display-4 text-muted mb-3"></i>
                    <h5>No hay bootcamps registrados</h5>
                    <p className="text-muted mb-4">Comienza creando tu primer bootcamp</p>
                    <button 
                      className="btn btn-primary"
                      onClick={() => setShowCreateModal(true)}
                    >
                      <i className="bi bi-plus-circle me-1"></i>
                      Crear primer bootcamp
                    </button>
                  </div>
                ) : filteredBootcamps.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-search display-4 text-muted mb-3"></i>
                    <h5>No se encontraron resultados</h5>
                    <p className="text-muted">Intenta con otros términos de búsqueda o ajusta los filtros</p>
                    <button 
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        setSearchTerm("");
                        setStatusFilter("all");
                      }}
                    >
                      <i className="bi bi-arrow-clockwise me-1"></i>
                      Limpiar filtros
                    </button>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Nombre</th>
                          <th>Tecnologías</th>
                          <th>Estado</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredBootcamps.map((bootcamp) => (
                          <tr key={bootcamp.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="bg-primary rounded-circle p-2 me-3">
                                  <i className="bi bi-code-square text-white"></i>
                                </div>
                                <div>
                                  <h6 className="mb-0">{bootcamp.name}</h6>
                                  <small className="text-muted">
                                    {bootcamp.description.length > 60
                                      ? `${bootcamp.description.substring(0, 60)}...`
                                      : bootcamp.description}
                                  </small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="tech-badges">
                                {bootcamp.technologies.slice(0, 3).map((tech, index) => (
                                  <span key={index} className="tech-badge">
                                    {tech}
                                  </span>
                                ))}
                                {bootcamp.technologies.length > 3 && (
                                  <span className="tech-badge-more">
                                    +{bootcamp.technologies.length - 3} más
                                  </span>
                                )}
                              </div>
                            </td>
                            <td>
                              <span className={`badge ${bootcamp.active ? 'bg-success' : 'bg-secondary'}`}>
                                <i className={`bi ${bootcamp.active ? 'bi-check-circle' : 'bi-x-circle'} me-1`}></i>
                                {bootcamp.active ? 'Activo' : 'Inactivo'}
                              </span>
                            </td>
                            <td>
                              <div className="btn-group" role="group">
                                <Link
                                  to={`/bootcamps/update/${bootcamp.id}`}
                                  className="btn btn-outline-primary btn-sm"
                                  title="Editar bootcamp"
                                >
                                  <i className="bi bi-pencil"></i>
                                </Link>
                                <button
                                  onClick={() => handleDelete(bootcamp.id)}
                                  className="btn btn-outline-danger btn-sm"
                                  disabled={!bootcamp.active}
                                  title={bootcamp.active ? "Desactivar bootcamp" : "Ya desactivado"}
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                                <button
                                  className="btn btn-outline-info btn-sm"
                                  title="Ver detalles"
                                  onClick={() => alert(`Detalles de: ${bootcamp.name}`)}
                                >
                                  <i className="bi bi-eye"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para Crear Bootcamp */}
      {showCreateModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  <i className="bi bi-plus-circle me-2"></i>
                  Crear Nuevo Bootcamp
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white"
                  onClick={() => setShowCreateModal(false)}
                  disabled={createLoading}
                ></button>
              </div>
              <div className="modal-body">
                {createError && (
                  <div className="alert alert-danger">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {createError}
                  </div>
                )}

                <form onSubmit={handleCreateBootcamp}>
                  <div className="mb-3">
                    <label className="form-label">Nombre del Bootcamp *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={newBootcamp.name}
                      onChange={handleInputChange}
                      placeholder="Ej: Bootcamp Full Stack Developer"
                      required
                      disabled={createLoading}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Descripción *</label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={newBootcamp.description}
                      onChange={handleInputChange}
                      rows="4"
                      placeholder="Describe los objetivos, contenido y duración del bootcamp..."
                      required
                      disabled={createLoading}
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Tecnologías *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="technologies"
                      value={newBootcamp.technologies}
                      onChange={handleInputChange}
                      placeholder="Ej: JavaScript, React, Node.js, Express, MongoDB"
                      required
                      disabled={createLoading}
                    />
                    <div className="form-text">
                      Separa las tecnologías con comas
                    </div>

                    {/* Vista previa de tecnologías */}
                    {techPreview.length > 0 && (
                      <div className="mt-3">
                        <h6 className="text-muted mb-2">Vista previa:</h6>
                        <div className="tech-preview">
                          {techPreview.map((tech, index) => (
                            <span key={index} className="tech-badge">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="d-flex gap-2 justify-content-end">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowCreateModal(false)}
                      disabled={createLoading}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={createLoading || !newBootcamp.name || !newBootcamp.description || !newBootcamp.technologies}
                    >
                      {createLoading ? (
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
          </div>
        </div>
      )}

      <style jsx>{`
        .dashboard-container {
          min-height: 100vh;
          background-color: #f8f9fa;
        }
        
        .stats-card {
          border-radius: 12px;
          border: none;
          box-shadow: 0 0.3rem 1rem rgba(0, 0, 0, 0.08);
          transition: transform 0.3s;
        }
        
        .stats-card:hover {
          transform: translateY(-5px);
        }
        
        .tech-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 0.3rem;
        }
        
        .tech-badge {
          background-color: #e9ecef;
          color: #495057;
          padding: 0.25em 0.5em;
          border-radius: 50rem;
          font-size: 0.75rem;
          font-weight: 600;
        }
        
        .tech-badge-more {
          background-color: #6c757d;
          color: white;
          padding: 0.25em 0.5em;
          border-radius: 50rem;
          font-size: 0.75rem;
          font-weight: 600;
        }
        
        .table th {
          border-top: none;
          font-weight: 600;
          color: #495057;
          background-color: #f8f9fa;
        }
        
        .btn-group .btn {
          border-radius: 6px;
          margin-right: 0.3rem;
        }
        
        .navbar-brand {
          font-weight: 700;
        }
        
        .input-group-text {
          background-color: #f8f9fa;
        }
        
        .modal-content {
          border-radius: 12px;
          border: none;
          box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.2);
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
      `}</style>
    </div>
  );
}