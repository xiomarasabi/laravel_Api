import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const useControlFitosanitarioPorId = (id: string | undefined) => {
    return useQuery({
        queryKey: ["ControlFitosanitario", id],
        queryFn: async () => {
            if (!id) throw new Error("ID no proporcionado");

            const token = localStorage.getItem("token"); // Retrieve token from localStorage
            if (!token) throw new Error("No token found in localStorage");

            const { data } = await axios.get(`${apiUrl}controlfitosanitario/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include token in headers
                },
            });
            console.log("📋 Datos del Control Fitosanitario obtenidos:", data);
            return data.controles?.[0]; // para acceder al objeto directamente
        },
        enabled: !!id,
    });
};