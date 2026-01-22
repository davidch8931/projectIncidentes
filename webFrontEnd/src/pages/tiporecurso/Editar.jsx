import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FormularioTipoRecurso from "../../components/tiporecurso/FormularioTipoRecurso";
import api from "../../api/axios";

function EditarTipoRecurso() {
  const { id } = useParams();   
  const navigate = useNavigate();
  const [datosIniciales, setDatosIniciales] = useState(null);
  const [loading, setLoading] = useState(true);

 
  useEffect(() => {
    api.get(`/tipos-recursos/${id}/`)
      .then(res => {
        setDatosIniciales(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        window.iziToast.error({
          title: "Error",
          message: "No se pudo cargar el tipo de recurso",
          position: "topRight"
        });
        setLoading(false);
      });
  }, [id]);
 
  const onSubmit = (form) => {
    api.put(`/tipos-recursos/${id}/`, form)
      .then(() => {
        window.iziToast.success({
          title: "Éxito",
          message: "Tipo de recurso actualizado correctamente",
          position: "topRight"
        });
        navigate("/tipos/recurso");
      })
      .catch((err) => {
        console.error(err);
        window.iziToast.error({
          title: "Error",
          message: "No se pudo actualizar el tipo de recurso",
          position: "topRight"
        });
      });
  };

  if (loading) return <p className="text-center">Cargando tipo de recurso...</p>;

  return (
    <div className="container">
      <h2>Editar Tipo de Recurso</h2>
      <FormularioTipoRecurso 
        datosIniciales={datosIniciales} 
        onSubmit={onSubmit} 
        readonlyNombre={true}  
      />
    </div>
  );
}

export default EditarTipoRecurso;
