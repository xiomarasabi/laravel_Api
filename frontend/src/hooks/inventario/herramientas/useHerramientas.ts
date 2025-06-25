import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export interface Herramientas {
    id_herramienta: number;
    nombre_h: string;
    fecha_prestamo: string;
    estado: string;
}

const fetchHerramientas = async (): Promise<Herramientas[]> => {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No se encontró el token de autenticación');
        }

        const { data } = await axios.get(`${apiUrl}herramientas/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return data;
    } catch (error) {
        console.error("Error al obtener herramientas:", error);
        throw new Error("No se pudo obtener la lista de las herramientas");
    }
};

export const useHerramientas = () => {
    return useQuery<Herramientas[], Error>({
        queryKey: ['Herramientas'],
        queryFn: fetchHerramientas,
        gcTime: 1000 * 60 * 10,
    });
};