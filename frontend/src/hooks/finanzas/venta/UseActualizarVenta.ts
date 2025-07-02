import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface Venta {
  id: number;
  fk_id_produccion: number | null;
  cantidad: number;
  precio_unitario: number;
  fecha_venta: string; // formato 'YYYY-MM-DD'
}

export const useActualizarVenta = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ventaActualizada: Venta) => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No se ha encontrado un token de autenticación");
      }

      const { id, ...datos } = ventaActualizada;

      const { data } = await axios.put(
        `${apiUrl}ventas/${id}`,
        datos,
        {
          headers: {
            //Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("🌱 Venta actualizada:", data); // Depuración
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["ventas"] }); // Lista general
      queryClient.invalidateQueries({ queryKey: ["venta", variables.id] }); // Detalle individual
    },
    onError: (error: any) => {
      console.error("❌ Error al actualizar la venta:", error?.response?.data || error.message);
    },
  });
};