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
  id_tipo_cultivo: number;
  nombre: string;
  descripcion: string;
}

export interface Especie {
  id_especie: number;
  nombre_comun: string;
  nombre_cientifico: string;
  descripcion: string;
  fk_id_tipo_cultivo: TipoCultivo | null;
}

export interface Semillero {
  id_semillero: number;
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
  cultivo: any;
  id_produccion: number;
  nombre_produccion: string;
  fk_id_cultivo: Cultivo | null;
  cantidad_producida: number;
  fecha_produccion: string;
  fk_id_lote: number | null;
  descripcion_produccion: string;
  estado: string;
  fecha_cosecha: string;
}


const fetchProduccion = async (): Promise<Produccion[]> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token de autenticación no encontrado");

  try {
    const { data } = await axios.get(`${apiUrl}produccion/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // La API devuelve {producciones: Array(...)}, así que accedemos a data.producciones
    if (data && data.producciones && Array.isArray(data.producciones)) {
      return data.producciones;
    } else {
      console.warn("⚠️ La estructura de la respuesta no es la esperada:", data);
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