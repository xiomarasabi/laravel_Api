import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export interface Insumo {
    id: number;
    nombre: string;
    tipo: string;
    precio_unidad: number;
    cantidad: number;
    fecha_vencimiento: string | Date
    unidad_medida: string;
}

// Función para obtener los insumos con manejo de errores y token
const fetchInsumo = async (): Promise<Insumo[]> => {
    try {
        // Retrieve token from localStorage
        // const token = localStorage.getItem('token'); 

        //if (!token) {
        //    throw new Error('No se encontró el token de autenticación');
        //}

        const { data } = await axios.get(`${apiUrl}insumos/`, {
            //headers: {
            //    Authorization: `Bearer ${token}`, 
            //},
        });
        return data;
    } catch (error) {
        console.error("Error al obtener el insumo:", error);
        throw new Error("No se pudo obtener la lista de insumo");
    }
};

export const useInsumo = () => {
    return useQuery<Insumo[], Error>({
        queryKey: ['Insumo'],
        queryFn: fetchInsumo,
        gcTime: 1000 * 60 * 10, // 10 minutes
    });
};