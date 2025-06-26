import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL.replace(/\/+$/, ''); // Elimina barras finales

export interface Cultivo {
  id: number;
  nombre_cultivo: string;
  fecha_plantacion: string;
  descripcion: string | null;
  fk_id_especie: { id: number; nombre_comun: string } | null;
  fk_id_semillero: { id: number; nombre_semilla: string } | null;
}

export const useCultivoPorId = (id_cultivo: string | undefined) => {
  return useQuery<Cultivo, Error>({
    queryKey: ["Cultivo", id_cultivo],
    queryFn: async () => {
      if (!id_cultivo) throw new Error("ID no proporcionado");
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token no encontrado');

      console.log('Solicitando cultivo por ID en:', `${apiUrl}/cultivos/${id_cultivo}`); // Debug
      const response = await axios.get(`${apiUrl}/cultivos/${id_cultivo}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Datos obtenidos del backend:', response.data); // Debug
      return {
        id: response.data.id,
        nombre_cultivo: response.data.nombre_cultivo,
        fecha_plantacion: response.data.fecha_plantacion,
        descripcion: response.data.descripcion,
        fk_id_especie: response.data.especie
          ? { id: response.data.especie.id, nombre_comun: response.data.especie.nombre_comun }
          : null,
        fk_id_semillero: response.data.semillero
          ? { id: response.data.semillero.id, nombre_semilla: response.data.semillero.nombre_semilla }
          : null,
      };
    },
    enabled: !!id_cultivo,
  });
};