import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface Pea {
    nombre: string;
    descripcion: string;
}

// Hook personalizado para crear un nuevo PEA
export const useCrearPea = () => {
    const queryClient = useQueryClient();

    const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No se encontró el token de autenticación');
        }



    return useMutation({
        mutationFn: async (nuevoPea: Pea) => {
            console.log("Datos enviados al backend:", nuevoPea);
            const { data } = await axios.post(`${apiUrl}pea/`, nuevoPea, {
                headers: {
                Authorization: `Bearer ${token}`,    
            },
            });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Pea"] }); 
        },
    });
};
