import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || 'http://localhost:8000/api';

export interface ActualizarPeaInput {
  nombre: string;
  descripcion: string | null;
}

const actualizarPea = async ({ id_pea, ...pea }: { id_pea: number } & ActualizarPeaInput): Promise<ActualizarPeaInput & { id: number }> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No hay token disponible. Por favor, inicia sesión.');
    }

    console.log('📤 Enviando al backend (PUT /api/peas/:id_pea):', { id_pea, ...pea });
    const { data } = await axios.put(`${apiUrl}/peas/${id_pea}`, pea, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    console.log('📥 Respuesta del backend:', data);
    return data;
  } catch (error: any) {
    console.error('❌ Error al actualizar el PEA:', error);
    console.error('Detalles del error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw new Error(error.response?.data?.message || 'No se pudo actualizar el PEA');
  }
};

export const useActualizarPea = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: actualizarPea,
    onSuccess: () => {
      console.log('✅ Invalidando query [Peas]');
      queryClient.invalidateQueries({ queryKey: ['Peas'] });
    },
    onError: (error: Error) => {
      console.error('❌ Error en useActualizarPea:', error.message);
    },
  });
};