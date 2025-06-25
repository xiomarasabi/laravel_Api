// src/hooks/trazabilidad/cultivo/useCultivo.ts

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

// Definición de interfaces
export interface Cultivos {
  id_cultivo: number;
  fecha_plantacion: string; // Formato ISO (YYYY-MM-DD) para coincidir con el backend
  nombre_cultivo: string;
  descripcion: string;
  fk_id_especie: Especie | null;
  fk_id_semillero: Semillero | null;
}

export interface Semillero {
  id_semillero: number;
  nombre_semilla: string; // Corregido de nombre_semillero
  fecha_siembra: string;
  fecha_estimada: string;
  cantidad: number;
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

const fetchCultivos = async (): Promise<Cultivos[]> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No se encontró el token de autenticación');
    }

    const response = await axios.get(`${apiUrl}cultivo`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const cultivos = response.data.cultivos.map((cultivo: any) => ({
      id_cultivo: cultivo.id_cultivo,
      fecha_plantacion: cultivo.fecha_plantacion,
      nombre_cultivo: cultivo.nombre_cultivo,
      descripcion: cultivo.descripcion,
      fk_id_especie: cultivo.fk_id_especie
        ? {
            id_especie: cultivo.fk_id_especie.id_especie,
            nombre_comun: cultivo.fk_id_especie.nombre_comun,
            nombre_cientifico: cultivo.fk_id_especie.nombre_cientifico,
            descripcion: cultivo.fk_id_especie.descripcion,
            fk_id_tipo_cultivo: cultivo.fk_id_especie.fk_id_tipo_cultivo
              ? {
                  id_tipo_cultivo: cultivo.fk_id_especie.fk_id_tipo_cultivo.id_tipo_cultivo,
                  nombre: cultivo.fk_id_especie.fk_id_tipo_cultivo.nombre,
                  descripcion: cultivo.fk_id_especie.fk_id_tipo_cultivo.descripcion,
                }
              : null,
          }
        : null,
      fk_id_semillero: cultivo.fk_id_semillero
        ? {
            id_semillero: cultivo.fk_id_semillero.id_semillero,
            nombre_semilla: cultivo.fk_id_semillero.nombre_semilla,
            fecha_siembra: cultivo.fk_id_semillero.fecha_siembra,
            fecha_estimada: cultivo.fk_id_semillero.fecha_estimada,
            cantidad: cultivo.fk_id_semillero.cantidad,
          }
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