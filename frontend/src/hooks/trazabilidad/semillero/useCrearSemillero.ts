import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/';

export interface Semillero {
  id_semillero?: number; // Opcional, ya que el backend probablemente lo ignora
  nombre_semilla: string;
  fecha_siembra: string;
  fecha_estimada: string;
  cantidad: number;
}

export const useCrearSemillero = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (nuevoSemillero: Semillero) => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('❌ Token no encontrado en localStorage');
        throw new Error('Token no encontrado');
      }

      // Validar payload antes de enviar
      if (
        !nuevoSemillero.nombre_semilla?.trim() ||
        !nuevoSemillero.fecha_siembra ||
        !nuevoSemillero.fecha_estimada ||
        !Number.isInteger(nuevoSemillero.cantidad) ||
        nuevoSemillero.cantidad <= 0
      ) {
        console.error('❌ Payload inválido:', nuevoSemillero);
        throw new Error('Datos inválidos para crear el semillero');
      }

      // Log detallado del payload
      console.log('🚀 Enviando semillero al backend:', JSON.stringify(nuevoSemillero, null, 2));

      const response = await axios.post(`${apiUrl}semilleros/`, nuevoSemillero, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    },
    onSuccess: () => {
      console.log('✅ Semillero creado con éxito');
      queryClient.invalidateQueries({ queryKey: ['semilleros'] });
    },
    onError: (error: any) => {
      const status = error?.response?.status;
      const message = error?.response?.data?.message || error.message || 'Error desconocido';
      console.error('❌ Error al crear semillero:', {
        message,
        status,
        data: error?.response?.data,
        headers: error?.response?.headers,
      });
      // No mostramos alert aquí, lo manejamos en el componente
    },
  });
};