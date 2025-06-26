import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL.replace(/\/+$/, '');

export interface ControlFitosanitario {
  id: number;
  fecha_control: string;
  descripcion: string;
  fk_id_desarrollan: number;
  desarrollan: Desarrollan;
}

export interface Desarrollan {
  id: number;
  cultivo: Cultivo;
  pea: Pea;
}

export interface Cultivo {
  id: number;
  nombre_cultivo: string;
  fecha_plantacion: string;
  descripcion: string;
}

export interface Pea {
  id: number;
  nombre: string;
  descripcion: string;
}

export const useControlFitosanitarioPorId = (id: string | undefined) => {
  return useQuery<ControlFitosanitario, Error>({
    queryKey: ["ControlFitosanitario", id],
    queryFn: async () => {
      if (!id) throw new Error("ID no proporcionado");

      const token = localStorage.getItem("token");
      if (!token) throw new Error("No se encontró el token de autenticación");

      try {
        const { data } = await axios.get(`${apiUrl}/control_fitosanitario/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("📋 Datos del Control Fitosanitario obtenidos:", data);
        return data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const message = error.response?.data?.message || error.message;
          console.error("Error al obtener Control Fitosanitario:", {
            status: error.response?.status,
            message,
          });
          throw new Error(`No se pudo obtener el Control Fitosanitario: ${message}`);
        }
        console.error("Error desconocido:", error);
        throw new Error("Error desconocido al obtener Control Fitosanitario");
      }
    },
    enabled: !!id,
  });
};