import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export interface Insumo {
    nombre: string;
    tipo: string ;
    precio_unidad: number;
    cantidad: number;
    unidad_medida: string;
}

export const useCrearInsumos = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (nuevoHerramienta: Insumo) => {
            const token = localStorage.getItem("token");
            console.log(token);
            console.log(nuevoHerramienta)
            if (!token) {
                throw new Error("No se ha encontrado un token de autenticación");
            }
            const data  = await axios.post(
                `${apiUrl}insumo/`,
                nuevoHerramienta,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["herramientas"] });
        },
        onError: (error: any) => {
            console.error("Error al crear el herramienta:", error.message);
        },
    });
};
