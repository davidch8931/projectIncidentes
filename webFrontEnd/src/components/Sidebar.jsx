import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/auth"; 

function Sidebar() {
      const navigate = useNavigate();

  const cerrarSesion = () => {
    AuthService.logout(); 
    navigate("/", { replace: true }); 
  };
  return (
    <div className="bg-dark text-white p-3" style={{ width: "250px", minHeight: "100vh" }}>
      <h3 className="mb-4">Gestión</h3>
      <ul className="nav flex-column">

        {/* Incidentes */}
        <li className="nav-item mb-2">
          <span className="text-uppercase small text-secondary">Incidentes</span>
          <ul className="nav flex-column ms-3">
            <li className="nav-item">
              <Link to="/incidentes" className="nav-link text-white">
                <i className="bi bi-list-ul me-2"></i> Listado
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/incidentes/nuevo" className="nav-link text-white">
                <i className="bi bi-plus-circle me-2"></i> Nuevo
              </Link>
            </li>
          </ul>
        </li>

        {/* Roles */}
        <li className="nav-item mb-2">
          <span className="text-uppercase small text-secondary">Roles</span>
          <ul className="nav flex-column ms-3">
            <li className="nav-item">
              <Link to="/roles" className="nav-link text-white">
                <i className="bi bi-list-ul me-2"></i> Listado
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/roles/nuevo" className="nav-link text-white">
                <i className="bi bi-plus-circle me-2"></i> Nuevo
              </Link>
            </li>
          </ul>
        </li>

        {/* Recursos */}
        <li className="nav-item mb-2">
          <span className="text-uppercase small text-secondary">Recursos</span>
          <ul className="nav flex-column ms-3">
            <li className="nav-item">
              <Link to="/recursos" className="nav-link text-white">
                <i className="bi bi-list-ul me-2"></i> Listado
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/recursos/nuevo" className="nav-link text-white">
                <i className="bi bi-plus-circle me-2"></i> Nuevo
              </Link>
            </li>
          </ul>
        </li>

        {/* Tipos de Recurso */}
        <li className="nav-item mb-2">
          <span className="text-uppercase small text-secondary">Tipos de Recurso</span>
          <ul className="nav flex-column ms-3">
            <li className="nav-item">
              <Link to="/tipos/recurso" className="nav-link text-white">
                <i className="bi bi-list-ul me-2"></i> Listado
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/tipos/recurso/nuevo" className="nav-link text-white">
                <i className="bi bi-plus-circle me-2"></i> Nuevo
              </Link>
            </li>
          </ul>
        </li>

        {/* Tipos de Incidentes */}
        <li className="nav-item mb-2">
          <span className="text-uppercase small text-secondary">Tipos de Incidente</span>
          <ul className="nav flex-column ms-3">
            <li className="nav-item">
              <Link to="/tipos-incidentes" className="nav-link text-white">
                <i className="bi bi-list-ul me-2"></i> Listado
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/tipos/incidente/nuevo" className="nav-link text-white">
                <i className="bi bi-plus-circle me-2"></i> Nuevo
              </Link>
            </li>
          </ul>
        </li>      
      </ul>
        <button 
        onClick={cerrarSesion} 
        className="btn btn-danger mt-auto"
      >
        Cerrar Sesión
      </button>
    </div>
  );
}

export default Sidebar;
