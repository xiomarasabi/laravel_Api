// src/hooks/trazabilidad/actividad/useActividades.ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface Actividad {
  id_actividad: number;
  nombre_actividad: string;
  descripcion: string;
}

const fetchActividades = async (): Promise<Actividad[]> => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.warn('No hay token de autenticación');
    return [];
  }

  try {
    const baseUrl = apiUrl.replace(/\/$/, '');
    const response = await axios.get(`${baseUrl}actividades/`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log('Datos de actividades recibidos:', response.data);

    const data = response.data.actividad || response.data || [];
    if (!Array.isArray(data)) {
      console.warn('La API no devolvió un array válido de actividades:', data);
      return [];
    }

    return data.map((item: any) => ({
      id_actividad: item.id_actividad,
      nombre_actividad: item.nombre_actividad,
      descripcion: item.descripcion,
    }));
  } catch (error: any) {
    console.error('Error al obtener actividades:', error.response || error.message);
    return [];
  }
};

export const useActividades = () => {
  return useQuery<Actividad[], Error>({
    queryKey: ['actividades'],
    queryFn: fetchActividades,
    staleTime: 1000 * 60 * 10,
    placeholderData: [],
    retry: 1,
  });
};