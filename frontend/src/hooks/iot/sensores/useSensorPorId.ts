import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Sensores } from "./useEditarSensor";

const apiUrl = import.meta.env.VITE_API_URL;

export const useSensorPorId = (id: string) => {
  return useQuery<Sensores>({
    queryKey: ["sensor", id],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No se ha encontrado un token de autenticación");
      }

      const baseUrl = apiUrl.endsWith('/') ? apiUrl : `${apiUrl}/`;
      const url = `${baseUrl}sensores/${id}`;

      console.log("📡 Enviando solicitud GET a:", url);

      try {
        const response = await axios.get(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("✅ Sensor obtenido:", response.data);
        return response.data.result; // Ajusta según la estructura de la respuesta del backend
      } catch (error: any) {
        console.error("❌ Error al obtener sensor:", error.response?.data || error.message);
        throw new Error(error.response?.data?.msg || "Error al obtener el sensor");
      }
    },
  });
};