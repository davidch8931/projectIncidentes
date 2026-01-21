import { useNavigate } from "react-router-dom"
import FormularioRol from "../../components/rol/FormularioRol";

function NuevoRol() {
   const navigate = useNavigate();
   const onSubmit = (form) => {
        apiFetch("", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                rol_nombre: form.rol_nombre,
                rol_descripcion: form.rol_descripcion,
               
            })
        })
            .then((res) => {
                if (res.ok) {
                    alert("Rol Creado");
                    navigate("/roles");
                } else {
                    alert("Error al crear el rol");
                }
            })
    }
    return (    
        <div className="container">
            <h2>Agregar Rol</h2>
            <FormularioRol onSubmit={onSubmit} />
        </div>
    )
}

export default NuevoIncidente