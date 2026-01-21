import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

function ListadoSeveridad(){

    const[severidades,setSeveridades]= useState([]);
    const[loading,setLoading] = useState([]);

    const fetchSeveridad = ()=>{
     api.get("/severidades/")
      .then((response) => {
        setSeveridades(response.data);
        setLoading(false);
      })
  }

  const eliminarSeveridad = (id) => {
    if (!window.confirm("¿Desea eliminar esta severidad?")) return;

    api.delete(`/severidades/${id}/`)        
        .then(() => {
            alert("Severidad eliminada");
            fetchSeveridad();
        });
};

    useEffect(()=>{
    fetchSeveridad();

  },[])

  if(loading) return <p className="text-center">Cargando severidades....</p>
  return (
    <div className="container">
      <h2>Listado de Severidades</h2>
      <Link to="/severidades/nuevo" className="btn btn-success mb-3">
       Nueva Severidad
    </Link>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {severidades.map((v) =>(
             
            <tr key={v.seve_id}>
                <td>{v.seve_nombre}</td>
                <td>{v.seve_descripcion}</td>
                <td>
                    <Link
                                    to={`/severidades/editar/${v.seve_id}`}
                                    className="btn btn-sm btn-warning me-2"
                                >
                                    <i className="bi bi-pencil-square"></i>
                                </Link>
                   <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => eliminarSeveridad(v.seve_id)}
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

export default ListadoSeveridad
