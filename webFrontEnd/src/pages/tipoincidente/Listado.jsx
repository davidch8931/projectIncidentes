import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

function ListadoTipoIncidente() {

    const [tiposInci, setTipos] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTipos = async () => {
        try {
            const response = await api.get("/tipos-incidentes");
            setTipos(response.data);
        } catch (err) {
            console.error(err);
            window.iziToast.error({
                title: "Error",
                message: "No se pudieron cargar los tipos de incidente",
                position: "topRight"
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTipos();
    }, []);


      
useEffect(() => {
  if ($.fn.DataTable.isDataTable("#tabla")) {
    $("#tabla").DataTable().destroy();
  }

  $("#tabla").DataTable({
    language: {
      url: "https://cdn.datatables.net/plug-ins/1.13.8/i18n/es-ES.json"
    }
  });
}, [tiposInci]);

    const eliminarTipo = (id) => {
        window.iziToast.question({
            timeout: false,
            close: false,
            overlay: true,
            displayMode: "once",
            title: "Confirmación",
            message: "¿Desea eliminar este tipo de incidente?",
            position: "center",
            buttons: [
                [
                    "<button>SI</button>",
                    async (instance, toast) => {
                        try {
                            await api.delete(`/tipos-incidentes/${id}/`);
                            window.iziToast.success({
                                title: "Eliminado",
                                message: "Tipo de incidente eliminado correctamente",
                                position: "topRight"
                            });
                            setTipos(prev => prev.filter(t => t.tipo_id !== id));
                        } catch (err) {
                            console.error(err);
                            window.iziToast.error({
                                title: "Error",
                                message: "No se pudo eliminar el tipo de incidente. Puede estar en uso en un incidente.",
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

    if (loading) return <p className="text-center">Cargando tipos de incidente...</p>;

    return (
        <div className="container">

            <Link to="/tipos-incidente/nuevo" className="btn btn-success mb-3">
                Nuevo Tipo
            </Link>

            <table  id="tabla" className="table table-striped table-hover shadow">
                <thead >
                    <tr>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th className="text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {tiposInci.map((v) => (
                        <tr key={v.tipo_id}>
                            <td>{v.tipo_nombre}</td>
                            <td>{v.tipo_descripcion}</td>
                            <td className="text-center">
                                <Link
                                    to={`/tipos-incidentes/editar/${v.tipo_id}`}
                                    className="btn btn-sm btn-warning me-2"
                                >
                                    <i className="bi bi-pencil-square"></i>
                                </Link>

                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => eliminarTipo(v.tipo_id)}
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

export default ListadoTipoIncidente;
