import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FormularioTipoIncidente from "../../components/tipoincidente/FormularioTipoIncidente";
import api from "../../api/axios";

function EditarTipoIncidente() {
  const { id } = useParams();   
  const navigate = useNavigate();
  const [datosIniciales, setDatosIniciales] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/tipos-incidentes/${id}/`)
      .then((res) => {
        setDatosIniciales(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        window.iziToast.error({
          title: "Error",
          message: "No se pudo cargar el tipo de incidente",
          position: "topRight"
        });
        setLoading(false);
      });
  }, [id]);

  const onSubmit = (form) => {
    api.put(`/tipos-incidentes/${id}/`, {
      tipo_nombre: form.tipo_nombre,
      tipo_descripcion: form.tipo_descripcion
    })
    .then(() => {
      window.iziToast.success({
        title: "Éxito",
        message: "Tipo de incidente actualizado correctamente",
        position: "topRight"
      });
      navigate("/tipos-incidentes");  
    })
    .catch((err) => {
      console.error(err);
      window.iziToast.error({
        title: "Error",
        message: "No se pudo actualizar el tipo de incidente",
        position: "topRight"
      });
    });
  };

  if (loading) return <p className="text-center">Cargando tipo de incidente...</p>;

  return (
    <div className="container">
      <FormularioTipoIncidente 
        datosIniciales={datosIniciales} 
        onSubmit={onSubmit} 
      />
    </div>
  );
}

export default EditarTipoIncidente;
