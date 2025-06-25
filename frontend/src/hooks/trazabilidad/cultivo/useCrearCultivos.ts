import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_URL.replace(/\/+$/, ''); // Elimina barras finales

export interface CultivoData {
  nombre_cultivo: string;
  fecha_plantacion: string;
  descripcion: string;
  fk_id_especie: number;
  fk_id_semillero: number;
}

export const useCrearCultivo = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (cultivo: CultivoData) => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token no encontrado');

      console.log('Enviando solicitud POST a:', `${apiUrl}/cultivo`); // Debug
      console.log('Datos enviados:', cultivo); // Debug
      const response = await axios.post(`${apiUrl}/cultivo`, cultivo, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Respuesta del servidor:', response.status, response.data); // Debug
      return response.data;
    },
    onSuccess: (data) => {
      console.log('Mutación exitosa, redirigiendo a /cultivos', data); // Debug
      navigate('/cultivos');
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

export const fetchEspecies = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Token no encontrado');

  try {
    const url = `${apiUrl}/especie`;
    console.log('Solicitando especies en:', url); // Debug
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Respuesta de especies:', response.data); // Debug
    return Array.isArray(response.data) ? response.data : [];
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

export const fetchSemilleros = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Token no encontrado');

  try {
    const url = `${apiUrl}/semilleros`;
    console.log('Solicitando semilleros en:', url); // Debug
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Respuesta de semilleros:', response.data); // Debug
    return Array.isArray(response.data) ? response.data : [];
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