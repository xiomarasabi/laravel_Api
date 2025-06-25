import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useActualizarEspecie } from "../../../hooks/trazabilidad/especie/useActualizarEspecie";
import { useEspeciePorId } from "../../../hooks/trazabilidad/especie/useEspeciePorId";
import Formulario from "../../globales/Formulario";

const ActualizarEspecie = () => {
    const { id } = useParams();
    const { data: especie, isLoading, error } = useEspeciePorId(id);
    const actualizarEspecie = useActualizarEspecie();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nombre_comun: "",
        nombre_cientifico: "",
        descripcion: "",
        fk_id_tipo_cultivo: "", // tipo string para formulario
    });

    useEffect(() => {
        if (especie) {
            setFormData({
                nombre_comun: especie.nombre_comun ?? "",
                nombre_cientifico: especie.nombre_cientifico ?? "",
                descripcion: especie.descripcion ?? "",
                fk_id_tipo_cultivo: especie.tipo_cultivo?.id_tipo_cultivo?.toString() ?? "",
            });
        }
    }, [especie]);

    const handleSubmit = (data: { [key: string]: string }) => {
        if (!id) return;
    
        const especieActualizada = {
            id: Number(id),
            nombre_comun: data.nombre_comun.trim(),
            nombre_cientifico: data.nombre_cientifico.trim(),
            descripcion: data.descripcion.trim(),
            fk_id_tipo_cultivo: data.fk_id_tipo_cultivo ? Number(data.fk_id_tipo_cultivo) : null,
        };
    
        actualizarEspecie.mutate(especieActualizada, {
            onSuccess: () => navigate("/especies"),
            onError: (err) => console.error("Error al actualizar:", err),
        });
    };

    if (isLoading) return <p>Cargando...</p>;
    if (error) return <p>Error al cargar especie</p>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <Formulario
                title="Actualizar Especie"
                initialValues={formData}
                onSubmit={handleSubmit}
                isError={actualizarEspecie.isError}
                isSuccess={actualizarEspecie.isSuccess}
                fields={[
                    { id: "nombre_comun", label: "Nombre común", type: "text" },
                    { id: "nombre_cientifico", label: "Nombre científico", type: "text" },
                    { id: "descripcion", label: "Descripción", type: "text" },
                    { id: "fk_id_tipo_cultivo", label: "ID Tipo de Cultivo (opcional)", type: "number" },
                ]}
            />
        </div>
    );
};

export default ActualizarEspecie;
