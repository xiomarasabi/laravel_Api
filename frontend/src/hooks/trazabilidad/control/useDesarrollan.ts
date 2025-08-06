import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL.replace(/\/+$/, ''); // Quita slash final si existe

export interface Desarrollan {
  id: number;
  fk_id_pea: number;
  fk_id_cultivo: number;
  pea?: {
    id: number;
    nombre: string;
  };
  cultivo?: {
    id: number;
    nombre_cultivo: string;
  };
}

const fetchDesarrollan = async (): Promise<Desarrollan[]> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Token de autenticación no encontrado');

  const { data } = await axios.get(`${apiUrl}/desarrollan`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!Array.isArray(data)) {
    throw new Error('Respuesta inesperada del backend');
  }

  return data;
};

export const useDesarrollan = () => {
  return useQuery<Desarrollan[], Error>({
    queryKey: ['desarrollan'],
    queryFn: fetchDesarrollan,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 1,
    refetchOnWindowFocus: true,
  });
};
