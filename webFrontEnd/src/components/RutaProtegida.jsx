import { Navigate, Outlet } from "react-router-dom";

const RutaProtegida = () => {
    const token = localStorage.getItem("access_token");

    // Si NO hay token, lo mandamos al Login (replace para que no pueda volver)
    if (!token) {
        return <Navigate to="/" replace />;
    }

    // Si SÍ hay token, dejamos pasar a las rutas hijas (Outlet)
    return <Outlet />;
};

export default RutaProtegida;