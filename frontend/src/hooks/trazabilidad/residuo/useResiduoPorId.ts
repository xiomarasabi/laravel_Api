import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL.replace(/\/+$/, '');

export interface Residuo {
  id: number;
  nombre: string;
  fecha: string;
  descripcion: string | null;
  fk_id_cultivo: number;
  fk_id_tipo_residuo: number;
  tipo_residuo: {
    id: number;
    nombre_residuo: string;
    descripcion: string | null;
  };
  cultivo: {
    id: number;
    nombre_cultivo: string;
    fecha_plantacion: string;
    descripcion: string | null;
  };
}

export const useResiduoPorId = (id: string | undefined) => {
  return useQuery<Residuo, Error>({
    queryKey: ['Residuo', id],
    queryFn: async () => {
      if (!id) throw new Error('ID no proporcionado');

      const token = localStorage.getItem('token');
      if (!token) throw new Error('No hay token disponible. Por favor, inicia sesión.');

      const { data } = await axios.get(`${apiUrl}/residuos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!data || !data.residuo) {
        throw new Error('Residuo no encontrado o formato de datos inválido.');
      }

      const residuo = data.residuo;
      console.log('📋 Datos del Residuo obtenidos:', residuo);
      return {
        id: residuo.id,
        nombre: residuo.nombre,
        fecha: residuo.fecha,
        descripcion: residuo.descripcion || null,
        fk_id_cultivo: residuo.fk_id_cultivo,
        fk_id_tipo_residuo: residuo.fk_id_tipo_residuo,
        tipo_residuo: {
          id: residuo.tipo_residuo.id,
          nombre_residuo: residuo.tipo_residuo.nombre_residuo,
          descripcion: residuo.tipo_residuo.descripcion || null,
        },
        cultivo: {
          id: residuo.cultivo.id,
          nombre_cultivo: residuo.cultivo.nombre_cultivo,
          fecha_plantacion: residuo.cultivo.fecha_plantacion,
          descripcion: residuo.cultivo.descripcion || null,
        },
      };
    },
    enabled: !!id,
    retry: 2,
    staleTime: 1000 * 60 * 5,
  });
};