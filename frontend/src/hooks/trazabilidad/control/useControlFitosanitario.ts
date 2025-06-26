import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL.replace(/\/+$/, ''); // Elimina barras finales

export interface ControlFitosanitario {
  id: number;
  fecha_control: string;
  descripcion: string;
  fk_id_desarrollan: number;
  desarrollan: Desarrollan;
}

export interface Desarrollan {
  id: number;
  cultivo: Cultivo;
  pea: Pea;
}

export interface Cultivo {
  id: number;
  nombre_cultivo: string;
  fecha_plantacion: string;
  descripcion: string;
}

export interface Pea {
  id: number;
  nombre: string;
  descripcion: string;
}

const fetchControlFitosanitario = async (): Promise<ControlFitosanitario[]> => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('Token no encontrado. Por favor inicia sesión.');
  }

  try {
    const { data } = await axios.get(`${apiUrl}/control_fitosanitario`, {
      headers: {
         Authorization: `Bearer ${token}`,
      },
    });

    if (!data || !Array.isArray(data)) {
      console.error('Formato de datos inesperado:', data);
      throw new Error('Los datos de controles fitosanitarios no tienen el formato esperado.');
    }

    console.log('Datos de control fitosanitario:', data);
    return data.map(control => ({
      id: control.id,
      fecha_control: control.fecha_control,
      descripcion: control.descripcion,
      fk_id_desarrollan: control.fk_id_desarrollan,
      desarrollan: {
        id: control.desarrollan.id,
        cultivo: {
          id: control.desarrollan.cultivo.id,
          nombre_cultivo: control.desarrollan.cultivo.nombre_cultivo,
          fecha_plantacion: control.desarrollan.cultivo.fecha_plantacion,
          descripcion: control.desarrollan.cultivo.descripcion,
        },
        pea: {
          id: control.desarrollan.pea.id,
          nombre: control.desarrollan.pea.nombre,
          descripcion: control.desarrollan.pea.descripcion,
        },
      },
    }));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message;
      console.error('Error al obtener Control Fitosanitario:', {
        status: error.response?.status,
        message,
      });
      throw new Error(`No se pudo obtener la lista de Controles Fitosanitarios: ${message}`);
    }
    console.error('Error desconocido:', error);
    throw new Error('Error desconocido al obtener Controles Fitosanitarios');
  }
};

export const useControlFitosanitario = () => {
  return useQuery<ControlFitosanitario[], Error>({
    queryKey: ['ControlFitosanitario'],
    queryFn: fetchControlFitosanitario,
    gcTime: 1000 * 60 * 10,
    retry: 2,
    staleTime: 1000 * 60 * 5,
  });
};