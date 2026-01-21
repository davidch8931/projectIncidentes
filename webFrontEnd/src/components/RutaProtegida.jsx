import { Navigate, Outlet } from "react-router-dom";

const RutaProtegida = () => {
    const token = localStorage.getItem("access_token");

    // Si NO hay token lo mandamos al Login
    if (!token) {
        return <Navigate to="/" replace />;
    }

    // Si hay token, dejamos pasar a las rutas hijas
    return <Outlet />;
};

export default RutaProtegida;