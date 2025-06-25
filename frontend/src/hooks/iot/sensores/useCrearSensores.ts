import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface Sensores {
  nombre_sensor: string;
  tipo_sensor: string;
  unidad_medida: string;
  descripcion: string;
  medida_minima: number;
  medida_maxima: number;
}

export const useCrearSensores = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (nuevoSensor: Sensores) => {
      const token = localStorage.getItem("token");
      console.log('Token usado en la solicitud:', token);
      if (!token) {
        throw new Error("No se ha encontrado un token de autenticación");
      }
      console.log('Enviando solicitud POST a:', `${apiUrl}sensores/`, nuevoSensor);
      const response = await axios.post(`${apiUrl}sensores/`, nuevoSensor, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Respuesta de la API:', { data: response.data, status: response.status });
      return response.data.sensor || response.data; // Manejar la nueva estructura de respuesta
    },
    onSuccess: async (data) => {
      console.log('✅ Mutación exitosa, datos:', data);
      console.log('Invalidando consulta ["sensores"]');
      await queryClient.invalidateQueries({ queryKey: ["sensores"] });
      console.log('✅ Consulta ["sensores"] invalidada');
    },
    onError: (error: any) => {
      console.error('❌ Error al crear el sensor:', error.message, error.response?.data);
    },
  });
};