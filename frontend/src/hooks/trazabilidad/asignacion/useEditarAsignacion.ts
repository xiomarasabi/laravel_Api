import { useMutation, useQueryClient } from '@tanstack/react-query';
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

const actualizarAsignacion = async (asignacion: Asignacion) => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('❌ Error: Token de autenticación no encontrado');
    throw new Error('Token de autenticación no encontrado');
  }

  try {
    const { id_asignacion_actividad, ...datos } = asignacion;
    const response = await axios.put(
      `${apiUrl}/asignacion_actividades/${id_asignacion_actividad}`,
      {
        ...datos,
        fk_id_actividad: Number(datos.fk_id_actividad),
        fk_identificacion: Number(datos.fk_identificacion),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('✅ Asignación actualizada con éxito:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Error al actualizar la asignación:', {
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
      error.response?.data?.message || 'No se pudo actualizar la asignación. Verifica los datos e intenta de nuevo.'
    );
  }
};

export const useEditarAsignacion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: actualizarAsignacion,
    onSuccess: () => {
      console.log('✅ Asignación actualizada, invalidando queries');
      queryClient.invalidateQueries({ queryKey: ['asignaciones'] });
      queryClient.invalidateQueries({ queryKey: ['asignacion'] });
    },
    onError: (error: Error) => {
      console.error('❌ Error en la mutación:', error.message);
    },
  });
};