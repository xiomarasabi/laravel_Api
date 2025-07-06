import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export interface Ubicacion {
  id: number;
  latitud: number;
  longitud: number;
}

export interface Lotes {
  id: number;
  fk_id_ubicacion: Ubicacion;
  dimencion: string;
  nombre_lote: string;
  estado: string;
}

export interface TipoCultivo {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface Especie {
  id: number;
  nombre_comun: string;
  nombre_cientifico: string;
  descripcion: string;
  fk_id_tipo_cultivo: TipoCultivo | null;
}

export interface Semillero {
  id: number;
  nombre_semilla: string;
  fecha_siembra: string;
  fecha_estimada: string;
  cantidad: number;
}

export interface Cultivo {
  id: number;
  fecha_plantacion: string;
  nombre_cultivo: string;
  descripcion: string;
  fk_id_especie: Especie | null;
  fk_id_semillero: Semillero | null;
}

export interface Produccion {
  id: number;
  nombre_produccion: string;
  fk_id_cultivo: Number;
  cantidad_producida: number;
  fecha_produccion: string;
  fk_id_lote: number | null;
  descripcion_produccion: string;
  estado: string;
  fecha_cosecha: string;
  cultivo:Cultivo;
  lote:Lotes;
}

const fetchProduccion = async (): Promise<Produccion[]> => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No se ha encontrado un token de autenticación");
  }

  try {
    const { data } = await axios.get(`${apiUrl}produccion/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (Array.isArray(data)) {
      return data;
    } else {
      console.warn("⚠️ La estructura de la respuesta no es un array:", data);
      return [];
    }
  } catch (error: any) {
    console.error("❌ Error al obtener los datos de producción:", error?.response?.data || error.message);
    throw new Error("No se pudo obtener la lista de producción");
  }
};

export const useProduccion = () => {
  return useQuery<Produccion[], Error>({
    queryKey: ['produccion'],
    queryFn: fetchProduccion,
    staleTime: 1000 * 60 * 10,
  });
};
