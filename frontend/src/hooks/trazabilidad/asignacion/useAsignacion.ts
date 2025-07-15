import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '');

export interface Asignacion {
  id_asignacion_actividad: number;
  fecha: string;
  fk_id_actividad: number;
  fk_identificacion: number;
  created_at?: string | null;
  updated_at?: string | null;
  actividad?: {
    id_actividad: number;
    nombre_actividad: string;
    descripcion: string | null;
    created_at?: string | null;
    updated_at?: string | null;
  } | null;
  user?: {
    identificacion: number;
    nombre: string;
    email: string;
    telefono?: string | null;
    fk_id_rol?: {
      id_rol: number;
      nombre_rol: string;
      fecha_creacion?: string | null;
    } | null;
    created_at?: string | null;
    updated_at?: string | null;
  } | null;
}

export const useAsignacion = () => {
  return useQuery<Asignacion[], Error>({
    queryKey: ['asignaciones'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('❌ Error: Token de autenticación no encontrado');
        throw new Error('Token de autenticación no encontrado');
      }

      try {
        const response = await axios.get(`${apiUrl}/asignacion_actividades`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const asignaciones = response.data;

        // Validar que cada asignación tenga id_asignacion_actividad
        asignaciones.forEach((asignacion: Asignacion, index: number) => {
          if (!asignacion.id_asignacion_actividad) {
            console.warn(`⚠️ Asignación en índice ${index} no tiene id_asignacion_actividad:`, asignacion);
          }
        });

        console.log('✅ Datos de asignaciones obtenidos:', asignaciones);
        return asignaciones;
      } catch (error: any) {
        console.error('❌ Error al obtener asignaciones:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        throw new Error(
          error.response?.data?.message || 'Error al obtener las asignaciones'
        );
      }
    },
    retry: (failureCount, error) => {
      if (error.message.includes('Token')) {
        return false; // No reintentar si falta el token
      }
      return failureCount < 2; // Reintentar hasta 2 veces para otros errores
    },
  });
};
