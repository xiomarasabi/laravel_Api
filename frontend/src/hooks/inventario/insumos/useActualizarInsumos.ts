import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface Insumo {
    id_insumo: number;
    nombre: string;
    tipo: string;
    precio_unidad: number;
    cantidad: number;
    unidad_medida: string;
}

const actualizarInsumo = async (insumo: Insumo) => {
    try {
        const token = localStorage.getItem("token"); // Ejemplo: obtener token de localStorage
        if (!token) {
            throw new Error("No se encontró un token de autenticación");
        }

        const { data } = await axios.put(`${apiUrl}insumo/${insumo.id_insumo}`, insumo, {
            headers: {
                Authorization: `Bearer ${token}`, // Agregar token en el encabezado
            },
        });
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