import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface Semillero {
    id_semillero: number; // 👈 Este campo debe coincidir con lo que espera el backend
    nombre_semilla: string;
    fecha_siembra: string;
    fecha_estimada: string;
    cantidad: number;
}

export const useActualizarSemillero = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (semilleroActualizado: Semillero) => {
            const { id_semillero, ...datos } = semilleroActualizado;

            const token = localStorage.getItem("token");
            if (!token) throw new Error("Token no disponible");

            const { data } = await axios.put(
                `${apiUrl}semilleros/${id_semillero}`, // 👈 Usa `id_semillero`
                datos,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Semilleros"] });
        },
    });
};
