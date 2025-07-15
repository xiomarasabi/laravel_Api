import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export interface Especie {
  id: number;
  nombre_comun: string;
  nombre_cientifico: string;
  descripcion: string;
  fk_id_tipo_cultivo: number;
}

export const useCrearEspecie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (nuevaEspecie: Especie) => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token no encontrado');

      const { data } = await axios.post(`${apiUrl}especies/`, nuevaEspecie, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['especies'] });
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || error.message || 'Error desconocido';
      console.error('❌ Error al crear especie:', msg);
      alert(`No se pudo crear la especie: ${msg}`);
    },
  });
};
