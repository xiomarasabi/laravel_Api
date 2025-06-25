import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface Lotes {
    id: number;
    fk_id_ubicacion: number;
    dimension: number;
    nombre_lote: string;
    estado: string;
}

export const useEditarLote = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (loteActualizado: Lotes) => {
            const { id, ...datos } = loteActualizado;

            // Validar antes de enviar
            if (!datos.fk_id_ubicacion || !datos.dimension || !datos.nombre_lote.trim() || !datos.estado.trim()) {
                throw new Error("⚠️ Datos inválidos. Por favor, revisa los campos.");
            }

            console.log("📝 Enviando datos para actualizar:", datos);

            const token = localStorage.getItem('token');
            if (!token) {
                console.error('❌ Error: No se ha encontrado un token de autenticación');
                throw new Error('No se ha encontrado un token de autenticación');
            }

            try {
                const { data } = await axios.put(`${apiUrl}lotes/${id}`, datos, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`, // Agregado para autenticación
                    },
                });
                return data;
            } catch (error: any) {
                console.error("❌ Error en la solicitud PUT:", {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                });
                throw new Error(error.response?.data?.msg || `Error al actualizar el lote: ${error.message}`);
            }
        },
        onSuccess: () => {
            console.log("✅ Lote actualizado con éxito");
            queryClient.invalidateQueries({ queryKey: ["lote"] });
        },
        onError: (error) => {
            console.error("❌ Error al actualizar el Lote:", error);
        },
    });
};