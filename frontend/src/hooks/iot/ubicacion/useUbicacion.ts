// /src/hooks/iot/ubicacion/useUbicacion.ts
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface Ubicacion {
  id: number;
  latitud: number;
  longitud: number;
}

interface BackendError {
  msg: string;
}

interface ApiResponse {
  msg: string;
  result?: { id_ubicacion: number; latitud: string; longitud: string }[];
}

const fetchUbicaciones = async (): Promise<Ubicacion[]> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No se encontró un token de autenticación.');
      return [];
    }

    console.log('Realizando solicitud a:', `${apiUrl}ubicacion`);
    const { data } = await axios.get<ApiResponse>(`${apiUrl}ubicacion`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Respuesta cruda de la API de ubicaciones:', data);

    let ubicaciones: Ubicacion[] = [];
    if (data.result && Array.isArray(data.result)) {
      ubicaciones = data.result.map((item) => ({
        id: item.id_ubicacion,
        latitud: parseFloat(item.latitud),
        longitud: parseFloat(item.longitud),
      })).filter((item): item is Ubicacion =>
        typeof item.id === 'number' &&
        !isNaN(item.latitud) &&
        !isNaN(item.longitud)
      );
    }

    if (ubicaciones.length === 0) {
      console.warn('No se encontraron ubicaciones en la respuesta:', data.msg || 'Sin mensaje');
    }
    console.log('Ubicaciones procesadas:', ubicaciones);
    return ubicaciones;
  } catch (error) {
    const err = error as AxiosError<BackendError>;
    console.error('Error al obtener ubicaciones:', {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
    });
    if (err.response?.status === 404) {
      console.error('Error 404: Verifica que el endpoint /ubicacion esté registrado en el backend.');
    }
    return [];
  }
};

export const useUbicaciones = () => {
  return useQuery<Ubicacion[], Error>({
    queryKey: ['ubicaciones'],
    queryFn: fetchUbicaciones,
    staleTime: 1000 * 60 * 10, // 10 minutos
    retry: 2,
    retryDelay: 1000,
  });
};