import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface Herramientas {
    id_herramienta: number;
    nombre_h: string;
    fecha_prestamo: string ;
    estado: string;
}

export const useActualizarHerramientas = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (herramientaActualizada: Partial<Herramientas> & { id_herramienta: number }) => {
            const { id_herramienta, ...datos } = herramientaActualizada;
            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error('No se encontró el token de autenticación');
            }

            const formattedDatos = {
                ...datos,
                fecha_prestamo: datos.fecha_prestamo instanceof Date
                    ? datos.fecha_prestamo.toISOString().split('T')[0]
                    : datos.fecha_prestamo,
            };

            const { data } = await axios.put(`${apiUrl}herramientas/${id_herramienta}`, formattedDatos, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(data)
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Herramientas"] });
        },
    });
};