import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// URL base de la API
const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

// Interfaces alineadas con el modelo AsignacionActividades y useAsignacion
export interface Asignacion {
  id?: number; // Opcional, devuelto por el backend
  fecha: string;
  fk_id_actividad: string;
  fk_identificacion: string;
  actividad?: {
    id_actividad: number;
    nombre_actividad: string;
    descripcion: string | null;
  } | null; // Relación devuelta por el backend
  user?: {
    identificacion: number;
    nombre: string;
    email: string;
    telefono: string | null;
    fk_id_rol: {
      id_rol: number;
      nombre_rol: string;
      fecha_creacion: string | null;
    } | null;
  } | null; // Relación devuelta por el backend
}

export const useCrearAsignacion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (nuevaAsignacion: Asignacion) => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token de autenticación no encontrado");

      console.log("🚀 Datos enviados al backend para crear asignación:", nuevaAsignacion);

      try {
        const { data } = await axios.post(`${apiUrl}/asignacion_actividades`, nuevaAsignacion, {
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
        throw new Error(
          error.response?.data?.message ||
            "Error al crear la asignación. Verifica los datos e intenta de nuevo."
        );
      }
    },
    onSuccess: (data) => {
      console.log("✅ Asignación creada con éxito:", data);
      queryClient.invalidateQueries({ queryKey: ["asignaciones"] }); // Corregido para coincidir con useAsignacion
    },
    onError: (error: any) => {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Error desconocido al crear la asignación";
      console.error("❌ Error al crear asignación:", msg);
      throw new Error(msg);
    },
  });
};
