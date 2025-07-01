import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL.replace(/\/+$/, '');

export interface Pea {
  id: number;
  nombre: string;
  descripcion: string | null;
}

const fetchPeas = async (): Promise<Pea[]> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No hay token disponible. Por favor, inicia sesión.');
    }

    const { data } = await axios.get(`${apiUrl}/peas`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Respuesta del backend (PEAs):', data);
    if (!Array.isArray(data)) {
      throw new Error('Los datos de PEAs no tienen el formato esperado.');
    }

    return data.map((pea: any) => ({
      id: pea.id,
      nombre: pea.nombre || 'Sin nombre',
      descripcion: pea.descripcion || null,
    }));
  } catch (error) {
    console.error('Error al obtener la lista de PEAs:', error);
    throw new Error('No se pudo obtener la lista de PEAs');
  }
};

export const usePea = () => {
  return useQuery<Pea[], Error>({
    queryKey: ['Peas'],
    queryFn: fetchPeas,
    retry: 1,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos
  });
};