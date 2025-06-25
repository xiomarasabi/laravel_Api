import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;


export interface Semilleros {
  id: number;
  nombre_semilla: string;
  fecha_siembra: string;
  fecha_estimada: string;
  cantidad: number;
}

const fetchSemilleros = async (): Promise<Semilleros[]> => {
  try {
    const token = localStorage.getItem('token'); // o donde guardes el JWT
    const { data } = await axios.get(`${apiUrl}semilleros/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data.map((item: any) => ({
      id: item.id_semillero,
      nombre_semilla: item.nombre_semilla,
      fecha_siembra: item.fecha_siembra,
      fecha_estimada: item.fecha_estimada,
      cantidad: item.cantidad,
    }));
  } catch (error) {
    console.error("Error al obtener los semilleros:", error);
    throw new Error("No se pudo obtener los semilleros");
  }
};


export const useSemilleros = () => {
  return useQuery<Semilleros[], Error>({
    queryKey: ['Semilleros'],
    queryFn: fetchSemilleros,
    gcTime: 1000 * 60 * 10, // El tiempo de garbage collection
  });
};
