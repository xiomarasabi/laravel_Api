import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL.replace(/\/+$/, '') || 'http://localhost:3000';

export interface Ubicacion {
  id: number;
  nombre_ubicacion: string;
}

export const useUbicaciones = () => {
  return useQuery<Ubicacion[], Error>({
    queryKey: ['Ubicaciones'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No hay token disponible');
      const { data } = await axios.get(`${apiUrl}/ubicaciones`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
    gcTime: 1000 * 60 * 10,
    retry: 2,
    staleTime: 1000 * 60 * 5,
  });
};