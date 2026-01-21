import { useNavigate } from "react-router-dom";
import FormularioRecurso from "../../components/recurso/FormularioRecurso";

function NuevoRecurso() {
    const navigate = useNavigate();

    const onSubmit = (form) => {
       apiFetch("", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                fk_recur_tipo: form.fk_recur_tipo,
                recur_estado: form.recur_estado,
                recur_capacidad: form.recur_capacidad
            })
        }).then((res) => {
            if (res.ok) {
                alert("Recurso registrado");
                navigate("/recursos");
            } else {
                alert("Error al registrar recurso");
            }
        });
    };

    return (
        <div className="container">
            <h2>Nuevo Recurso</h2>
            <FormularioRecurso onSubmit={onSubmit} />
        </div>
    );
}

export default NuevoRecurso;
