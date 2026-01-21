import { useNavigate } from "react-router-dom"
import FormularioSeveridad from "../../components/severidad/FormularioSeveridad";

function NuevoSeveridad() {
   const navigate = useNavigate();
  const onSubmit = (form) => {
        api.post("/severidades/", {
            seve_nombre: form.seve_nombre,
            seve_descripcion: form.seve_descripcion,
        })
        .then(() => {
            alert("Severidad creada");
            navigate("/severidades");
        })
        .catch(() => {
            alert("Error al crear la severidad");
        });
    };
    return (    
        <div className="container">
            <h2>Agregar severidad</h2>
            <FormularioSeveridad onSubmit={onSubmit} />
        </div>
    )
}

export default NuevoSeveridad