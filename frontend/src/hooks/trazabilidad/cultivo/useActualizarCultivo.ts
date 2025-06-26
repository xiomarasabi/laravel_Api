import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL.replace(/\/+$/, ''); // Elimina barras finales

export interface Cultivo {
  id: number;
  nombre_cultivo: string;
  fecha_plantacion: string;
  descripcion: string | null;
  fk_id_especie: number;
  fk_id_semillero: number;
}

export const useActualizarCultivo = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cultivoActualizado: Cultivo) => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token no encontrado');

      const { id, ...datos } = cultivoActualizado;
      console.log('Enviando solicitud PUT a:', `${apiUrl}/cultivos/${id}`); // Debug
      console.log('Datos enviados:', datos); // Debug
      const response = await axios.put(`${apiUrl}/cultivos/${id}`, datos, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Respuesta del servidor:', response.status, response.data); // Debug
      return response.data;
    },
    onSuccess: () => {
      console.log('Mutación exitosa, invalidando caché y redirigiendo a /cultivos'); // Debug
      queryClient.invalidateQueries({ queryKey: ['Cultivo'] }); // Alinear con useCultivo
      navigate('/cultivo');
    },
    onError: (error: any) => {
      console.error('Error al actualizar cultivo:', error);
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