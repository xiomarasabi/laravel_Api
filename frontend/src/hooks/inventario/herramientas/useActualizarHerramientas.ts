import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface Herramientas {
    id: number;
    nombre: string;
    cantidad: number; // Eliminamos | string para consistencia
    estado: string;
    precio: number;
}

export const useActualizarHerramientas = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (herramientaActualizada: Partial<Herramientas> & { id: number }) => {
            const { id, ...rest } = herramientaActualizada;
            const { data } = await axios.put(
                `${apiUrl}herramientas/${id}`,
                rest,
            );
            console.log(data);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Herramientas"] });
        },
        onError: (error) => {
            console.error("Error en la mutación:", error);
        },
    });
};