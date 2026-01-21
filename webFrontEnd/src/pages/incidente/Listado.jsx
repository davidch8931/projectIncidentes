import { useEffect } from "react" // <--- Importante
import { useNavigate } from "react-router-dom"
import AuthService from "../../services/auth"

function ListadoIncidente() {
  const navigate = useNavigate()

  const cerrarSesion = () => {
    AuthService.logout()
    navigate("/", { replace: true })
  }

  return (
    <div>
      <h1>Página principal de listado de incidentes</h1>
      
      <button onClick={cerrarSesion}>
        Cerrar Sesión
      </button>
    </div>
  )
}

export default ListadoIncidente