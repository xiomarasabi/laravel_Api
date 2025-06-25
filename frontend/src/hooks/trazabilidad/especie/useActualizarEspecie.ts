import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface Especie {
    id: number;
    nombre_comun: string;
    nombre_cientifico: string;
    descripcion: string;
    fk_id_tipo_cultivo: number | null;
}

export const useActualizarEspecie = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (especieActualizada: Especie) => {
            const { id, ...datos } = especieActualizada;

            const token = localStorage.getItem("token");
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            const { data } = await axios.put(`${apiUrl}especie/${id}`, datos, { headers });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["especies"] });
        },
    });
};
