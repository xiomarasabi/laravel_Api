// useCrearUbicacion.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL.replace(/\/+$/, '') || 'http://localhost:8000/api';

export interface Ubicacion {
  id_ubicacion?: number; // Opcional, generado por el backend
  latitud: number;
  longitud: number;
}

export const useCrearUbicacion = () => {
  const queryClient = useQueryClient();

  const validateUbicacion = (ubicacion: Ubicacion) => {
    if (isNaN(ubicacion.latitud) || ubicacion.latitud < -90 || ubicacion.latitud > 90) {
      throw new Error('La latitud debe ser un número entre -90 y 90');
    }
    if (isNaN(ubicacion.longitud) || ubicacion.longitud < -180 || ubicacion.longitud > 180) {
      throw new Error('La longitud debe ser un número entre -180 y 180');
    }
    return {
      latitud: Number(ubicacion.latitud),
      longitud: Number(ubicacion.longitud),
    };
  };

  return useMutation({
    mutationFn: async (nuevaUbicacion: Ubicacion) => {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se ha encontrado un token de autenticación');
      }
      const validatedData = validateUbicacion(nuevaUbicacion);
      console.log('Datos enviados:', validatedData);
      const { data } = await axios.post(
        `${apiUrl}/ubicaciones`,
        validatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Ubicaciones'] });
    },
    onError: (error: any) => {
      console.error('Error al crear la ubicación:', error.response?.data || error.message);
      throw error;
    },
  });
};