import { useEffect,useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import api from "../../api/axios"
import AsignarRecurso from "./AsignarRecurso";

function ListadoIncidente() {
    const[incidentes,setIncidentes] = useState([]);
  const[loading,setLoading] = useState([]);
   const [modalVisible, setModalVisible] = useState(false);
  const [incidenteSeleccionado, setIncidenteSeleccionado] = useState(null);
    const navigate = useNavigate()

  const fetchIncidencia = ()=>{
    api.get("/incidentes/")
      .then((response) => {
        setIncidentes(response.data);
        setLoading(false);
      })
  }
    const asignarRecursos = (incidente) => {
    setIncidenteSeleccionado(incidente);
    setModalVisible(true);
  };

    const cerrarModal = () => {
    setModalVisible(false);
    setIncidenteSeleccionado(null);
  };

  const guardarAsignacion = (incidenteId) => {
  console.log("Asignación guardada, incidente:", incidenteId);

  api.patch(`/incidentes/${incidenteId}/`, {
    inci_estado: 'Asignado'
  })
    .then(() => {
      fetchIncidencia();
      cerrarModal();
    });
  };

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
            <th>Gestión</th>
          </tr>
        </thead>
        <tbody>
          {incidentes.map((v) =>(
             
            <tr key={v.inci_id}>
                <td>{v.tipo_inci_nombre}</td>
                <td>{v.severidad_nombre}</td>
                <td>{v.inci_descripcion}</td>
                <td>{v.inci_latitud}</td>
                <td>{v.inci_longitud}</td>
                <td>{v.inci_estado}</td>
                <td>

                <Link  to={`/incidentes/editar/${v.inci_id}`}
                 className="btn btn-sm btn-warning me-2">
                <i className="bi bi-pencil-square"></i>
                </Link>

                 <button className="btn btn-sm btn-danger"
                 onClick={() => eliminarIncidente(v.inci_id)}>
                  <i className="bi bi-trash"></i>
                 </button>
                </td>
                <td>
                   {v.inci_estado === "Pendiente" && (
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => asignarRecursos(v)}
                  >
                    Asignar Recursos
                  </button>
                )}
                </td>
            </tr>
          
          ))}
        </tbody>

      </table>
       {modalVisible && incidenteSeleccionado && (
        <AsignarRecurso
          incidente={incidenteSeleccionado}
          onCerrar={cerrarModal}
          onGuardar={guardarAsignacion}
        />
      )}
    </div>
  )
}

export default ListadoIncidente

 