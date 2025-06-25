import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface Cultivo {
    id_cultivo: number;
    nombre_cultivo: string;
    fecha_plantacion: string;
    descripcion: string;
    fk_id_especie: number;
    fk_id_semillero: number;
}

export const useActualizarCultivo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (cultivoActualizado: Cultivo) => {
            const { id_cultivo, ...datos } = cultivoActualizado;
            const { data } = await axios.put(`${apiUrl}cultivo/${id_cultivo}/`, datos);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Cultivos"] }); // Actualizar la lista de cultivos
        },
    });
};
