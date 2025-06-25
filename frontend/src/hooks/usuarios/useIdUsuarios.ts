import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Rol {
    id: number;
    nombre_rol: string;
}

interface Usuario {
    identificacion: number;
    email: string;
    nombre: string;
    contrasena?: string;
    telefono?: string;
    fk_id_rol: Rol | number;
}

interface UsuarioResponse {
    usuarios: Usuario[]; // 👈 arreglo dentro del objeto
}

const apiUrl = import.meta.env.VITE_API_URL;

export const useUsuarioPorId = (identificacion: string | undefined) => {
    return useQuery<Usuario>({
        queryKey: ["Usuario", identificacion],
        queryFn: async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No se ha encontrado un token de autenticación");
            }

            const { data } = await axios.get<UsuarioResponse>(`${apiUrl}usuarios/${identificacion}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            return data.usuarios?.[0]; // ✅ sin errores de tipado
        },
        enabled: !!identificacion,
    });
};
