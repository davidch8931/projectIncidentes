import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function ListadoTipoIncidente() {

    const [tiposInci, setTipos] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTipos = () => {
        api.get("/tipos/incidente/")
            .then((response) => {
                setTipos(response.data);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchTipos();
    }, []);

    const eliminarTipo = (id) => {
        if (!window.confirm("¿Desea eliminar este tipo de incidente?")) return;

        api.delete(`/tipos/incidente/${id}/`)
            .then(() => {
                alert("Registro eliminado");
                fetchTipos();
            });
    };

    if (loading) return <p className="text-center">Cargando tipos de incidente...</p>;

    return (
        <div className="container">
            <h2>Tipos de Incidente</h2>

            <Link to="/tipos/incidente/nuevo" className="btn btn-success mb-3">
                Nuevo Tipo
            </Link>

            <table className="table table-striped table-hover shadow">
                <thead className="table-dark">
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
                                    to={`/tipos/incidente/editar/${v.tipo_id}`}
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
