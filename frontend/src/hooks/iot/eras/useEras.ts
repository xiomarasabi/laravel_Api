// src/hooks/iot/eras/useEras.ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export interface Eras {
  id: number;
  fk_id_lote: {
    id: number;
    dimension: number;
    nombre_lote: string;
    fk_id_ubicacion: {
      id: number;
      latitud: number;
      longitud: number;
    };
    estado: string;
  };
  descripcion: string;
  estado: string;
}

export const useEras = () => {
  return useQuery({
    queryKey: ['eras'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se ha encontrado un token de autenticación');
      }
      const { data } = await axios.get(`${apiUrl}eras/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('📋 Datos de las Eras obtenidos:', data);
      return data.eras;
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
};