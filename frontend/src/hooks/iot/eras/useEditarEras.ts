// src/hooks/iot/eras/useEditarEras.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export interface Eras {
  id: number;
  fk_id_lote: number;
  descripcion: string;
  estado: string;
}

export const useEditarEras = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eraActualizada: Eras) => {
      const { id, ...datos } = eraActualizada;

      if (!datos.fk_id_lote || !datos.descripcion.trim() || !['Activo', 'Inactivo'].includes(datos.estado)) {
        throw new Error('⚠️ Datos inválidos. Por favor, revisa los campos.');
      }

      console.log('📝 Enviando datos para actualizar:', datos);

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se ha encontrado un token de autenticación');
        }
        const { data } = await axios.put(`${apiUrl}eras/${id}/`, datos, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        return data;
      } catch (error: any) {
        console.error('❌ Error en la solicitud:', error.response?.data || error.message);
        throw new Error(error.response?.data?.msg || 'Error al actualizar la era');
      }
    },
    onSuccess: () => {
      console.log('✅ Era actualizada con éxito');
      queryClient.invalidateQueries({ queryKey: ['eras'] });
    },
    onError: (error) => {
      console.error('❌ Error al actualizar la Era:', error.message);
    },
  });
};