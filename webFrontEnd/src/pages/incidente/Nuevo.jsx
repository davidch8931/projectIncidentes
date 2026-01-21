import { useNavigate } from "react-router-dom"
import FormularioIncidente from "../../components/incidente/FormularioIncidente";

function NuevoIncidente() {
   const navigate = useNavigate();
   const onSubmit = (form) => {
        apiFetch("", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                fk_tipo_inci: form.fk_tipo_inci,
                fk_seve_id: form.fk_seve_id,
                inci_descripcion: form.inci_descripcion,
                inci_latitud: form.inci_latitud,
                inci_longitud: form.inci_longitud,
                inci_estado: form.inci_estado,

            })
        })
            .then((res) => {
                if (res.ok) {
                    alert("Incidente Creado");
                    navigate("/incidencias");
                } else {
                    alert("Error al crear el incidente");
                }
            })
    }
    return (    
        <div className="container">
            <h2>Agregar Incidente</h2>
            <FormularioIncidente onSubmit={onSubmit} />
        </div>
    )
}

export default NuevoIncidente
