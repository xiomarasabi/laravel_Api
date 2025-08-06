import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface Lote {
  id?: number;
  dimension: number;
  nombre_lote: string;
  fk_id_ubicacion: number;
  estado: string;
}



export const useCrearLote = () => {
    const queryClient = useQueryClient();

    const validateLote = (lote: Lote) => {
        if (!lote.dimension || isNaN(lote.dimension) || lote.dimension < 0.01) {
            throw new Error("La dimensión debe ser un número mayor o igual a 0.01");
        }
        if (!lote.nombre_lote || lote.nombre_lote.length > 100) {
            throw new Error("El nombre del lote es obligatorio y debe tener máximo 100 caracteres");
        }
        if (!lote.fk_id_ubicacion || isNaN(lote.fk_id_ubicacion)) {
            throw new Error("El ID de ubicación es obligatorio y debe ser un número válido");
        }
        if (!["Activo", "Inactivo"].includes(lote.estado)) {
            throw new Error("El estado debe ser 'Activo' o 'Inactivo'");
        }
        return {
            dimension: Number(lote.dimension), // Asegurar que dimension sea número
            nombre_lote: lote.nombre_lote,
            fk_id_ubicacion: lote.fk_id_ubicacion,
            estado: lote.estado,
        };
    };

    return useMutation({
        mutationFn: async (nuevoHerramienta: Lote) => {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No se ha encontrado un token de autenticación");
            }
            const validatedData = validateLote(nuevoHerramienta);
            console.log("Datos enviados:", validatedData); // Para depuración
            const { data } = await axios.post(
                `${apiUrl}lotes`,
                validatedData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Lote"] });
        },
        onError: (error: any) => {
            console.error("Error al crear el lote:", error.response?.data || error.message);
            throw error; // Relanzar el error para que el componente lo maneje
        },
    });
};