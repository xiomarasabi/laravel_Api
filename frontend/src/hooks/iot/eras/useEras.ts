// src/hooks/iot/eras/useEras.ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export interface Eras {
  id: number;
  fk_id_lote: {
    id: number;
    dimension: number;
    nombre_lote: string;
    fk_id_ubicacion: {
      id: number;
      latitud: number;
      longitud: number;
    };
    estado: string;
  };
  descripcion: string;
  estado: string;
}

const fetchEras = async (): Promise<Eras[]> => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No se encontró el token de autenticación');
        }

        const { data } = await axios.get(`${apiUrl}eras/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return data;
    } catch (error) {
        console.error("Error al obtener Eras:", error);
        throw new Error("No se pudo obtener la lista de las Eras");
    }
};

export const useEras = () => {
    return useQuery<Eras[], Error>({
        queryKey: ['Eras'],
        queryFn: fetchEras,
        gcTime: 1000 * 60 * 10,
    });
};