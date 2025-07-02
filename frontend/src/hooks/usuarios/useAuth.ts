import { useState } from "react";

export function useAuth() {
  const [error, setError] = useState<string | null>(null);

  const login = async (identificacion: string, password: string) => {
    setError(null);
    const apiUrl = import.meta.env.VITE_API_URL;

    if (!apiUrl) {
      setError("La URL de la API no está definida");
      return { success: false };
    }

    try {
      const response = await fetch(`${apiUrl}login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identificacion, password }),
      });

      const data = await response.json();
      console.log("Respuesta de la API:", data);

      if (!response.ok) {
        throw new Error(data.error || "Usuario o contraseña incorrectos.");
      }

      if (!data.access_token) {
        throw new Error("El token de acceso no fue proporcionado por la API.");
      }

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("token_type", data.token_type || "bearer");

      return { success: true };
    } catch (err: any) {
      console.error("Error en autenticación:", err);
      setError(err.message);
      return { success: false };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("token_type");
    console.log("Tokens eliminados.");
  };

  return { login, logout, error };
}
