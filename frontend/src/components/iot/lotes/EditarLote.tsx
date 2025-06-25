import { useState, useEffect } from "react";
import { useEditarLote } from "@/hooks/iot/lote/useEditarLote";
import { useNavigate, useParams } from "react-router-dom";
import { useLotePorId } from "@/hooks/iot/lote/useLotePorId";
import Formulario from "../../globales/Formulario";

const EditarLote = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    if (!id) {
        console.error("❌ Error: ID no válido");
        return <div className="text-red-500">Error: ID no válido</div>;
    }

    const { data: lote, isLoading, error } = useLotePorId(id);
    const actualizarLote = useEditarLote();
    
    const [formData, setFormData] = useState({
        fk_id_ubicacion: "",
        dimension: "",
        nombre_lote: "",
        estado: "",
    });

    const [formError, setFormError] = useState<string | null>(null);

    useEffect(() => {
        if (lote) {
            console.log("🔄 Cargando datos del Lote:", lote);
            setFormData({
                fk_id_ubicacion: lote.fk_id_ubicacion ? lote.fk_id_ubicacion.toString() : "",
                dimension: lote.dimension ? lote.dimension.toString() : "",
                nombre_lote: lote.nombre_lote || "",
                estado: lote.estado || "Activo", // Default to "Activo" if empty
            });
        }
    }, [lote]);

    const handleSubmit = (data: { [key: string]: string }) => {
        if (!id) return;

        // Validate inputs
        const errors: string[] = [];
        if (!data.fk_id_ubicacion || isNaN(Number(data.fk_id_ubicacion))) {
            errors.push("La ubicación es requerida y debe ser un número válido.");
        }
        if (!data.dimension || isNaN(Number(data.dimension))) {
            errors.push("La dimensión es requerida y debe ser un número válido.");
        }
        if (!data.nombre_lote.trim()) {
            errors.push("El nombre del lote es requerido.");
        }
        if (!data.estado || !["Activo", "Inactivo"].includes(data.estado)) {
            errors.push("El estado debe ser 'Activo' o 'Inactivo'.");
        }

        if (errors.length > 0) {
            setFormError(errors.join(" "));
            console.error("⚠️ Datos inválidos:", errors);
            return;
        }

        const loteActualizado = {
            id: Number(id),
            fk_id_ubicacion: Number(data.fk_id_ubicacion),
            dimension: Number(data.dimension),
            nombre_lote: data.nombre_lote.trim(),
            estado: data.estado,
        };

        console.log("🚀 Enviando Lote actualizado:", loteActualizado);

        actualizarLote.mutate(loteActualizado, {
            onSuccess: () => {
                console.log("✅ Lote actualizado correctamente");
                setFormError(null);
                navigate("/lotes");
            },
            onError: (err) => {
                setFormError(err.message || "Error al actualizar el lote.");
                console.error("❌ Error al actualizar:", err);
            },
        });
    };

    if (isLoading) return <div className="text-gray-500">Cargando datos...</div>;
    if (error) return <div className="text-red-500">Error al cargar el Lote: {error.message}</div>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            {formError && <div className="text-red-500 mb-4">{formError}</div>}
            <Formulario 
                fields={[
                    { id: "fk_id_ubicacion", label: "Ubicación", type: "number" },
                    { id: "dimension", label: "Dimensión", type: "number" },
                    { id: "nombre_lote", label: "Nombre del Lote", type: "text" },
                    {
                        id: "estado",
                        label: "Estado",
                        type: "select",
                        options: [
                            { value: "Activo", label: "Activo" },
                            { value: "Inactivo", label: "Inactivo" },
                        ],
                    },
                ]}
                onSubmit={handleSubmit}
                isError={actualizarLote.isError}
                isSuccess={actualizarLote.isSuccess}
                title="Actualizar Lote"
                initialValues={formData}
                key={JSON.stringify(formData)}
            />
        </div>
    );
};

export default EditarLote;