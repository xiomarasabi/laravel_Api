import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface Insumo {
    id: number;
    nombre: string;
    tipo: string;
    precio_unidad: number;
    cantidad: number;
    fecha_vencimiento: string | Date;
    unidad_medida: string;
}

const actualizarInsumo = async (insumo: Insumo) => {
    try {
        const { data } = await axios.put(`${apiUrl}insumos/${insumo.id}`, insumo);
        return data;
    } catch (error) {
        console.error("Error al actualizar el insumo:", error);
        throw new Error("No se pudo actualizar el insumo");
    }
};

export const useActualizarInsumo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: actualizarInsumo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["insumos"] });
        },
    });
};