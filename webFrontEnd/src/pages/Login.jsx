import { useNavigate } from "react-router-dom"

function Login (){
    const navigate = useNavigate()

    const iniciarSesion = () => {
        
        navigate("/")
    }
    return(
        <div>
            <h2>BIENVENIDO AL SISTEMA</h2>
            <label htmlFor="">Emial</label><br />
            <input type="text" /><br /><br />
            <label htmlFor="">Contraseña</label><br />
            <input type="text" /><br /><br />
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