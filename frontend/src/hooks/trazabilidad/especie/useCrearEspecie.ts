import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

// Tipo que esperas cuando creas una especie
export interface Especie {
  id: number;
  nombre_comun: string;
  nombre_cientifico: string;
  descripcion: string;
  fk_id_tipo_cultivo: number;
}

// Tipo que viene del backend cuando haces GET /especie
export interface TipoCultivo {
  id_tipo_cultivo: number;
  nombre: string;
  descripcion: string;
}

export interface EspecieConTipo {
  id_especie: number;
  nombre_comun: string;
  nombre_cientifico: string;
  descripcion: string;
  tipo_cultivo: TipoCultivo | null;
}

export const useCrearEspecie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (nuevaEspecie: Especie) => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token no encontrado");

      console.log("🚀 Datos enviados al backend para crear especie:", nuevaEspecie);

      const { data } = await axios.post(`${apiUrl}especie`, nuevaEspecie, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data;
    },
    onSuccess: () => {
      console.log("✅ Especie creada con éxito");
      queryClient.invalidateQueries({ queryKey: ['especies'] }); // Ojo: asegúrate que la key esté en minúscula
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || error.message || "Error desconocido";
      console.error("❌ Error al crear especie:", msg);
      alert(`No se pudo crear la especie: ${msg}`);
    },
  });
};
