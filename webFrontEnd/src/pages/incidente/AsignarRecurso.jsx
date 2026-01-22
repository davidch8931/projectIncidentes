import { useEffect, useState } from "react";
import api from "../../api/axios";

function AsignarRecurso({ incidente, onCerrar, onGuardar }) {
  const [recursos, setRecursos] = useState([]);
  const [rescatistas, setRescatistas] = useState([]);
  
  // Guardamos recursos seleccionados: { recursoId: { cantidad, rescatistas: [] } }
  const [seleccionados, setSeleccionados] = useState({ recursos: {} });

  // Traer datos de la API
  useEffect(() => {
    api.get("/recursos/").then(res => setRecursos(res.data));
    api.get("/rescatistas-disponibles/").then(res => setRescatistas(res.data));



  }, []);

  // Toggle recurso seleccionado
  const toggleRecurso = (id) => {
    const recursoId = String(id);
    setSeleccionados(prev => {
      const copy = { ...prev.recursos };
      if (copy[recursoId]) {
        delete copy[recursoId]; // deseleccionar
      } else {
        copy[recursoId] = { cantidad: 1, rescatistas: [] }; // seleccionar
      }
      return { recursos: copy };
    });
  };

  // Cambiar cantidad de recurso
  const cambiarCantidad = (id, cantidad) => {
    const recursoId = String(id);
    setSeleccionados(prev => ({
      recursos: {
        ...prev.recursos,
        [recursoId]: {
          ...prev.recursos[recursoId],
          cantidad
        }
      }
    }));
  };

  // Toggle rescatista asociado a recurso
  const toggleRescatista = (recursoId, rescatistaId) => {
    recursoId = String(recursoId);
    setSeleccionados(prev => {
      const res = prev.recursos[recursoId].rescatistas;
      const nuevos = res.includes(rescatistaId)
        ? res.filter(r => r !== rescatistaId)
        : [...res, rescatistaId];

      return {
        recursos: {
          ...prev.recursos,
          [recursoId]: {
            ...prev.recursos[recursoId],
            rescatistas: nuevos
          }
        }
      };
    });
  };

  // Guardar asignaciones
  const handleGuardar = () => {
    const payload = Object.entries(seleccionados.recursos).map(
      ([recursoId, data]) => ({
        recurso_id: recursoId,
        cantidad: data.cantidad,
        rescatistas: data.rescatistas
      })
    );
    onGuardar({ incidenteId: incidente.inci_id, asignaciones: payload });
  };

  // Cerrar modal al dar click en backdrop
  const backdropClick = (e) => {
    if (e.target.classList.contains("modal-backdrop-custom")) onCerrar();
  };

  return (
    <div
      className="modal-backdrop-custom"
      style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1050
      }}
      onClick={backdropClick}
    >
      <div
        className="modal-dialog"
        style={{ maxWidth: "650px", width: "100%" }}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              Asignar Recursos: {incidente.tipo_inci_nombre}
            </h5>
            <button type="button" className="btn-close" onClick={onCerrar}></button>
          </div>

          <div
            className="modal-body"
            style={{ maxHeight: "70vh", overflowY: "auto" }}
          >
            <h6>Recursos Disponibles</h6>
            {recursos.map(r => {
              const recursoSeleccionado = seleccionados.recursos[String(r.id)];
              return (
                <div key={r.id} className="border p-2 mb-2 rounded">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={`recurso-${r.id}`}
                      checked={!!recursoSeleccionado}
                      onChange={() => toggleRecurso(r.id)}
                    />
                    <label htmlFor={`recurso-${r.id}`} className="form-check-label">
                      {r.recur_nombre} (Disponibles: {r.recur_capacidad})
                    </label>
                  </div>

                  {recursoSeleccionado && (
                    <div className="mt-2 ps-3">
                      <label>Cantidad:</label>
                      <input
                        type="number"
                        min="1"
                        max={r.recur_capacidad}
                        value={recursoSeleccionado.cantidad}
                        onChange={e => cambiarCantidad(r.id, parseInt(e.target.value))}
                        className="form-control mb-2"
                      />

                      <h6>Rescatistas Disponibles</h6>
                      {rescatistas
                        .filter(res => res.fk_rol.rol_nombre === "Rescatista")
                        .map(res => (
                         <div key={`${res.id}-${r.id}`} className="form-check">

                            <input
                              type="checkbox"
                              className="form-check-input"
                              id={`rescatista-${res.id}-${r.id}`}
                              checked={recursoSeleccionado.rescatistas.includes(res.id)}
                              onChange={() => toggleRescatista(r.id, res.id)}
                            />
                            <label htmlFor={`rescatista-${res.id}-${r.id}`} className="form-check-label">
                              {res.username}
                            </label>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onCerrar}>Cancelar</button>
            <button className="btn btn-primary" onClick={handleGuardar}>Guardar Asignación</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AsignarRecurso;
