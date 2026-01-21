import api from "../api/axios";

const AuthService = {
    login: async (username, password) => {
        try {
            // petición POST a django para pedir el token
            const response = await api.post("token/", { 
                username, 
                password 
            });

            // si django responde bien se guarda el token de forma local
            if (response.data.access) {
                localStorage.setItem("access_token", response.data.access);
                localStorage.setItem("refresh_token", response.data.refresh);
            }
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
    }
};

export default AuthService;