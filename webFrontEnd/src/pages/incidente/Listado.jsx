import { useEffect,useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import api from "../../api/axios"
import AuthService from "../../services/auth"

function ListadoIncidente() {
    const[incidentes,setIncidentes] = useState([]);
  const[loading,setLoading] = useState([]);
  
  const fetchIncidencia = ()=>{
    api.get("/incidentes/")
      .then((response) => {
        setIncidentes(response.data);
        setLoading(false);
      })
  }

  useEffect(()=>{
    fetchIncidencia();

  },[])
  const navigate = useNavigate()

  const cerrarSesion = () => {
    AuthService.logout()
    navigate("/", { replace: true })
  }

  if(loading) return <p className="text-center">Cargando incidencias....</p>
  return (
    <div className="container">
      <h2>Listado de Incidentes</h2>
      <button onClick={cerrarSesion} className="btn btn-danger btn-sm">
            Cerrar Sesión
      </button>

      <Link to="/incidentes/nuevo" className="btn btn-success mb-3">
       Nuevo Incidente
    </Link>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Severidad</th>
            <th>Descripción</th>
            <th>Ubicación Latitud</th>
            <th>Ubicación Longitud</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {incidentes.map((v) =>(
             
            <tr key={v.inci_id}>
                <td>{v.fk_tipo_inci}</td>
                <td>{v.fk_seve_id}</td>
                <td>{v.inci_descripcion}</td>
                <td>{v.inci_latitud}</td>
                <td>{v.inci_longitud}</td>
                <td>{v.inci_estado}</td>
                <td>
                  <button className="btn btn-sm btn-warning"><i className="bi bi-pencil-square"></i></button>
                  <button className="btn btn-sm btn-danger"><i className="bi bi-trash"></i></button>

                </td>
            </tr>
          
          ))}
        </tbody>

      </table>
    </div>
  )
}

export default ListadoIncidente

 