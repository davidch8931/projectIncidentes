import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function ListadoTipoRecurso() {

    const [tiposRecurso, setTiposRecurso] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTipoRecurso = () => {
        api.get("/tipos/recurso")
            .then((response) => {
                setTiposRecurso(response.data);
                setLoading(false);
            });
    };

    const eliminarTipoRecurso = (id) => {
    if (!window.confirm("¿Desea eliminar este tipo de recurso?")) return;

    api.delete(`/tipos/recurso/${id}`)
        .then(() => {
            alert("Tipo de recurso eliminado");
            fetchTipoRecurso();
        });
};


    useEffect(() => {
        fetchTipoRecurso();
    }, []);

    if (loading) return <p className="text-center">Cargando tipos de recurso...</p>;

    return (
        <div className="container">
            <h2>Listado de Tipos de Recurso</h2>

            <Link to="/tipos/recurso/nuevo" className="btn btn-success mb-3">
                Nuevo Tipo de Recurso
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
