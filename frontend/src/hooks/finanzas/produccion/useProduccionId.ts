import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const useProduccionId = (id_produccion: string | undefined) => {
  return useQuery({
    queryKey: ["produccion", id_produccion],
    queryFn: async () => {
      if (!id_produccion) throw new Error("ID no proporcionado");

      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(`${apiUrl}produccion/${id_produccion}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("🌱 Datos obtenidos del backend:", data); // ✅ corregido

        if (!data) {
          throw new Error("No se encontró la producción en la respuesta");
        }

        return data;
      } catch (error: any) {
        console.error("❌ Error en la solicitud:", error.response?.data || error.message);
        throw error;
      }
    },
    enabled: !!id_produccion,
  });
};
