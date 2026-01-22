import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";  

function ListadoTipoRecurso() {
  const [tiposRecurso, setTiposRecurso] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTipoRecurso = () => {
    api.get("/tipos-recursos/")  
      .then((response) => {
        setTiposRecurso(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        window.iziToast.error({
          title: "Error",
          message: "No se pudo cargar los tipos de recurso",
          position: "topRight"
        });
      });
  };

  
useEffect(() => {
  if ($.fn.DataTable.isDataTable("#tabla")) {
    $("#tabla").DataTable().destroy();
  }

  $("#tabla").DataTable({
    language: {
      url: "https://cdn.datatables.net/plug-ins/1.13.8/i18n/es-ES.json"
    }
  });
}, [tiposRecurso]);

  
  const eliminarTipoRecurso = (id) => {
    window.iziToast.question({
      timeout: false,
      close: false,
      overlay: true,
      displayMode: "once",
      title: "Confirmación",
      message: "¿Desea eliminar este tipo de recurso?",
      position: "center",
      buttons: [
        [
          "<button>SI</button>",
          async (instance, toast) => {
            try {
              await api.delete(`/tipos-recursos/${id}/`);
              window.iziToast.success({
                title: "Eliminado",
                message: "Tipo de recurso eliminado correctamente",
                position: "topRight"
              });
             
              setTiposRecurso(prev => prev.filter(t => t.tipo_id !== id));
            } catch (err) {
              console.error(err);
              window.iziToast.error({
                title: "Error",
                message: "No se pudo eliminar el tipo de recurso.Está siendo ocupado en un incidente",
                position: "topRight"
              });
            }
            instance.hide({ transitionOut: "fadeOut" }, toast);
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
    fetchTipoRecurso();
  }, []);

  if (loading) return <p className="text-center">Cargando tipos de recurso...</p>;

  return (
    <div className="container">
    

      <Link to="/tipos/recurso/nuevo" className="btn btn-success mb-3">
        <i className="bi bi-plus-circle me-2"></i>
        Nuevo Tipo de Recurso
      </Link>

   <table id="tabla" className="table table-striped table-bordered">  

        <thead >
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {tiposRecurso.map((v) => (
            <tr key={v.tipo_id}>
              <td>{v.tipo_nombre}</td>
              <td>{v.tipo_descripcion}</td>
              <td className="text-center">
                <Link
                  to={`/tipos/recurso/editar/${v.tipo_id}`}
                  className="btn btn-sm btn-warning me-2"
                >
                  <i className="bi bi-pencil-square"></i>
                </Link>

                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => eliminarTipoRecurso(v.tipo_id)}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListadoTipoRecurso;
