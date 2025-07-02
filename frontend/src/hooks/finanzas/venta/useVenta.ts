import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

// Interfaces necesarias para Venta
export interface TipoCultivo {
  id_tipo_cultivo: number;
  nombre: string;
}

export interface Especie {
  id_especie: number;
  nombre_comun: string;
  nombre_cientifico: string;
  fk_id_tipo_cultivo: TipoCultivo;
}

export interface Cultivo {
  id_cultivo: number;
  fecha_plantacion: string;
  nombre_cultivo: string;
  descripcion: string;
  fk_id_especie: Especie;
}

export interface Ubicacion {
  id_ubicacion: number;
  latitud: string;
  longitud: string;
}

export interface Lote {
  id_lote: number;
  dimension: number;
  nombre_lote: string;
  fk_id_ubicacion: Ubicacion;
}

export interface Produccion {
  id: number;
  fk_id_cultivo: number;
  cantidad_producida: number;
  fecha_produccion: string;
  fk_id_lote: number;
  lote: Lote;
  cultivo: Cultivo;
}

export interface Venta {
  id: number;
  fk_id_produccion: number;
  cantidad: number;
  precio_unitario: number;
  fecha_venta: string;
  produccion?: Produccion; 
}


const fetchVentas = async (): Promise<Venta[]> => {
  try {
    const token = localStorage.getItem("token");

    const { data } = await axios.get(`${apiUrl}ventas/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  } catch (error) {
    console.error("Error al obtener los datos de venta:", error);
    throw new Error("No se pudo obtener la lista de ventas");
  }
};



export const useVenta = () => {
  return useQuery<Venta[], Error>({
    queryKey: ['ventas'],
    queryFn: fetchVentas,
    staleTime: 1000 * 60 * 10,
  });
};