import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

// Interface del tipo de cultivo
export interface TipoCultivo {
  id_tipo_cultivo: number;
  nombre: string;
  descripcion: string;
}

// Interface que se recibe desde el backend al hacer GET /especie
export interface EspecieConTipo {
  id_especie: number;
  nombre_comun: string;
  nombre_cientifico: string;
  descripcion: string;
  tipo_cultivo: TipoCultivo | null;
}

// Función que obtiene las especies desde el backend
const fetchEspecie = async (): Promise<EspecieConTipo[]> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token de autenticación no encontrado");

    const { data } = await axios.get(`${apiUrl}especie/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  } catch (error: any) {
    console.error("❌ Error al obtener las especies:", error);
    const errorMessage = error.response?.data?.message || "No se pudo obtener la lista de especies";
    throw new Error(errorMessage);
  }
};

// Hook personalizado para consumir las especies
export const useEspecie = () => {
  return useQuery<EspecieConTipo[], Error>({
    queryKey: ['especies'],
    queryFn: fetchEspecie,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};
