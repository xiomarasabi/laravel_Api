import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export interface Sensor {
  id: number;
  nombre_sensor: string;
  tipo_sensor: string;
  unidad_medida: string;
  descripcion: string | null;
  medida_minima: number;
  medida_maxima: number;
  created_at?: string;
  updated_at?: string;
}

const fetchSensores = async (): Promise<Sensor[]> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No se encontró el token de autenticación');
    }

    const { data } = await axios.get(`${apiUrl}sensores`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Respuesta sensores:', data);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error al obtener sensores:', error);
    throw new Error('No se pudo obtener la lista de sensores');
  }
};

export const useSensores = () => {
  return useQuery<Sensor[], Error>({
    queryKey: ['sensores'],
    queryFn: fetchSensores,
    staleTime: 1000 * 60 * 10, // 10 minutos
    retry: 1,
    refetchOnWindowFocus: false,
  });
};