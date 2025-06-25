import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

export interface Asignacion {
  fecha: string;
  fk_id_actividad: string;
  fk_identificacion: string;
}

export const useCrearAsignacion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (nuevaAsignacion: Asignacion) => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token no encontrado");

      console.log("🚀 Datos enviados al backend para crear asignación:", nuevaAsignacion);

      try {
        const { data } = await axios.post(`${apiUrl}/asignacion_actividad`, nuevaAsignacion, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        return data;
      } catch (error: any) {
        console.error("Error detallado:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
          config: error.config,
        });
        throw error;
      }
    },
    onSuccess: () => {
      console.log("✅ Asignación creada con éxito");
      queryClient.invalidateQueries({ queryKey: ["asignaciones_actividades"] });
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || error.message || "Error desconocido";
      console.error("❌ Error al crear asignación:", msg);
      throw new Error(msg);
    },
  });
};