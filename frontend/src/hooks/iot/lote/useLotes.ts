import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

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

interface BackendError {
  msg: string;
}

const fetchLotes = async (): Promise<Lote[]> => {
  try {
    const { data } = await axios.get(`${apiUrl}lotes`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      },
    });

    if (data.lote && Array.isArray(data.lote)) {
      return data.lote;
    }
    throw new Error('No se pudo obtener la lista de lotes');
  } catch (error) {
    const err = error as AxiosError<BackendError>;
    console.error('Error al obtener los lotes:', err, err.response);
    throw new Error(err.response?.data?.msg || 'Error al conectar con el servidor');
  }
};

export const useLotes = () => {
  return useQuery<Lote[], Error>({
    queryKey: ['lotes'],
    queryFn: fetchLotes,
    staleTime: 1000 * 60 * 10,
  });
};