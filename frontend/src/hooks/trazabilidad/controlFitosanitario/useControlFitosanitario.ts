import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

// Definición de interfaces para reflejar la estructura del backend
export interface ControlFitosanitario {
  id_control_fitosanitario: number;
  fecha_control: string;
  descripcion: string;
  fk_id_desarrollan: number;
  desarrollan: Desarrollan;
  detalle: string;
}

export interface Desarrollan {
  id_desarrollan: number;
  cultivo: Cultivo | null;
  pea: Pea | null;
}

export interface Cultivo {
  id_cultivo: number;
  fecha_plantacion: string;
  nombre_cultivo: string;
  descripcion: string;
  especie: Especie | null;
  semillero: Semillero | null;
}

export interface Especie {
  id_especie: number;
  nombre_comun: string;
  nombre_cientifico: string;
  descripcion: string;
  tipo_cultivo: TipoCultivo | null;
}

export interface TipoCultivo {
  id_tipo_cultivo: number;
  nombre: string;
  descripcion: string;
}

export interface Semillero {
  id_semillero: number;
  nombre_semilla: string;
  fecha_siembra: string;
  fecha_estimada: string;
  cantidad: number;
}

export interface Pea {
  id_pea: number;
  nombre: string;
  descripcion: string;
}

const fetchControlFitosanitario = async (): Promise<ControlFitosanitario[]> => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('No hay token disponible. Por favor inicia sesión.');
  }

  try {
    const { data } = await axios.get(`${apiUrl}/controlfitosanitario`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Datos de control fitosanitario:', data);
    return data.controles || [];
  } catch (error: any) {
    console.error('Error al obtener Control Fitosanitario:', error);
    if (error.response?.status === 401) {
      throw new Error('Sesión no autorizada. Por favor inicia sesión nuevamente.');
    }
    throw new Error('No se pudo obtener la lista de los Controles Fitosanitarios');
  }
};

export const useControlFitosanitario = () => {
  return useQuery<ControlFitosanitario[], Error>({
    queryKey: ['ControlFitosanitario'],
    queryFn: fetchControlFitosanitario,
    gcTime: 1000 * 60 * 10,
  });
};