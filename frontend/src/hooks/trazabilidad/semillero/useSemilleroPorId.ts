import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const useSemilleroPorId = (id_semillero: string | undefined) => {
    return useQuery({
        queryKey: ["Semilleros", id_semillero],
        queryFn: async () => {
            if (!id_semillero) throw new Error("ID no proporcionado");

            const token = localStorage.getItem("token");
            if (!token) throw new Error("Token no encontrado");

            const { data } = await axios.get(`${apiUrl}semilleros/${id_semillero}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("🌱 Datos obtenidos del backend:", data);
            return data;
        },
        enabled: !!id_semillero,
    });
};
