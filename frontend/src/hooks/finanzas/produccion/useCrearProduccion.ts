import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface Produccion {
  fk_id_cultivo: number;
  nombre_produccion: string;
  cantidad_producida: number;
  fecha_produccion: string;
  fk_id_lote: number;
  descripcion_produccion: string;
  estado: string;
  fecha_cosecha: string | null;
}

export const useCrearProduccion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (nuevaProduccion: Produccion) => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No se ha encontrado un token de autenticación");
      }

      try {
        const { data } = await axios.post(
          `${apiUrl}produccion/`,
          nuevaProduccion,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("🌱 Producción creada:", data);
        return data;
      } catch (error: any) {
        console.error("❌ Error en la solicitud POST:", error.response?.data || error.message);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["produccion"] });
    },
    onError: (error: any) => {
      console.error("❌ Error al crear la producción:", error.response?.data || error.message);
    },
  });
};