import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:3000';

export interface Lote {
  id: number;
  dimension: string;
  nombre_lote: string;
  nombre_ubicacion: string; // Cambiado de fk_id_ubicacion a nombre_ubicacion
  estado: string;
}

export const useLotePorId = (id: string | undefined) => {
  return useQuery<Lote, Error>({
    queryKey: ['lote', id],
    queryFn: async () => {
      if (!id || id === 'undefined') {
        console.error('❌ Error: ID no proporcionado o inválido');
        throw new Error('ID no proporcionado o inválido');
      }

      const token = localStorage.getItem('token');
      if (!token) {
        console.error('❌ Error: No se ha encontrado un token de autenticación');
        throw new Error('No se ha encontrado un token de autenticación');
      }

      const url = `${apiUrl}/lotes/${id}`;
      console.log('📋 Enviando solicitud GET a:', url);

      try {
        new URL(url);
      } catch (e) {
        console.error('❌ Error: URL inválida:', url);
        throw new Error(`URL inválida: ${url}`);
      }

      try {
        const { data } = await axios.get<Lote>(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('📋 Datos del lote obtenidos:', data);

        return {
          id: data.id,
          dimension: data.dimension,
          nombre_lote: data.nombre_lote,
          nombre_ubicacion: data.nombre_ubicacion,
          estado: data.estado,
        };
      } catch (error) {
        const err = error as AxiosError<{ msg: string }>;
        console.error('❌ Error en la solicitud GET:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });
        throw new Error(err.response?.data?.msg || 'Error al obtener el lote');
      }
    },
    enabled: !!id && id !== 'undefined',
    retry: false,
  });
};