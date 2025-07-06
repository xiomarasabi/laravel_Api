import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface Produccion {
  id: number;
  nombre_produccion: string;
  fk_id_cultivo: number | null;
  cantidad_producida: number;
  fecha_produccion: string;
  fk_id_lote: number | null;
  descripcion_produccion: string;
  estado: string;
  fecha_cosecha: string;
}

const actualizarProduccionAPI = async (produccionActualizada: Produccion): Promise<Produccion> => {
  const { id, ...datos } = produccionActualizada;

  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No se ha encontrado un token de autenticación");
  }

  try {
    const { data } = await axios.put(`${apiUrl}produccion/${id}`, datos, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("🌱 Producción actualizada:", data);
    return data;
  } catch (error: any) {
    console.error("❌ Error al actualizar la producción:", error?.response?.data || error.message);
    throw error;
  }
};

export const useActualizarProduccion = () => {
  const queryClient = useQueryClient();

  return useMutation<Produccion, Error, Produccion>({
    mutationFn: actualizarProduccionAPI,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["produccion"] });
      queryClient.invalidateQueries({ queryKey: ["produccion", variables.id] });
    },
    onError: (error) => {
      console.error("❌ Error en la mutación de actualización:", error.message);
    },
  });
};