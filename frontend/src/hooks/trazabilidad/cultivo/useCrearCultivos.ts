import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_URL.replace(/\/+$/, ''); // Elimina barras finales

export interface CultivoData {
  nombre_cultivo: string;
  fecha_plantacion: string;
  descripcion: string | null;
  fk_id_especie: number;
  fk_id_semillero: number;
}

export interface Especie {
  id: number;
  nombre_comun: string;
  nombre_cientifico: string;
}

export interface Semillero {
  id: number;
  nombre_semilla: string;
  fecha_siembra: string;
}

export const useCrearCultivo = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cultivo: CultivoData) => {
      //const token = localStorage.getItem('token');
      //if (!token) throw new Error('Token no encontrado');

      console.log('Enviando solicitud POST a:', `${apiUrl}/cultivos`); // Debug
      console.log('Datos enviados:', cultivo); // Debug
      const response = await axios.post(`${apiUrl}/cultivos`, cultivo, {
        headers: {
         // Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Respuesta del servidor:', response.status, response.data); // Debug
      return response.data;
    },
    onSuccess: () => {
      console.log('Mutación exitosa, invalidando caché y redirigiendo a /cultivo'); // Debug
      queryClient.invalidateQueries({ queryKey: ['Cultivo'] }); // Invalidar caché
      navigate('/cultivo');
    },
    onError: (error: any) => {
      console.error('Error al crear cultivo:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        console.error('Detalles del error:', {
          status: error.response?.status,
          data: error.response?.data,
          message: errorMessage,
        });
        throw new Error(errorMessage);
      }
      throw error;
    },
  });
};

export const fetchEspecies = async (): Promise<Especie[]> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Token no encontrado');

  try {
    const url = `${apiUrl}/especies`; // Corregido a plural
    console.log('Solicitando especies en:', url); // Debug
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Respuesta de especies:', response.data); // Debug
    return Array.isArray(response.data)
      ? response.data.map((e: any) => ({
          id: e.id,
          nombre_comun: e.nombre_comun,
          nombre_cientifico: e.nombre_cientifico,
        }))
      : [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error en fetchEspecies:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        url: error.config?.url,
      });
    } else {
      console.error('Error desconocido en fetchEspecies:', error);
    }
    throw new Error('No se pudieron cargar las especies');
  }
};

export const fetchSemilleros = async (): Promise<Semillero[]> => {
  //const token = localStorage.getItem('token');
  //if (!token) throw new Error('Token no encontrado');

  try {
    const url = `${apiUrl}/semilleros`;
    console.log('Solicitando semilleros en:', url); // Debug
    const response = await axios.get(url, {
    //  headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Respuesta de semilleros:', response.data); // Debug
    return Array.isArray(response.data)
      ? response.data.map((s: any) => ({
          id: s.id,
          nombre_semilla: s.nombre_semilla,
          fecha_siembra: s.fecha_siembra,
        }))
      : [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error en fetchSemilleros:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        url: error.config?.url,
      });
    } else {
      console.error('Error desconocido en fetchSemilleros:', error);
    }
    throw new Error('No se pudieron cargar los semilleros');
  }
};