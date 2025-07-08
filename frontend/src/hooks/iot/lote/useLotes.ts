import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface Ubicacion {
  id: number;
  latitud: number;
  longitud: number;
}

export interface Lote {
  id: number;
  dimension: string;
  nombre_lote: string;
  fk_id_ubicacion: Ubicacion | null;
  estado: string;
}



const fetchLotes = async (): Promise<Lote[]> => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No se encontró el token de autenticación');
        }

        const { data } = await axios.get(`${apiUrl}lotes/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log(data)
        return data;
    } catch (error) {
        console.error("Error al obtener herramientas:", error);
        throw new Error("No se pudo obtener la lista de las herramientas");
    }
};

export const useLotes = () => {
  return useQuery<Lote[], Error>({
    queryKey: ['lotes'],
    queryFn: fetchLotes,
    staleTime: 1000 * 60 * 10,
  });
};