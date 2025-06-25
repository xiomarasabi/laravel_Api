import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export interface Pea {
  id_pea: number;
  nombre: string;
  descripcion: string;
}

const fetchPeas = async (): Promise<Pea[]> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No hay token disponible. Por favor, inicia sesión.');
    }

    const { data } = await axios.get(`${apiUrl}pea`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Respuesta del backend (PEAs):', data.peas);
    return data.peas || [];
  } catch (error) {
    console.error('Error al obtener la lista de PEAs:', error);
    throw new Error('No se pudo obtener la lista de PEAs');
  }
};

export const usePea = () => {
  return useQuery<Pea[], Error>({
    queryKey: ['peas'],
    queryFn: fetchPeas,
    retry: 1,
    refetchOnWindowFocus: true,
    staleTime: 0,
    gcTime: 0,
  });
};