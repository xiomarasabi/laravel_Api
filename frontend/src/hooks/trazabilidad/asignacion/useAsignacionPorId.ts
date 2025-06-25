import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const useAsignacionporId = (id: string | undefined) => {
  return useQuery({
    queryKey: ["asignaciones", id], // Cambiado a "asignaciones" para consistencia
    queryFn: async () => {
      if (!id) {
        console.error("❌ Error: ID no proporcionado");
        throw new Error("ID no proporcionado");
      }
      const { data } = await axios.get(`${apiUrl}asignacion_actividad/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`, // Añadir token si es necesario
        },
      });
      console.log("📋 Datos de la asignación obtenidos:", data);
      return data;
    },
    enabled: !!id,
  });
};