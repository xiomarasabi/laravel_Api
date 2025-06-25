import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

// Interfaz para los datos enviados al backend
export interface CrearResiduoInput {
    nombre: string;
    fecha: string; // Formato YYYY-MM-DD
    descripcion: string;
    fk_id_cultivo: number;
    fk_id_tipo_residuo: number;
}

export const useCrearResiduo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (nuevoResiduo: CrearResiduoInput) => {
            const token = localStorage.getItem('token');
            console.log('API URL:', apiUrl); // Depuración
            console.log('Full URL:', `${apiUrl}/residuos`); // Depuración

            if (!apiUrl) {
                throw new Error('La variable de entorno VITE_API_URL no está definida.');
            }

            if (!token) {
                throw new Error('No hay token disponible. Por favor, inicia sesión.');
            }

            console.log('Enviando datos al backend:', nuevoResiduo);
            const { data } = await axios.post(`${apiUrl}residuos`, nuevoResiduo, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['residuos'] });
        },
        onError: (error) => {
            console.error('Error en la mutación:', error);
        },
    });
};