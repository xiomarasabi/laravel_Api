// src/hooks/iot/eras/useEraPorId.ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export interface Eras {
  id: number;
  fk_id_lote: number;
  descripcion: string;
  estado: string;
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
        id: data.era.id,
        descripcion: data.era.descripcion,
        estado: data.era.estado,
        fk_id_lote: data.era.fk_id_lote.id,
      } as Eras;
    },
    enabled: !!id && id !== 'undefined',
  });
};