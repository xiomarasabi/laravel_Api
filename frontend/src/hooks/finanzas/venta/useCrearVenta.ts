import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface NuevaVenta {
  fk_id_produccion: number;
  cantidad: number;
  precio_unitario: number;
  total_venta: number;
  fecha_venta: string;
}

export const useCrearVenta = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (nuevaVenta: NuevaVenta) => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No se ha encontrado un token de autenticación");
      }

      const { data } = await axios.post(
        `${apiUrl}ventas/`,
        nuevaVenta,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ventas"] });
    },
    onError: (error: any) => {
      console.error("Error al crear la venta:", error.message);
    },
  });
};
