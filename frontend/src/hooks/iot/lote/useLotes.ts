import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/';

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
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No se encontró token de autenticación');
  }

  try {
    const { data } = await axios.get(`${apiUrl}lotes/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (Array.isArray(data)) {
      return data; // ✅ respuesta tipo: [ {...}, {...} ]
    } else if (data.lote && Array.isArray(data.lote)) {
      return data.lote; // ✅ respuesta tipo: { lote: [ {...}, {...} ] }
    } else {
      console.warn('⚠️ Estructura de respuesta inesperada:', data);
      throw new Error('La respuesta del servidor no contiene lotes válidos');
    }
  } catch (error) {
    const err = error as AxiosError<BackendError>;
    console.error('❌ Error al obtener los lotes:', err.response?.data || err.message);
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
