import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
function FormularioRol({ datosIniciales, onSubmit }) {
    const [form, setForm] = useState({
        rol_nombre: "",
        rol_descripcion: "",
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
                <label className="form-label">Roles:</label>
                <input
                    name="rol_nombre"
                    className="form-control"
                    value={form.rol_nombre}
                    onChange={cambiarValor}
                    required
                      readOnly={!!datosIniciales} 
                />
                  
            </div>

            <div className="mb-3">
                <label className="form-label">Descripción:</label>
                <textarea
                    name="rol_descripcion"
                    className="form-control"
                    value={form.rol_descripcion}
                    onChange={cambiarValor}
                    required
                />
                     
            </div>
 
            <div className="mb-6 text-center">
                <button type="submit" className="btn btn-primary">
                    Guardar
                </button>
                <Link to="/roles" className="btn btn-secondary ms-2">
                    Cancelar
                </Link>
            </div>

        </form>
    );
}

export default FormularioRol;
