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

  api.patch(`/incidentes/${incidenteId}/`, {
    inci_estado: 'Asignado'
  })
    .then(() => {
      fetchIncidencia();
      cerrarModal();
    });
  };

  const eliminarIncidente = (id) => {
  window.iziToast.question({
    timeout: false,
    close: false,
    overlay: true,
    displayMode: "once",
    title: "Confirmación",
    message: "¿Desea eliminar este incidente?",
    position: "center",
    buttons: [
      [
        "<button>SI</button>",
        async (instance, toast) => {
          try {
            await api.delete(`/incidentes/${id}/`);

            window.iziToast.success({
              title: "Eliminado",
              message: "Incidente eliminado correctamente",
              position: "topRight"
            });

            
            fetchIncidencia();

            instance.hide({ transitionOut: "fadeOut" }, toast);
          } catch (err) {
            console.error(err);
            window.iziToast.error({
              title: "Error",
              message: "No se pudo eliminar el incidente",
              position: "topRight"
            });
          }
        }
      ],
      [
        "<button>NO</button>",
        (instance, toast) => {
          instance.hide({ transitionOut: "fadeOut" }, toast);
        }
      ]
    ]
  });
};

useEffect(() => {
  fetchIncidencia();
}, []);


useEffect(() => {
  if ($.fn.DataTable.isDataTable("#tablaIncidentes")) {
    $("#tablaIncidentes").DataTable().destroy();
  }

  $("#tablaIncidentes").DataTable({
    language: {
      url: "https://cdn.datatables.net/plug-ins/1.13.8/i18n/es-ES.json"
    }
  });
}, [incidentes]);

  useEffect(()=>{
    fetchIncidencia();

  },[])


  if(loading) return <p className="text-center">Cargando incidencias....</p>
  return (
    <div className="container">
    <div className="d-flex justify-content-between align-items-center mb-3">
 

  <Link to="/incidentes/nuevo" className="btn btn-success">
    <i className="bi bi-plus-circle me-2"></i>
    Nuevo Incidente
  </Link>
</div>



   <table id="tablaIncidentes" className="table table-striped table-bordered">  
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
                { (v.inci_estado === "Asignado" || v.inci_estado === "Finalizado") ? (
                  <>
                    <button className="btn btn-sm btn-secondary me-2" disabled>
                      <i className="bi bi-pencil-square"></i>
                    </button>

                    <button className="btn btn-sm btn-secondary" disabled>
                      <i className="bi bi-trash"></i>
                    </button>
                  </>
                ) : (
                  <>
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
                  </>
                )}
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

                  {v.inci_estado === "Asignado" && (
                    <span className="badge bg-primary">En proceso</span>
                  )}

                  {v.inci_estado === "Finalizado" && (
                    <span className="badge bg-success">Finalizado</span>
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

 