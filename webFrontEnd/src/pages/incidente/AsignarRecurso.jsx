import { useEffect, useState } from "react";
import api from "../../api/axios";

function AsignarRecurso({ incidente, onCerrar, onGuardar }) {
  const [recursos, setRecursos] = useState([]);
  const [rescatistas, setRescatistas] = useState([]);
  const [seleccionados, setSeleccionados] = useState({});

  useEffect(() => {
    api.get("/recursos/").then(res => setRecursos(res.data));
    api.get("/rescatistas-disponibles/").then(res => setRescatistas(res.data));
  }, []);

  const toggleRecurso = (id) => {
    const recursoId = String(id);
    setSeleccionados(prev => {
      const copy = { ...prev };
      if (copy[recursoId]) {
        delete copy[recursoId];
      } else {
        copy[recursoId] = { cantidad: 1, rescatistas: [] };
      }
      return copy;
    });
  };

  const cambiarCantidad = (id, cantidad) => {
    const recursoId = String(id);
    setSeleccionados(prev => ({
      ...prev,
      [recursoId]: {
        ...prev[recursoId],
        cantidad: Math.max(1, cantidad)
      }
    }));
  };

  const toggleRescatista = (recursoId, rescatistaId) => {
    const recursoIdStr = String(recursoId);
    setSeleccionados(prev => {
      const rescatistasActuales = prev[recursoIdStr]?.rescatistas || [];
      const nuevosRescatistas = rescatistasActuales.includes(rescatistaId)
        ? rescatistasActuales.filter(r => r !== rescatistaId)
        : [...rescatistasActuales, rescatistaId];

      return {
        ...prev,
        [recursoIdStr]: {
          ...prev[recursoIdStr],
          rescatistas: nuevosRescatistas
        }
      };
    });
  };

  const handleGuardar = async () => {
    if (Object.keys(seleccionados).length === 0) {
      alert("Debe seleccionar al menos un recurso");
      return;
    }

    try {
      for (const [recursoId, data] of Object.entries(seleccionados)) {
        if (data.rescatistas.length === 0) continue;

        const payload = {
          fk_inci_id: incidente.inci_id,
          fk_recur_id: parseInt(recursoId),
          cantidad: data.cantidad,
          rescatistas: data.rescatistas
        };

        console.log("PAYLOAD:", payload);

        await api.post("/asignaciones/", payload);

        // Actualizar lista de rescatistas disponibles en UI
        setRescatistas(prev => prev.filter(r => !data.rescatistas.includes(r.id)));
      }

      alert("Asignación realizada correctamente");
      onGuardar(incidente.inci_id);
      onCerrar();

    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.detail ||
        "Error al asignar recursos"
      );
    }
  };

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
      <div className="modal-dialog" style={{ maxWidth: "650px", width: "100%" }}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              Asignar Recursos: {incidente.tipo_inci_nombre}
            </h5>
            <button type="button" className="btn-close" onClick={onCerrar}></button>
          </div>

          <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>
            <h6>Recursos Disponibles</h6>
            {recursos.map(r => {
              const recursoId = r.recur_id || r.id;
              const recursoIdStr = String(recursoId);
              const recursoSeleccionado = seleccionados[recursoIdStr];

              return (
                <div key={recursoId} className="border p-2 mb-2 rounded">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={`recurso-${recursoId}`}
                      checked={!!recursoSeleccionado}
                      onChange={() => toggleRecurso(recursoId)}
                    />
                    <label htmlFor={`recurso-${recursoId}`} className="form-check-label">
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
                        onChange={e => cambiarCantidad(recursoId, parseInt(e.target.value) || 1)}
                        className="form-control mb-2"
                        style={{ width: "100px" }}
                      />

                      <h6 className="mt-3">Rescatistas Disponibles</h6>
                      {rescatistas.length > 0 ? (
                        rescatistas.map(res => {
                          const estaSeleccionado = recursoSeleccionado.rescatistas.includes(res.id);
                          return (
                            <div key={`${recursoId}-${res.id}`} className="form-check">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                checked={estaSeleccionado}
                                onChange={() => toggleRescatista(recursoId, res.id)}
                              />
                              <label className="form-check-label">{res.username}</label>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-muted">No hay rescatistas disponibles</p>
                      )}
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
