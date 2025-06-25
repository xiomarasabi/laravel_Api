import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export interface Pea {
  id_pea: number;
  nombre: string;
  descripcion: string;
}

const fetchPeaPorId = async (id_pea: string | undefined): Promise<Pea> => {
  if (!id_pea || isNaN(parseInt(id_pea))) {
    throw new Error('ID de PEA inválido');
  }

  try {
    const token = localStorage.getItem('token');
    if (!apiUrl) {
      throw new Error('La variable de entorno VITE_API_URL no está definida.');
    }
    if (!token) {
      throw new Error('No hay token disponible. Por favor, inicia sesión.');
    }

    console.log('📤 Enviando solicitud GET /pea/:id_pea:', { id_pea });
    const { data } = await axios.get(`${apiUrl}pea/${id_pea}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('📥 Respuesta del backend (PEA por ID):', data.pea);
    if (!data.pea) {
      throw new Error('PEA no encontrado');
    }
    return data.pea;
  } catch (error: any) {
    console.error('❌ Error al obtener el PEA:', error);
    if (error.response?.status === 403) {
      localStorage.removeItem('token'); // Limpiar token inválido
      throw new Error('Sesión inválida. Por favor, inicia sesión nuevamente.');
    }
    throw error instanceof Error ? error : new Error('No se pudo obtener el PEA');
  }
};

export const usePeaPorId = (id_pea: string | undefined) => {
  return useQuery<Pea, Error>({
    queryKey: ['pea', id_pea],
    queryFn: () => fetchPeaPorId(id_pea),
    enabled: !!id_pea && !isNaN(parseInt(id_pea)),
    retry: 1,
    staleTime: 0,
    gcTime: 0,
  });
};