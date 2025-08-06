import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL.replace(/\/+$/, '');

export interface CrearResiduoInput {
  nombre: string;
  fecha: string; // Formato YYYY-MM-DD
  descripcion: string;
  fk_id_cultivo: number;
  fk_id_tipo_residuo: number;
}

export const useCrearResiduo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (nuevoResiduo: CrearResiduoInput) => {
      const token = localStorage.getItem('token');
      console.log('API URL:', apiUrl);
      console.log('Full URL:', `${apiUrl}/residuos`);

      if (!apiUrl) {
        throw new Error('La variable de entorno VITE_API_URL no está definida.');
      }

      if (!token) {
        throw new Error('No hay token disponible. Por favor, inicia sesión.');
      }

      console.log('Enviando datos al backend:', nuevoResiduo);
      const response = await axios.post(`${apiUrl}/residuos`, nuevoResiduo, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Respuesta del servidor:', response.status, response.data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Residuos'] });
    },
    onError: (error: any) => {
      console.error('Error en la mutación:', error);
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        console.error('Detalles del error:', {
          status: error.response?.status,
          data: error.response?.data,
          message,
        });
        throw new Error(`Error al crear el residuo: ${message}`);
      }
      throw new Error('Error desconocido al crear el residuo');
    },
  });
};