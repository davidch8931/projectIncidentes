import { useNavigate } from "react-router-dom"
import FormularioIncidente from "../../components/incidente/FormularioIncidente";
import api from "../../api/axios";

function NuevoIncidente() {
   const navigate = useNavigate();
  const onSubmit = (form) => {
        api.post("/incidentes/", {    
            fk_tipo_inci: form.fk_tipo_inci,
            fk_seve_id: form.fk_seve_id,
            inci_descripcion: form.inci_descripcion,
            inci_latitud: form.inci_latitud,
            inci_longitud: form.inci_longitud,
            inci_estado: form.inci_estado,
        })
        .then(() => {
            alert("Incidente creado");
            navigate("/incidentes");
        })
        .catch((error) => {
            console.error(error);
            alert("Error al crear el incidente");
        });
    };
    return (    
        <div className="container">
            <h2>Agregar Incidente</h2>
            <FormularioIncidente onSubmit={onSubmit} />
        </div>
    )
}

export default NuevoIncidente
