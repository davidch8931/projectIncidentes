import { useNavigate } from "react-router-dom"
import FormularioRol from "../../components/rol/FormularioRol";
import api from "../../api/axios";


function NuevoRol() {
   const navigate = useNavigate();
   const onSubmit = (form) => {
        api.post("/roles/", {
            rol_nombre: form.rol_nombre,
            rol_descripcion: form.rol_descripcion
        })
            .then(() => {
 
  window.iziToast.success({
    title: "Éxito",
    message: "Rol creado correctamente",
    position: "topRight"
  });

 
  navigate("/roles");
})
.catch(() => {
 
  window.iziToast.error({
    title: "Error",
    message: "No se pudo crear el rol",
    position: "topRight"
  });
});

    }
    return (    
        <div className="container">
 
            <FormularioRol onSubmit={onSubmit} />
        </div>
    )
}

export default NuevoRol;