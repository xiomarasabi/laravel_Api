import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

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
      console.log("📝 Token usado en la solicitud:", token);
      if (!token) {
        throw new Error("No se ha encontrado un token de autenticación");
      }

      const baseUrl = apiUrl.endsWith('/') ? apiUrl : `${apiUrl}/`;
      const url = `${baseUrl}sensores/${id}`;

      console.log("📝 Enviando datos para actualizar sensor ID", id, datos);

      try {
        const response = await axios.put(url, datos, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("✅ Respuesta de la API:", { data: response.data, status: response.status });
        return response.data;
      } catch (error: any) {
        console.error("❌ Error en la solicitud:", error.response?.data || error.message);
        throw new Error(error.response?.data?.error || "Error al actualizar el sensor");
      }
    },
    onSuccess: () => {
      console.log("✅ Sensor actualizado con éxito, invalidando consulta ['sensores']");
      queryClient.invalidateQueries({ queryKey: ["sensores"] });
    },
    onError: (error: any) => {
      console.error("❌ Error al actualizar el Sensor:", error.message, error.response?.data);
    },
  });
};