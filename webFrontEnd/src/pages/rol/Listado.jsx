import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

function ListadoRol(){

    const[roles,setRoles]= useState([]);
    const[loading,setLoading] = useState([]);

    const fetchRol = ()=>{
     api.get("/roles/")
      .then((response) => {
        setRoles(response.data);
        setLoading(false);
      })
  }

    useEffect(()=>{
    fetchRol();

  },[])

    const eliminarRol = (id) => {
        if (!window.confirm("¿Desea eliminar este recurso?")) return;

        api.delete(`/roles/${id}`)
            .then(() => {
                alert("Rol eliminado");
                fetchRol();
            });
    };

  if(loading) return <p className="text-center">Cargando roles....</p>
  return (
    <div className="container">
      <h2>Listado de Roles</h2>
      <Link to="/roles/nuevo" className="btn btn-success mb-3">
       Nuevo Rol
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
          {roles.map((v) =>(
             
            <tr key={v.rol_id}>
                <td>{v.rol_nombre}</td>
                <td>{v.rol_descripcion}</td>
                <td>
            
                <Link
                                    to={`/roles/editar/${v.rol_id}`}
                                    className="btn btn-sm btn-warning me-2"
                                >
                                    <i className="bi bi-pencil-square"></i>
                                </Link>

                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => eliminarRol(v.rol_id)}
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

export default ListadoRol
