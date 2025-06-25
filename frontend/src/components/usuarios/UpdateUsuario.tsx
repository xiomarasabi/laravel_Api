import { useState, useEffect } from "react";
import { useActualizarUsuario } from "@/hooks/usuarios/useUpdateUsuarios";
import { useNavigate, useParams } from "react-router-dom";
import { useUsuarioPorId } from "@/hooks/usuarios/useIdUsuarios";
import Formulario from "../globales/Formulario";
import { Usuario } from "@/hooks/usuarios/useCreateUsuarios"; 
import { useRoles } from "@/hooks/usuarios/useRol";

const ActualizarUsuario = () => {
    const { identificacion } = useParams(); 
    const { data: usuario, isLoading, error } = useUsuarioPorId(identificacion || "");
    const actualizarUsuario = useActualizarUsuario();
    const navigate = useNavigate();
    const { data: roles = [] } = useRoles(); 
    
    const [formData, setFormData] = useState<Partial<Usuario>>({
        identificacion: 0,
        email: "",
        nombre: "",
        telefono:"",
        fk_id_rol: 0,
    });

    useEffect(() => {
        if (usuario && Object.keys(usuario).length > 0) {
            console.log("🔄 Cargando datos del usuario:", usuario);

            setFormData({
          identificacion: Number(usuario.identificacion) || 0,
          email: usuario.email ?? "",
          nombre: usuario.nombre ?? "",
          telefono: usuario.telefono ?? "",
          fk_id_rol:
            typeof usuario.fk_id_rol === "object"
              ? usuario.fk_id_rol.id
              : usuario.fk_id_rol ?? 0,
        });
        }
    }, [usuario]);

    const handleSubmit = (data: { [key: string]: string }) => {
        if (!identificacion) return;

        const usuarioActualizado: Partial<Usuario> = {};

        Object.entries(data).forEach(([key, value]) => {
            if (typeof value === "string" && value.trim() !== "" && value !== String(usuario?.[key as keyof Usuario])) {
                (usuarioActualizado as any)[key] = ["fk_id_rol", "identificacion"].includes(key)
                    ? parseInt(value, 10) || 0  // ✅ Convierte solo los campos numéricos
                    : value;  // ✅ Mantiene el valor original si no es numérico
            }
        });

        console.log("🚀 Enviando datos PATCH:", usuarioActualizado);

        if (!identificacion) {
            console.error("❌ ID de usuario no válido");
            return;
        }
        
        const usuarioFinal = Object.fromEntries(
            Object.entries(usuarioActualizado).filter(([_, value]) => value !== undefined)
        );
        
        actualizarUsuario.mutate(
            { identificacion: Number(identificacion), ...usuarioFinal },
            {
                onSuccess: () => {
                    console.log("✅ Usuario actualizado correctamente");
                    navigate("/usuarios");
                },
                onError: (error) => {
                    console.error("❌ Error al actualizar usuario:", error);
                },
            }
        );
    };

    if (isLoading) return <div className="text-gray-500">Cargando datos...</div>;
    if (error) return <div className="text-red-500">Error al cargar el usuario</div>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <Formulario 
                fields={[
                    { id: 'identificacion', label: 'Identificación', type: 'text' },
                    { id: 'email', label: 'Email', type: 'email' },
                    { id: 'nombre', label: 'Nombre', type: 'text' },
                    { id: 'telefono', label: 'telefono', type: 'text' },
                    { 
                        id: "fk_id_rol", 
                        label: "Rol", 
                        type: "select", 
                        options: Array.isArray(roles) 
                            ? roles.map((rol) => ({ value: String(rol.id_rol), label: rol.nombre_rol }))
                            : []
                    }
                ]} 
                onSubmit={handleSubmit} 
                isError={actualizarUsuario.isError} 
                isSuccess={actualizarUsuario.isSuccess}
                title="Actualizar Usuario"  
                initialValues={Object.fromEntries(
                    Object.entries(formData).map(([key, value]) => [key, String(value ?? "")])
                )}  
                key={JSON.stringify(formData)}
            />
        </div>
    );
};

export default ActualizarUsuario;
