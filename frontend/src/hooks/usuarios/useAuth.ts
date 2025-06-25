import { useState } from "react";

export function useAuth() {
  const [error, setError] = useState<string | null>(null);

  const login = async (login: string, contrasena: string) => {
    setError(null);
    const apiUrl = import.meta.env.VITE_API_URL;

    if (!apiUrl) {
      setError("La URL de la API no está definida");
      return { success: false };
    }

    try {
      // Asegúrate de que el apiUrl esté correctamente configurado en .env
      const response = await fetch(`${apiUrl}login`, {  // Asegúrate de que la URL esté bien formada
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, contrasena }),
      });

      const data = await response.json();
      console.log("Respuesta de la API:", data);

      // Asegúrate de que la API regrese 'access' y maneja el error si no es así
      if (!response.ok) {
        throw new Error(data.msg || "Usuario o contraseña incorrectos.");
      }

      if (!data.access) {
        throw new Error("El token de acceso no fue proporcionado por la API.");
      }

      // Guardar el token en localStorage
      localStorage.setItem("token", data.access);
      console.log("Token guardado exitosamente:", data.access);

      localStorage.setItem("user", JSON.stringify(data.usuario));

      if (data.refresh) {
        localStorage.setItem("refreshToken", data.refresh); // Si hay refreshToken, guardarlo también
      }

      return { success: true };
    } catch (err: any) {
      console.error("Error en autenticación:", err);
      setError(err.message);
      return { success: false };
    }
  };

  const logout = () => {
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      console.log("Tokens eliminados.");
    }
  };

  return { login, logout, error };
}
