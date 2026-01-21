import { useEffect,useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import api from "../../api/axios"

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

    const eliminarIncidente = (id) => {
    if (!window.confirm("¿Desea eliminar el incidente?")) return;

    api.delete(`/incidentes/${id}/`)        
        .then(() => {
            alert("Incidente eliminado");
            fetchIncidencia();
        });
};

  useEffect(()=>{
    fetchIncidencia();

  },[])
  const navigate = useNavigate()

  if(loading) return <p className="text-center">Cargando incidencias....</p>
  return (
    <div className="container">
      <h2>Listado de Incidentes</h2>
 

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

  <Link
                                    to={`/incidentes/editar/${v.inci_id}`}
                                    className="btn btn-sm btn-warning me-2"
                                >
                                    <i className="bi bi-pencil-square"></i>
                                </Link>

   <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => eliminarIncidente(v.inci_id)}
                                >
                                    <i className="bi bi-trash"></i>
                                </button>

                </td>
            </tr>
          
          ))}
        </tbody>

      </table>
    </div>
  )
}

export default ListadoIncidente

 