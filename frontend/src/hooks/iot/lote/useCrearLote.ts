import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:3000';

export interface Lote {
  id: number;
  dimension: string;
  nombre_lote: string;
  fk_id_ubicacion: number;
  estado: string;
}

interface BackendError {
  msg: string;
}

interface ApiResponse {
  msg: string;
  lote?: Lote;
}

export const useCrearLote = () => {
  const queryClient = useQueryClient();

  return useMutation<Lote, Error, Omit<Lote, 'id'>>({
    mutationFn: async (nuevoLote: Omit<Lote, 'id'>) => {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se ha encontrado un token de autenticación');
      }

      console.log('URL completa:', `${apiUrl}/lotes`);
      console.log('Datos enviados:', nuevoLote);

      try {
        const { data } = await axios.post<ApiResponse>(`${apiUrl}/lotes`, nuevoLote, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('Respuesta del backend:', data);

        return {
          ...nuevoLote,
          id: data.lote?.id || 0,
        };
      } catch (error) {
        const err = error as AxiosError<BackendError>;
        console.error('Error en la solicitud POST:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });
        throw new Error(err.response?.data?.msg || 'Error al crear el lote');
      }
    },
    onSuccess: () => {
      console.log('Lote creado, invalidando caché de lotes');
      queryClient.invalidateQueries({ queryKey: ['lotes'] });
    },
    onError: (error: Error) => {
      console.error('Error al crear el lote:', error.message);
    },
  });
};