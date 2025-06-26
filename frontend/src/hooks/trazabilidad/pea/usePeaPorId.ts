import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || 'http://localhost:8000/api';

export interface Pea {
  id: number;
  nombre: string;
  descripcion: string | null;
}

const fetchPeaPorId = async (id: string | undefined): Promise<Pea> => {
  if (!id || isNaN(parseInt(id))) {
    throw new Error('ID de PEA inválido');
  }

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No hay token disponible. Por favor, inicia sesión.');
    }

    console.log('📤 Enviando solicitud GET /api/peas/:id:', { id });
    const { data } = await axios.get(`${apiUrl}/peas/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('📥 Respuesta del backend (PEA por ID):', data);
    return data;
  } catch (error: any) {
    console.error('❌ Error al obtener el PEA:', error);
    console.error('Detalles del error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    if (error.response?.status === 403) {
      throw new Error('Sesión inválida. Por favor, inicia sesión nuevamente.');
    }
    if (error.response?.status === 404) {
      throw new Error('PEA no encontrado');
    }
    throw new Error(error.response?.data?.message || 'No se pudo obtener el PEA');
  }
};

export const usePeaPorId = (id: string | undefined) => {
  return useQuery<Pea, Error>({
    queryKey: ['Pea', id],
    queryFn: () => fetchPeaPorId(id),
    enabled: !!id && !isNaN(parseInt(id)),
    retry: 1,
    staleTime: 0,
    gcTime: 0,
  });
};