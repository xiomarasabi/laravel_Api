import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL; // Ejemplo: http://localhost:3000/

export interface Sensor {
  id_sensor: number;
  nombre_sensor: string;
  tipo_sensor: string;
  unidad_medida: string;
  descripcion: string;
  medida_minima: number;
  medida_maxima: number;
  evapotranspiracion?: number;
  temperatura?: number;
  humedad?: number;
  luminiosidad?: number;
}

const fetchSensores = async (): Promise<Sensor[]> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No se ha encontrado un token de autenticación');
    }
    const { data } = await axios.get(`${apiUrl}sensores`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log('Respuesta sensores:', data);

    return Array.isArray(data.sensores) ? data.sensores : [];
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