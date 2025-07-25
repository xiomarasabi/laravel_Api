import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL.replace(/\/+$/, '');

export interface ActualizarResiduoInput {
  nombre?: string;
  fecha?: string;
  descripcion?: string | null;
  fk_id_cultivo?: number;
  fk_id_tipo_residuo?: number;
}

export const useActualizarResiduo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...residuo }: { id: number } & ActualizarResiduoInput) => {
      const token = localStorage.getItem('token');

      if (!apiUrl) {
        throw new Error('La variable de entorno VITE_API_URL no está definida.');
      }

      if (!token) {
        throw new Error('No hay token disponible. Por favor, inicia sesión.');
      }

      console.log('Enviando al backend:', { id, ...residuo });
      const { data } = await axios.put(`${apiUrl}/residuos/${id}`, residuo, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('Respuesta del backend:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Residuos'], exact: true });
      console.log('Query de residuos invalidada');
    },
    onError: (error: any) => {
      console.error('Error en la mutación:', error);
      console.error('Detalles del error:', error.response?.data);
    },
  });
};