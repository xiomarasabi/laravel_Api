import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;


export interface Usuario {
  identificacion: number;
  contrasena: string;
  email: string;
  nombre: string;
  telefono: string;
  fk_id_rol: number; 
}

export const useCreateUsuarios = () =>{
  const queryClient = useQueryClient();

  return useMutation({
      mutationFn: async (nuevoUsuario: Usuario) => {
        const token = localStorage.getItem("token");
        if (token) {
          const decoded = JSON.parse(atob(token.split('.')[1]));
          console.log("🔍 Decodificado JWT:", decoded);
        }
        if (!token) {
          throw new Error("No se ha encontrado un token de autenticacion");
        }
  const {data} = await axios.post(
    `${apiUrl}usuarios/`,
    nuevoUsuario,
    {

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
},
onSuccess: () => {
  queryClient.invalidateQueries({queryKey: ["usuarios"]});
},
onError: (error: any) => {
  console.error("Error al crear un nuevo usuario:", error.message)
}
  });
};