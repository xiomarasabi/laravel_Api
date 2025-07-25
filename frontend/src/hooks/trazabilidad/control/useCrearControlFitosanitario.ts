import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL.replace(/\/+$/, ''); // Elimina barras finales

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

type NuevoControlFitosanitario = Omit<ControlFitosanitario, 'id' | 'desarrollan'>;

export const useCrearControlFitosanitario = () => {
  const queryClient = useQueryClient();

  return useMutation<ControlFitosanitario, unknown, NuevoControlFitosanitario>({
    mutationFn: async (nuevoControl: NuevoControlFitosanitario) => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error('No se encontró el token de autenticación');
        }

        const { data } = await axios.post(`${apiUrl}/control_fitosanitario`, nuevoControl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return data.control_fitosanitario; // Ajustado para devolver el objeto correcto
      } catch (error: any) {
        console.error("🔥 Error en POST:", error.response?.data || error.message);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ControlFitosanitario'] });
    },
  });
};