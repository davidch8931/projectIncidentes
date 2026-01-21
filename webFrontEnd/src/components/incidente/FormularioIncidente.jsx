import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";



function FormularioIncidente({ datosIniciales, onSubmit }) {
    const [form, setForm] = useState({
        fk_tipo_inci: "",
        fk_seve_id: "",
        inci_descripcion: "",
        inci_latitud: "",
        inci_longitud: "",
        inci_estado: "Pendiente"
    });

    const [tiposIncidente, setTiposIncidente] = useState([]);
    const [severidades, setSeveridades] = useState([]);
    useEffect(() => {
        api.get("/tipos-incidentes/")
            .then(res => setTiposIncidente(res.data));

        api.get("/severidades/")
            .then(res => setSeveridades(res.data));

        if (datosIniciales) {
            setForm(datosIniciales);
        }
    }, [datosIniciales]);

     const cambiarValor = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((previo) => ({
            ...previo,
            [name]: type === "checkbox" ? checked : value
        }));
    }

    const ejecutarAccion = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <form className="card p-4 shadow" onSubmit={ejecutarAccion}>

            <div className="mb-3">
                <label className="form-label">Tipo de Incidente:</label>
                <select
                    name="fk_tipo_inci"
                    className="form-select"
                    value={form.fk_tipo_inci}
                    onChange={cambiarValor}
                    required
                >
                    <option value="">Seleccione</option>
                    {tiposIncidente.map(t => (
                        <option key={t.tipo_id} value={t.tipo_id}>
                            {t.tipo_nombre}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-3">
                <label className="form-label">Severidad:</label>
                <select
                    name="fk_seve_id"
                    className="form-select"
                    value={form.fk_seve_id}
                    onChange={cambiarValor}
                    required
                >
                      <option value="">Seleccione</option>
                    {severidades.map(s => (
                        <option key={s.seve_id} value={s.seve_id}>
                            {s.seve_nombre}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-3">
                <label className="form-label">Descripción:</label>
                <textarea
                    name="inci_descripcion"
                    className="form-control"
                    placeholder="Ingrese la descripción del incidente"
                    value={form.inci_descripcion}
                    onChange={cambiarValor}
                    required
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Latitud:</label>
                <input
                    type="number"
                    step="0.0000001"
                    name="inci_latitud"
                    className="form-control"
                    value={form.inci_latitud}
                    onChange={cambiarValor}
                    required
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Longitud:</label>
                <input
                    type="number"
                    step="0.0000001"
                    name="inci_longitud"
                    className="form-control"
                    value={form.inci_longitud}
                    onChange={cambiarValor}
                    required
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Estado:</label>
                <select
                    name="inci_estado"
                    className="form-select"
                    value={form.inci_estado}
                    onChange={cambiarValor}
                >
                    <option value="Pendiente">Pendiente</option>
                </select>
            </div>

            <div className="mb-6 text-center">
                <button type="submit" className="btn btn-primary">
                    Guardar
                </button>
                <Link to="/incidentes" className="btn btn-secondary ms-2">
                    Cancelar
                </Link>
            </div>

        </form>
    );
}

export default FormularioIncidente;
