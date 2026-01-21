import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

function ListadoRol(){

    const[roles,setRoles]= useState([]);
    const[loading,setLoading] = useState([]);

    const fetchRol = ()=>{
    fetch("")//aqui debo enviar la url del api
      .then((res)=>res.json())
      .then((data) =>{
        setRoles(data);
        setLoading(false);
      })
  }

    useEffect(()=>{
    fetchRol();

  },[])
  const navigate = useNavigate()


  if(loading) return <p className="text-center">Cargando incidencias....</p>
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
                  <button className="btn btn-sm btn-warning"><i className="bi bi-pencil-square"></i></button>
                  <button className="btn btn-sm btn-danger"><i className="bi bi-trash"></i></button>

                </td>
            </tr>
          
          ))}
        </tbody>

      </table>
    </div>
  )
}

export default ListadoRol
