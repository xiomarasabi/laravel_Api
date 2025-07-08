import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:8000/api';

export interface Ubicacion {
  id: number;
  latitud: number;
  longitud: number;
}

const fetchUbicaciones = async (): Promise<Ubicacion[]> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No se encontró un token de autenticación');
  }

  const { data } = await axios.get(`${apiUrl}/ubicaciones`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data.result?.map((item: { id_ubicacion: number; latitud: string; longitud: string }) => ({
    id: item.id_ubicacion,
    latitud: parseFloat(item.latitud),
    longitud: parseFloat(item.longitud),
  })) || [];
};

export const useUbicaciones = () => {
  return useQuery({
    queryKey: ['ubicaciones'],
    queryFn: fetchUbicaciones,
    onError: (error: any) => {
      console.error('Error al obtener ubicaciones:', error.message);
    },
  });
};