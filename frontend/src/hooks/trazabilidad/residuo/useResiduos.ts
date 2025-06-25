import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

// Interfaces para los tipos de datos
export interface Residuos {
    id_residuo: number;
    nombre: string;
    fecha: string;
    descripcion: string;
    fk_id_cultivo: Cultivos;
    fk_id_tipo_residuo: TipoResiduos;
}

export interface Cultivos {
    id_cultivo: number;
    nombre_cultivo: string;
    fecha_plantacion: string;
    descripcion: string;
    fk_id_especie: Especie;
    fk_id_semillero: Semillero;
}

export interface Semillero {
    id_semillero: number;
    nombre_semilla: string;
    fecha_siembra: string;
    fecha_estimada: string;
    cantidad: number;
}

export interface TipoCultivo {
    id_tipo_cultivo: number;
    nombre: string;
    descripcion: string;
}

export interface Especie {
    id_especie: number;
    nombre_comun: string;
    nombre_cientifico: string;
    descripcion: string;
    fk_id_tipo_cultivo: TipoCultivo;
}

export interface TipoResiduos {
    id_tipo_residuo: number;
    nombre_residuo: string;
    descripcion: string;
}

// Función para obtener residuos con token
const fetchResiduos = async (): Promise<Residuos[]> => {
    const token = localStorage.getItem('token');
    console.log('API URL:', apiUrl); // Depuración
    console.log('Full URL:', `${apiUrl}/residuos`); // Depuración

    if (!token) {
        throw new Error('No hay token disponible. Por favor, inicia sesión.');
    }

    try {
        const response = await axios.get(`${apiUrl}residuos`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log('Respuesta de la API:', response.data);
        return response.data.residuos || [];
    } catch (error) {
        console.error('Error al obtener residuos:', error);
        throw new Error('No se pudo obtener la lista de residuos');
    }
};

// Hook de React Query
export const useResiduos = () => {
    return useQuery<Residuos[], Error>({
        queryKey: ['residuos'],
        queryFn: fetchResiduos,
        gcTime: 1000 * 60 * 10,
        retry: 2,
        staleTime: 1000 * 60 * 5,
    });
};