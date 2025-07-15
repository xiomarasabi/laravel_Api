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

const obtenerAsignacionPorId = async (id: string) => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('❌ Error: Token de autenticación no encontrado');
    throw new Error('Token de autenticación no encontrado');
  }

  try {
    const response = await axios.get(`${apiUrl}/asignacion_actividades/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    console.log('✅ Datos de la asignación obtenidos:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Error al obtener asignación:', {
      id,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    if (error.message.includes('Network Error')) {
      throw new Error(
        'Error de red: No se pudo conectar con el servidor. Verifica la configuración de CORS o la disponibilidad del servidor.'
      );
    }
    throw new Error(
      error.response?.data?.message || 'Error al obtener la asignación'
    );
  }
};

export const useAsignacionPorId = (id?: string) => {
  return useQuery<Asignacion, Error>({
    queryKey: ['asignacion', id],
    queryFn: () => obtenerAsignacionPorId(id!),
    enabled: !!id && !isNaN(Number(id)) && id !== 'sin id',
    retry: (failureCount, error) => {
      if (
        error.message.includes('ID de asignación inválido') ||
        error.message.includes('Token') ||
        error.message.includes('CORS')
      ) {
        return false; // No reintentar en caso de ID inválido, token faltante o error de CORS
      }
      return failureCount < 2; // Reintentar hasta 2 veces para otros errores
    },
  });
};