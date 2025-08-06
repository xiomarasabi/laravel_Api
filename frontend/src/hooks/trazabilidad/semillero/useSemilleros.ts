import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export interface Semillero {
  id: number;
  nombre_semilla: string;
  fecha_siembra: string;
  fecha_estimada: string;
  cantidad: number;
}

const fetchSemilleros = async (): Promise<Semillero[]> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Token de autenticación no encontrado');

  const { data } = await axios.get(`${apiUrl}semilleros`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};

export const useSemilleros = () => {
  return useQuery<Semillero[], Error>({
    queryKey: ['semilleros'],
    queryFn: fetchSemilleros,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};
