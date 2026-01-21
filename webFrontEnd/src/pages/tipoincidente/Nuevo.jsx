import { useNavigate } from "react-router-dom";
import FormularioTipoIncidente from "../../components/tipoincidente/FormularioTipoIncidente";

function NuevoTipoIncidente() {

    const navigate = useNavigate();

         const onSubmit = (form) => {
        api.post("/tipos/incidente/", {
            tipo_nombre: form.tipo_nombre,
            tipo_descripcion: form.tipo_descripcion
        })
        .then(() => {
            alert("Tipo de incidente registrado");
            navigate("/tipos-incidente");
        })
        .catch(() => {
            alert("Error al registrar");
        });
    };

    return (
        <div className="container">
            <h2>Nuevo Tipo de Incidente</h2>
            <FormularioTipoIncidente onSubmit={onSubmit} />
        </div>
    );
}

export default NuevoTipoIncidente;
