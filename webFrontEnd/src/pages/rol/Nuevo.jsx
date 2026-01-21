import { useNavigate } from "react-router-dom"
import FormularioRol from "../../components/rol/FormularioRol";

function NuevoRol() {
   const navigate = useNavigate();
   const onSubmit = (form) => {
        api.post("/roles/", {
            rol_nombre: form.rol_nombre,
            rol_descripcion: form.rol_descripcion
        })
             .then(() => {
            alert("Rol Creado");
            navigate("/roles");
        })
        .catch(() => {
            alert("Error al crear el rol");
        });
    }
    return (    
        <div className="container">
            <h2>Agregar Rol</h2>
            <FormularioRol onSubmit={onSubmit} />
        </div>
    )
}

export default NuevoRol;