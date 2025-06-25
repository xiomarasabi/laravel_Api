import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const useCultivoPorId = (id_cultivo: string | undefined) => {
    return useQuery({
        queryKey: ["Cultivo", id_cultivo], 
        queryFn: async () => {
            if (!id_cultivo) throw new Error("ID no proporcionado");
            const { data } = await axios.get(`${apiUrl}cultivo/${id_cultivo}`);
            console.log("🌱 Datos obtenidos del backend:", data); // 👀 Verifica los datos
            return data;
        },
        enabled: !!id_cultivo, 
    });
};

