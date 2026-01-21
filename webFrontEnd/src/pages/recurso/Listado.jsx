import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function ListadoRecurso() {

    const [recursos, setRecursos] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRecursos = () => {
        api.get("/recursos/")
            .then((response) => {
                setRecursos(response.data);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchRecursos();
    }, []);

    const eliminarRecurso = (id) => {
        if (!window.confirm("¿Desea eliminar este recurso?")) return;

        api.delete(`/recursos/${id}`)
            .then(() => {
                alert("Recurso eliminado");
                fetchRecursos();
            });
    };

    if (loading) return <p className="text-center">Cargando recursos...</p>;

    return (
        <div className="container">
            <h2>Listado de Recursos</h2>

            <Link to="/recursos/nuevo" className="btn btn-success mb-3">
                Nuevo Recurso
            </Link>

            <table className="table table-striped table-hover shadow">
                <thead className="table-dark">
                    <tr>
                        <th>Tipo</th>
                        <th>Estado</th>
                        <th>Capacidad</th>
                        <th className="text-center">Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {recursos.map((v) => (
                        <tr key={v.recur_id}>
                            <td>{v.fk_recur_tipo_nombre || v.fk_recur_tipo}</td>
                            <td>{v.recur_estado}</td>
                            <td>{v.recur_capacidad}</td>
                            <td className="text-center">
                                <Link
                                    to={`/recursos/editar/${v.recur_id}`}
                                    className="btn btn-sm btn-warning me-2"
                                >
                                    <i className="bi bi-pencil-square"></i>
                                </Link>

                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => eliminarRecurso(v.recur_id)}
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

export default ListadoRecurso;
