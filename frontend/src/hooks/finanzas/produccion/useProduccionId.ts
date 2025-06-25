import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const useProduccionId = (id_produccion: string | undefined) => {
  return useQuery({
    queryKey: ["produccion", id_produccion],
    queryFn: async () => {
      if (!id_produccion) throw new Error("ID no proporcionado");

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token no encontrado");
      }

      try {
        const { data } = await axios.get(`${apiUrl}produccion/${id_produccion}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log("🌱 Datos obtenidos del backend:", data.produccion); // Depuración específica
        if (!data.produccion) {
          throw new Error("No se encontró la producción en la respuesta");
        }
        return data.produccion;
      } catch (error: any) {
        console.error("❌ Error en la solicitud:", error.response?.data || error.message);
        throw error;
      }
    },
    enabled: !!id_produccion,
  });
};