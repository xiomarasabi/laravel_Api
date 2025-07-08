import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const useVentaId = (id: string | undefined) => {
  return useQuery({
    queryKey: ["venta", id],
    queryFn: async () => {
      if (!id) throw new Error("ID no proporcionado");
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No se ha encontrado un token de autenticación");

      try {
        const { data } = await axios.get(`${apiUrl}ventas/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log("🌱 Datos obtenidos del backend:", data);
        return data;
      } catch (error: any) {
        console.error("❌ Error en la solicitud:", error.response?.data || error.message);
        throw error;
      }
    },
    enabled: !!id,
  });
};