import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export interface Eras {
  id: number;
  descripcion: string;
  estado: string;
  lote_nombre: string; 
}

export const useEraPorId = (id: string | undefined) => {
  return useQuery({
    queryKey: ['eras', id],
    queryFn: async () => {
      if (!id || id === 'undefined') {
        throw new Error('ID no proporcionado o inválido');
      }
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se ha encontrado un token de autenticación');
      }
      const { data } = await axios.get(`${apiUrl}eras/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('📋 Datos de la Era obtenidos:', data);
      return {
        id: data.id,
        descripcion: data.descripcion,
        estado: data.estado,
        lote_nombre: data.lote_nombre,
      } as Eras;
    },
    enabled: !!id && id !== 'undefined',
  });
};