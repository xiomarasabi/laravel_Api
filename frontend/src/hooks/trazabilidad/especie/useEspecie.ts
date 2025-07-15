import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export interface TipoCultivo {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface Especie {
  id: number;
  nombre_comun: string;
  nombre_cientifico: string;
  descripcion: string;
  fk_id_tipo_cultivo: number;
  tipo_cultivo?: TipoCultivo;
}

const fetchEspecie = async (): Promise<Especie[]> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Token de autenticación no encontrado');

  const response = await axios.get(`${apiUrl}especies/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const useEspecie = () => {
  return useQuery<Especie[], Error>({
    queryKey: ['especies'],
    queryFn: fetchEspecie,
    staleTime: 1000 * 60 * 5,
  });
};
