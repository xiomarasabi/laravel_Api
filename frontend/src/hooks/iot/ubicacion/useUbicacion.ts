import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export interface Ubicacion {
  id: number;
  latitud: string;
  longitud: string;
}

const fetchUbicaciones = async (): Promise<Ubicacion[]> => {
  try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró un token de autenticación');
      }
    
      const { data } = await axios.get(`${apiUrl}ubicaciones/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (error){
        console.error("Error al obtener ubicaciones:", error);
          throw new Error("No se pudo obtener ubicaciones");
    }
  };

export const useUbicaciones = () => {
    return useQuery<Ubicacion[], Error>({
        queryKey: ['ubicaciones'],
        queryFn: fetchUbicaciones,
        gcTime: 1000 * 60 * 10,
    });
};