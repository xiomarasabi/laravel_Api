import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// URL base de la API
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Interfaces basadas en la tabla asignacion_actividad y la respuesta del backend
export interface Asignacion {
  id: number;
  fecha: string; // Fecha en formato ISO
  fk_id_actividad: Actividad;
}

export interface Actividad {
  id: number;
  nombre_actividad: string;
  descripcion: string;
  fk_identificacion: Usuario;
}

export interface Usuario {
  id: string; // VARCHAR(20) en la tabla usuarios
  nombre: string;
  email: string;
  fk_id_rol: Rol;
}

export interface Rol {
  id: number;
  nombre_rol: string;
  fecha_creacion: string;
}

// Función para obtener asignaciones
const fetchAsignaciones = async (): Promise<Asignacion[]> => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  try {
    const response = await axios.get(`${apiUrl}asignacion_actividad/`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Validamos que los datos devueltos sean un array
    if (!Array.isArray(response.data.asignacion_actividad)) {
      throw new Error('La API no devolvió un array válido.');
    }

    console.log('Datos recibidos de la API:', response.data);

    return response.data.asignacion_actividad;
  } catch (error: any) {
    console.error('Error al obtener asignaciones de actividades:', error.response || error.message);
    throw new Error(
      error.response?.data?.msg || 'No se pudo obtener la lista de las actividades asignadas'
    );
  }
};

// Hook para consumir las asignaciones
export const useAsignacion = () => {
  return useQuery<Asignacion[], Error>({
    queryKey: ['asignaciones'],
    queryFn: fetchAsignaciones,
    staleTime: 1000 * 60 * 10, // Los datos se consideran frescos por 10 minutos
  });
};