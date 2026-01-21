import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function FormularioRecurso({ datosIniciales, onSubmit }) {
    const [form, setForm] = useState({
        fk_recur_tipo: "",
        recur_estado: "Disponible",
        recur_capacidad: 1
    });

    useEffect(() => {
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
                <label className="form-label">Tipo de Recurso:</label>
                <select
                    name="fk_recur_tipo"
                    className="form-select"
                    value={form.fk_recur_tipo}
                    onChange={cambiarValor}
                    required
                >
                    <option value="">Seleccione</option>
                    {/* luego se llena desde API */}
                    <option value="1">Ambulancia</option>
                    <option value="2">Camión</option>
                </select>
            </div>

            <div className="mb-3">
                <label className="form-label">Estado:</label>
                <select
                    name="recur_estado"
                    className="form-select"
                    value={form.recur_estado}
                    onChange={cambiarValor}
                >
                    <option value="Disponible">Disponible</option>
                    <option value="Ocupado">Ocupado</option>
                    <option value="Mantenimiento">Mantenimiento</option>
                </select>
            </div>

            <div className="mb-3">
                <label className="form-label">Capacidad:</label>
                <input
                    type="number"
                    name="recur_capacidad"
                    className="form-control"
                    min="1"
                    value={form.recur_capacidad}
                    onChange={cambiarValor}
                    required
                />
            </div>

            <div className="mb-6 text-center">
                <button type="submit" className="btn btn-primary">
                    Guardar
                </button>
                <Link to="/recursos" className="btn btn-secondary ms-2">
                    Cancelar
                </Link>
            </div>

        </form>
    );
}

export default FormularioRecurso;
