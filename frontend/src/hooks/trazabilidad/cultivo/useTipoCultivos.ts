// useTipoCultivos.ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL.replace(/\/+$/, '') || 'http://localhost:8000/api';

export interface TipoCultivo {
  id: number;
  nombre: string;
  descripcion?: string;
}

export const useTipoCultivos = () => {
  return useQuery<TipoCultivo[], Error>({
    queryKey: ['TipoCultivos'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No hay token disponible');
      const { data } = await axios.get(`${apiUrl}/tipo_cultivos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
    gcTime: 1000 * 60 * 10,
    retry: 2,
    staleTime: 1000 * 60 * 5,
  });
};