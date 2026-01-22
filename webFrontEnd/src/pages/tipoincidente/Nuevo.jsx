import { useNavigate } from "react-router-dom";
import FormularioTipoIncidente from "../../components/tipoincidente/FormularioTipoIncidente";
import api from "../../api/axios";

function NuevoTipoIncidente() {

    const navigate = useNavigate();

         const onSubmit = (form) => {
        api.post("/tipos-incidentes/", {
            tipo_nombre: form.tipo_nombre,
            tipo_descripcion: form.tipo_descripcion
        })
        .then(() => {
  window.iziToast.success({
    title: "Éxito",
    message: "Tipo de incidente registrado correctamente",
    position: "topRight"
  });
  navigate("/tipos-incidentes");  
})
.catch(() => {
  window.iziToast.error({
    title: "Error",
    message: "No se pudo registrar el tipo de incidente",
    position: "topRight"
  });
});

    };

    return (
        <div className="container">
         
            <FormularioTipoIncidente onSubmit={onSubmit} />
        </div>
    );
}

export default NuevoTipoIncidente;
