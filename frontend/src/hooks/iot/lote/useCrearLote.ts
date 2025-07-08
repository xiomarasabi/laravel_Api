import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:3000';

export interface Lote {
  id: number;
  dimension: string;
  nombre_lote: string;
  fk_id_ubicacion: number;
  estado: string;
}



export const useCrearLote = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (nuevoHerramienta: Lote) => {
            const token = localStorage.getItem("token");
            console.log(token);
            console.log(nuevoHerramienta)
            if (!token) {
                throw new Error("No se ha encontrado un token de autenticación");
            }
            const data  = await axios.post(
                `${apiUrl}lotes/`,
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
            queryClient.invalidateQueries({ queryKey: ["Lote"] });
        },
        onError: (error: any) => {
            console.error("Error al crear el herramienta:", error.message);
        },
    });
};
