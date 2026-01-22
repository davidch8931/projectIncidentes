import { useNavigate } from "react-router-dom";
import FormularioTipoRecurso from "../../components/tiporecurso/FormularioTipoRecurso";
import api from "../../api/axios";  

function NuevoTipoRecurso() {
  const navigate = useNavigate();

  const onSubmit = (form) => {
    api.post("/tipos-recursos/", {
      tipo_nombre: form.tipo_nombre,
      tipo_descripcion: form.tipo_descripcion
    })
    .then(() => {
 
      window.iziToast.success({
        title: "Éxito",
        message: "Tipo de recurso creado correctamente",
        position: "topRight"
      });

       
      navigate("/tipos/recurso");
    })
    .catch(() => {
   
      window.iziToast.error({
        title: "Error",
        message: "No se pudo crear el tipo de recurso",
        position: "topRight"
      });
    });
  };

  return (
    <div className="container">
      <FormularioTipoRecurso onSubmit={onSubmit} />
    </div>
  );
}

export default NuevoTipoRecurso;
