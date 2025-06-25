import { useState } from "react";
import { Eye, EyeOff, Facebook, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCustomForm } from "../../hooks/validaciones/useCustomForm";
import { loginSchema, LoginData } from "../../hooks/validaciones/useSchemas";
import { useAuth } from "@/hooks/usuarios/useAuth";
import logoAgrosis from "../../../public/logo_proyecto-removebg-preview.png";
import logoSena from "../../../public/logoSena.png";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login, error } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useCustomForm(loginSchema, {
    login: "",
    password: "",
  });

  const onSubmit = async (data: LoginData) => {
    const result = await login(data.login, data.password);
    console.log("a ver que aparece",result);
    if (result.success) {
      navigate("/principal");
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-white relative">
      <div className="flex w-3/5 h-4/5 bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Sección izquierda con formulario */}
        <div className="w-1/2 flex flex-col justify-center p-8 bg-white">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <img src={logoSena} alt="SENA" className="w-12" />
            <h2 className="text-2xl font-bold text-gray-700">AGROSIS</h2>
          </div>
          <p className="text-center text-gray-500 mb-6">¡Bienvenido!</p>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>} {/* Mostrar error si existe */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Identificación"
                {...register("login")}
                className="w-full px-4 py-2 border rounded-md"
              />
              {errors.login && (
                <p className="text-red-500 text-sm">{errors.login.message}</p>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                {...register("password")}
                className="w-full px-4 py-2 border rounded-md"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-4 flex items-center"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password.message}</p>
              )}
            </div>
            <p className="text-sm text-gray-500 text-center">
              ¿Olvidaste tu contraseña?{" "}
              <a href="/solicitarRecuperacion" className="text-green-600">
                Recupérala aquí
              </a>
            </p>
            <p className="text-sm text-gray-500 text-center">
              ¿No estás registrado?{" "}
              <a href="/register" className="text-green-600">
                Regístrate aquí
              </a>
            </p>
            <button type="submit" className="w-full py-2 bg-green-600 text-white rounded-md">
              Iniciar sesión
            </button>
          </form>
        </div>

        {/* Sección derecha con logo y redes sociales */}
        <div className="w-1/2 flex flex-col items-center justify-center bg-gray-100 p-6">
          <img src={logoAgrosis} alt="AgroSIS" className="w-48 mb-4" />
          <div className="flex space-x-4 mt-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="bg-blue-600 p-3 rounded-full text-white shadow-md">
              <Facebook size={24} />
            </a>
            <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="bg-green-600 p-3 rounded-full text-white shadow-md">
              <MessageCircle size={24} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
