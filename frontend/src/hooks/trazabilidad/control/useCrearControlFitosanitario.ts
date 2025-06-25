import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface ControlFitosanitario {
    id_control_fitosanitario: number;
    fecha_control: string;
    descripcion: string;
    fk_id_desarrollan: number;
    desarrollan: Desarrollan;
    detalle: string;
}

export interface Desarrollan {
    id_desarrollan: number;
    cultivo: Cultivo;
    pea: Pea;
}

export interface Cultivo {
    id_cultivo: number;
    nombre_cultivo: string;
    fecha_plantacion: string;
    descripcion: string;
}

export interface Pea {
    id_pea: number;
    nombre: string;
    descripcion: string;
}

type NuevoControlFitosanitario = Omit<ControlFitosanitario, 'id_control_fitosanitario' | 'desarrollan'>;

export const useCrearControlFitosanitario = () => {
    const queryClient = useQueryClient();

    return useMutation<ControlFitosanitario, unknown, NuevoControlFitosanitario>({
        mutationFn: async (nuevoControl: NuevoControlFitosanitario) => {
            try {
                const token = localStorage.getItem('token');

                if (!token) {
                    throw new Error('No se encontró el token de autenticación');
        }

                const { data } = await axios.post(`${apiUrl}controlfitosanitario/`, nuevoControl,{
                     headers: {
                    Authorization:`Bearer ${token}` ,
            }
                });
                return data;
            } catch (error: any) {
                console.error("🔥 Error en POST:", error.response?.data || error.message);
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["control_fitosanitario"] });
        },
    });
};
