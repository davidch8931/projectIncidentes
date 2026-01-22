import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FormularioRol from "../../components/rol/FormularioRol";
import api from "../../api/axios";

function EditarRol() {
  const { id } = useParams();  
  const navigate = useNavigate();
  const [datosIniciales, setDatosIniciales] = useState(null);
  const [loading, setLoading] = useState(true);

 
  useEffect(() => {
    api.get(`/roles/${id}/`)
      .then(res => {
        setDatosIniciales(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        window.iziToast.error({
          title: "Error",
          message: "No se pudo cargar el rol",
          position: "topRight"
        });
        setLoading(false);
      });
  }, [id]);

 
  const onSubmit = (form) => {
    api.put(`/roles/${id}/`, form)
      .then(() => {
 
        window.iziToast.success({
          title: "Éxito",
          message: "Rol actualizado correctamente",
          position: "topRight"
        });

 
        navigate("/roles");
      })
      .catch((err) => {
        console.error(err);
 
        window.iziToast.error({
          title: "Error",
          message: "No se pudo actualizar el rol",
          position: "topRight"
        });
      });
  };

  if (loading) return <p className="text-center">Cargando rol...</p>;

  return (
    <div className="container">
 
      <FormularioRol datosIniciales={datosIniciales} onSubmit={onSubmit} />
    </div>
  );
}

export default EditarRol;
