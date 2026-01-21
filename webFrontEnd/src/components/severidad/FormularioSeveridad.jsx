import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
function FormularioSeveridad({ datosIniciales, onSubmit }) {
    const [form, setForm] = useState({
        seve_nombre: "",
        seve_descripcion: "",
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
                <label className="form-label">Severidades:</label>
                <input
                    name="seve_nombre"
                    className="form-control"
                    value={form.seve_nombre}
                    onChange={cambiarValor}
                    required
                />
                  
            </div>

            <div className="mb-3">
                <label className="form-label">Descripción:</label>
                <textarea
                    name="seve_descripcion"
                    className="form-control"
                    value={form.seve_descripcion}
                    onChange={cambiarValor}
                    required
                />
                     
            </div>
 
            <div className="mb-6 text-center">
                <button type="submit" className="btn btn-primary">
                    Guardar
                </button>
                <Link to="/severidades" className="btn btn-secondary ms-2">
                    Cancelar
                </Link>
            </div>

        </form>
    );
}

export default FormularioSeveridad;
