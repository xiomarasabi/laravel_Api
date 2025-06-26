import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || 'http://localhost:8000/api';

export interface CrearPeaInput {
  nombre: string;
  descripcion: string | null;
}

const crearPea = async (nuevoPea: CrearPeaInput): Promise<CrearPeaInput & { id: number }> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No hay token disponible. Por favor, inicia sesión.');
    }

    console.log('Solicitando a:', `${apiUrl}/peas`);
    console.log('Datos enviados al backend:', nuevoPea);
    const { data } = await axios.post(`${apiUrl}/peas`, nuevoPea, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Respuesta del backend (crear PEA):', data);
    return data;
  } catch (error: any) {
    console.error('Error al crear el PEA:', error);
    console.error('Detalles del error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw new Error(error.response?.data?.message || 'No se pudo crear el PEA');
  }
};

export const useCrearPea = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: crearPea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Peas'] });
    },
    onError: (error: Error) => {
      console.error('Error en useCrearPea:', error.message);
    },
  });
};