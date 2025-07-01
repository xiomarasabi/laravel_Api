import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

// Definición de interfaces
export interface Cultivos {
  id: number;
  fecha_plantacion: string;
  nombre_cultivo: string;
  descripcion: string | null;
  fk_id_especie: { id: number; nombre_comun: string } | null;
  fk_id_semillero: { id: number; nombre_semilla: string } | null;
}

const fetchCultivos = async (): Promise<Cultivos[]> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No se encontró el token de autenticación');
    }

    const response = await axios.get(`${apiUrl}cultivos`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const cultivos = response.data.map((cultivo: any) => ({
      id: cultivo.id,
      fecha_plantacion: cultivo.fecha_plantacion,
      nombre_cultivo: cultivo.nombre_cultivo,
      descripcion: cultivo.descripcion || null,
      fk_id_especie: cultivo.especie
        ? { id: cultivo.especie.id, nombre_comun: cultivo.especie.nombre_comun }
        : null,
      fk_id_semillero: cultivo.semillero
        ? { id: cultivo.semillero.id, nombre_semilla: cultivo.semillero.nombre_semilla }
        : null,
    }));

    return cultivos;
  } catch (error: any) {
    console.error('Error al obtener cultivos:', error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('No autorizado: Token inválido o ausente');
      } else if (error.response?.status === 404) {
        throw new Error('No hay cultivos registrados');
      }
    }
    throw new Error('No se pudo obtener la lista de cultivos');
  }
};

export const useCultivo = () => {
  return useQuery<Cultivos[], Error>({
    queryKey: ['Cultivo'],
    queryFn: fetchCultivos,
    gcTime: 1000 * 60 * 10, // 10 minutos
    retry: 1,
  });
};