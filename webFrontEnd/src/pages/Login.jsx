import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import AuthService from "../services/auth" // Importamos el servicio

function Login (){
    const navigate = useNavigate()
    
    // estados guardar lo que escribe el usuraio
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("") // mostrar mensaje si falla

    //si ya tiene token no puede estar en login
    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (token) {
            navigate("/incidentes", { replace: true });
        }
    }, [navigate]);

    // 2. Función asíncrona para conectar con la API
    const iniciarSesion = async () => {
        setError(""); // Limpiar errores previos
        try {
            // Llamamos al servicio de login
            await AuthService.login(username, password);
            
            // Si no da error, redirigimos
            navigate("/incidentes", {replace: true});
        } catch (err) {
            console.error(err);
            setError("Usuario o contraseña incorrectos");
        }
    }

    return(
        <div>
            <h2>BIENVENIDO AL SISTEMA</h2>
            
            {/* Mensaje de error simple */}
            {error && <p style={{color: 'red'}}>{error}</p>}

            <label>Usuario</label><br />
            <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            /><br /><br />

            <label>Contraseña</label><br />
            <input 
                type="password"  
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
            /><br /><br />

            <button 
                className="btn btn-primary"
                onClick={iniciarSesion}
            >
                Iniciar Sesión
            </button>
        </div>
    )
}

export default Login;