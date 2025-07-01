import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL.replace(/\/+$/, '');

export interface ControlFitosanitario {
  id: number;
  fecha_control: string;
  descripcion: string;
  fk_id_desarrollan: number;
}

export const useActualizarControlFitosanitario = () => {
  return useMutation({
    mutationFn: async (control: {
      id: number;
      fecha_control: string;
      descripcion: string;
      fk_id_desarrollan: number;
    }) => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No se encontró el token de autenticación");

      const { id, ...datosActualizados } = control;
      try {
        const { data } = await axios.put(
          `${apiUrl}/control_fitosanitario/${id}`,
          datosActualizados,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const message = error.response?.data?.message || error.message;
          console.error("Error al actualizar Control Fitosanitario:", {
            status: error.response?.status,
            message,
          });
          throw new Error(`No se pudo actualizar el Control Fitosanitario: ${message}`);
        }
        console.error("Error desconocido:", error);
        throw new Error("Error desconocido al actualizar Control Fitosanitario");
      }
    },
  });
};