import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FormularioIncidente from "../../components/incidente/FormularioIncidente";
import api from "../../api/axios";

function EditarIncidente() {
    const { id } = useParams();  
    const navigate = useNavigate();
    const [datosIniciales, setDatosIniciales] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/incidentes/${id}/`)
            .then(res => {
                setDatosIniciales(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                alert("Error al cargar el incidente");
                setLoading(false);
            });
    }, [id]);

    const onSubmit = (form) => {
        api.put(`/incidentes/${id}/`, form)
            .then(() => {
                alert("Incidente actualizado");
                navigate("/incidentes");  
            })
            .catch(err => {
                console.error(err);
                alert("Error al actualizar el incidente");
            });
    };

    if (loading) return <p className="text-center">Cargando incidente...</p>;

    return (
        <div className="container">
            <h2>Editar Incidente</h2>
            <FormularioIncidente datosIniciales={datosIniciales} onSubmit={onSubmit} />
        </div>
    );
}

export default EditarIncidente;
