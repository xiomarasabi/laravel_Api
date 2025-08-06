import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL.replace(/\/+$/, '') || 'http://localhost:3000';

export interface Sensores {
  id: number;
  nombre_sensor: string;
  tipo_sensor: string;
  unidad_medida: string;
  descripcion: string;
  medida_minima: number;
  medida_maxima: number;
}

export const useEditarSensor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sensorActualizado: Sensores) => {
      const { id, ...datos } = sensorActualizado;
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No se ha encontrado un token de autenticación");
      }

      const url = `${apiUrl}/sensores/${id}`;

      try {
        const response = await axios.put(url, datos, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error: any) {
        throw new Error(error.response?.data?.error || error.message || "Error al actualizar el sensor");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sensores"] });
    },
    onError: (error: any) => {
      throw error; // Propagamos el error al componente
    },
  });
};