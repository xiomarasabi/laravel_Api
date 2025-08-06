import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL.replace(/\/+$/, '');

export interface Residuo {
  id: number;
  nombre: string;
  fecha: string;
  descripcion: string;
  fk_id_tipo_residuo: number;
  fk_id_cultivo: number;
  tipo_residuo: TipoResiduo;
  cultivo: Cultivo;
}

export interface Cultivo {
  id: number;
  nombre_cultivo: string;
  fecha_plantacion: string;
  descripcion: string;
}

export interface TipoResiduo {
  id: number;
  nombre_residuo: string;
}

const fetchResiduos = async (): Promise<Residuo[]> => {
  const token = localStorage.getItem('token');
  console.log('API URL:', apiUrl);
  console.log('Full URL:', `${apiUrl}/residuos`);

  if (!token) {
    throw new Error('No hay token disponible. Por favor, inicia sesión.');
  }

  try {
    const response = await axios.get(`${apiUrl}/residuos`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Respuesta cruda de residuos:', response);

    if (!response.data || !Array.isArray(response.data)) {
      console.error('Formato de datos inesperado:', response.data);
      throw new Error('Los datos de residuos no tienen el formato esperado.');
    }

    const mappedData = response.data.map((residuo: any) => {
      console.log('Datos del residuo antes de mapear:', residuo);
      return {
        id: residuo.id,
        nombre: residuo.nombre || 'Sin nombre',
        fecha: residuo.fecha || 'Sin fecha',
        descripcion: residuo.descripcion || 'Sin descripción',
        fk_id_tipo_residuo: residuo.fk_id_tipo_residuo || null,
        fk_id_cultivo: residuo.fk_id_cultivo || null,
        tipo_residuo: {
          id: residuo.tipo_residuo?.id || null,
          nombre_residuo: residuo.tipo_residuo?.nombre_residuo || 'Sin tipo',
        },
        cultivo: {
          id: residuo.cultivo?.id || null,
          nombre_cultivo: residuo.cultivo?.nombre_cultivo || 'Sin cultivo',
          fecha_plantacion: residuo.cultivo?.fecha_plantacion || 'Sin fecha',
          descripcion: residuo.cultivo?.descripcion || 'Sin descripción',
        },
      };
    });

    console.log('Datos mapeados de residuos:', mappedData);
    return mappedData;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message;
      console.error('Error al obtener residuos:', {
        status: error.response?.status,
        data: error.response?.data,
        message,
        url: error.config?.url,
      });
      throw new Error(`No se pudo obtener la lista de residuos: ${message}`);
    }
    console.error('Error desconocido:', error);
    throw new Error('Error desconocido al obtener residuos');
  }
};

export const useResiduos = () => {
  return useQuery<Residuo[], Error>({
    queryKey: ['Residuos'],
    queryFn: fetchResiduos,
    gcTime: 1000 * 60 * 10,
    retry: 2,
    staleTime: 1000 * 60 * 5,
  });
};