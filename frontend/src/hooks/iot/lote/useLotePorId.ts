import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:3000';

export interface Ubicacion {
  id: number;
  latitud: string;
  longitud: string;
}

export interface Lote {
  id: number;
  dimension: string;
  nombre_lote: string;
  fk_id_ubicacion: number;
  estado: string;
}

interface ApiResponse {
  msg: string;
  lote: {
    id: number;
    dimension: string;
    nombre_lote: string;
    fk_id_ubicacion: {
      id: number;
      latitud: string;
      longitud: string;
    };
    estado: string;
  };
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

      // Asegurar la barra correcta en la URL
      const url = `${apiUrl}/lotes/${id}`;
      console.log('📋 Enviando solicitud GET a:', url);

      try {
        new URL(url);
      } catch (e) {
        console.error('❌ Error: URL inválida:', url);
        throw new Error(`URL inválida: ${url}`);
      }

      try {
        const { data } = await axios.get<ApiResponse>(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('📋 Datos del lote obtenidos:', data);

        if (!data.lote) {
          throw new Error('Lote no encontrado');
        }

        return {
          id: data.lote.id,
          dimension: data.lote.dimension,
          nombre_lote: data.lote.nombre_lote,
          fk_id_ubicacion: data.lote.fk_id_ubicacion.id,
          estado: data.lote.estado,
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