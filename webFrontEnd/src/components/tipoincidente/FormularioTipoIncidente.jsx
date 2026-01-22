import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function FormularioTipoIncidente({ datosIniciales, onSubmit }) {

    const [form, setForm] = useState({
        tipo_nombre: "",
        tipo_descripcion: ""
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
                <label className="form-label">Nombre:</label>
                <input
                    type="text"
                    name="tipo_nombre"
                    className="form-control"
                    placeholder="Ingrese tipo de incidente"
                    value={form.tipo_nombre}
                    onChange={cambiarValor}
                    required
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Descripción:</label>
                <textarea
                    name="tipo_descripcion"
                    className="form-control"
                    rows="3"
                    placeholder="Descripción del tipo de incidente"
                    value={form.tipo_descripcion}
                    onChange={cambiarValor}
                    required

                />
            </div>

            <div className="text-center">
                <button type="submit" className="btn btn-primary">
                    Guardar
                </button>
                <Link to="/tipos-incidentes" className="btn btn-secondary ms-2">
                    Cancelar
                </Link>
            </div>

        </form>
    );
}

export default FormularioTipoIncidente;
