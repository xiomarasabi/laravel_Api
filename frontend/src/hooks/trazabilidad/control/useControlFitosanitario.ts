import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export interface ControlFitosanitario {
  id_control_fitosanitario: number;
  fecha_control: string;
  descripcion: string;
  detalle: string;
  fk_id_desarrollan: number;
  desarrollan: Desarrollan;
}

export interface Desarrollan {
  id_desarrollan: number;
  cultivo: Cultivo;
  pea: Pea;
}

export interface Cultivo {
  id_cultivo: number;
  nombre_cultivo: string;
  fecha_plantacion: string;
  descripcion: string;
}

export interface Pea {
  id_pea: number;
  nombre: string;
  descripcion: string;
}

const fetchControlFitosanitario = async (): Promise<ControlFitosanitario[]> => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('Token no encontrado. Por favor inicia sesión.');
  }

  try {
    const { data } = await axios.get(`${apiUrl}controlfitosanitario/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Validar que data.controles existe y es un array
    if (!data.controles || !Array.isArray(data.controles)) {
      console.error('Formato de datos inesperado:', data);
      throw new Error('Los datos de controles fitosanitarios no tienen el formato esperado.');
    }

    // Depuración: Verificar si los controles incluyen el campo detalle
    console.log('Datos de control fitosanitario:', data.controles);
    data.controles.forEach((control: ControlFitosanitario, index: number) => {
      if (!control.detalle) {
        console.warn(`Control #${index} (ID: ${control.id_control_fitosanitario}) no tiene el campo detalle.`);
      }
    });

    return data.controles;
  } catch (error) {
    // Mejor manejo de errores
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
    gcTime: 1000 * 60 * 10, // 10 minutos
    retry: 2, // Reintentar 2 veces en caso de error
    staleTime: 1000 * 60 * 5, // Datos frescos por 5 minutos
  });
};