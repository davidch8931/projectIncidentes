import { useNavigate } from "react-router-dom";
import FormularioTipoRecurso from "../../components/tiporecurso/FormularioTipoRecurso";

function NuevoTipoRecurso() {
    const navigate = useNavigate();

    const onSubmit = (form) => {
        apiFetch("", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                tipo_nombre: form.tipo_nombre,
                tipo_descripcion: form.tipo_descripcion
            })
        }).then((res) => {
            if (res.ok) {
                alert("Tipo de recurso creado");
                navigate("/tipos/recurso");
            } else {
                alert("Error al crear tipo de recurso");
            }
        });
    };

    return (
        <div className="container">
            <h2>Nuevo Tipo de Recurso</h2>
            <FormularioTipoRecurso onSubmit={onSubmit} />
        </div>
    );
}

export default NuevoTipoRecurso;
