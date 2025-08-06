import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Sensores } from "./useEditarSensor";

const apiUrl = import.meta.env.VITE_API_URL.replace(/\/+$/, '') || 'http://localhost:3000';

export const useSensorPorId = (id: string) => {
  return useQuery<Sensores, Error>({
    queryKey: ["sensor", id],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No se ha encontrado un token de autenticación");
      }

      const url = `${apiUrl}/sensores/${id}`;

      console.log("📡 Enviando solicitud GET a:", url);

      try {
        const response = await axios.get(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;
        console.log("✅ Respuesta de la API:", data);

        // Ajuste para manejar diferentes estructuras de respuesta
        if (data.result && typeof data.result === 'object') {
          return data.result as Sensores;
        } else if (data.id && typeof data === 'object') {
          return data as Sensores;
        } else {
          throw new Error("Formato de respuesta inesperado del backend");
        }
      } catch (error: any) {
        console.error("❌ Error al obtener sensor:", error.response?.data || error.message);
        throw new Error(error.response?.data?.msg || "Error al obtener el sensor");
      }
    },
    gcTime: 1000 * 60 * 10,
    retry: 2,
    staleTime: 1000 * 60 * 5,
  });
};