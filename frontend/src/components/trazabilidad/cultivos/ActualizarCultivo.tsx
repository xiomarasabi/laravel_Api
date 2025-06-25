import { useState, useEffect } from "react";
import { useActualizarCultivo } from './../../../hooks/trazabilidad/cultivo/useActualizarCultivo';
import { useNavigate, useParams } from "react-router-dom";
import { useCultivoPorId } from "../../../hooks/trazabilidad/cultivo/useCultivoPorId";
import Formulario from "../../globales/Formulario";

const ActualizarCultivo = () => {
    const { id } = useParams();
    const { data: cultivo, isLoading, error } = useCultivoPorId(id);
    const actualizarCultivo = useActualizarCultivo();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState<{ [key: string]: string }>({
        nombre_cultivo: "",
        fecha_plantacion: "",
        descripcion: "",
        fk_id_especie: "",
        fk_id_semillero: "",
    });

    useEffect(() => {
        if (cultivo?.cultivo?.length > 0) {
            const datos = cultivo.cultivo[0]; // ✅ extraemos el objeto real
    
            console.log("🔄 Actualizando formulario con:", datos);
    
            setFormData({
                nombre_cultivo: datos.nombre_cultivo ?? "",
                fecha_plantacion: datos.fecha_plantacion?.slice(0, 10) ?? "",
                descripcion: datos.descripcion ?? "",
                fk_id_especie: datos.fk_id_especie?.id_especie ? String(datos.fk_id_especie.id_especie) : "",
                fk_id_semillero: datos.fk_id_semillero?.id_semillero ? String(datos.fk_id_semillero.id_semillero) : "",
            });
        }
    }, [cultivo]);
        
    const handleSubmit = (data: { [key: string]: string }) => {
        if (!id) return;

        const cultivoActualizado = {
            id_cultivo: Number(id),
            nombre_cultivo: data.nombre_cultivo || "",
            fecha_plantacion: data.fecha_plantacion || "",
            descripcion: data.descripcion || "",
            fk_id_especie: parseInt(data.fk_id_especie) || 0,
            fk_id_semillero: parseInt(data.fk_id_semillero) || 0,
        };

        actualizarCultivo.mutate(cultivoActualizado, {
            onSuccess: () => {
                navigate("/cultivo");
            },
            onError: (error) => {
                console.error("❌ Error al actualizar cultivo:", error);
            },
        });
    };

    if (isLoading) return <div className="text-gray-500">Cargando datos...</div>;
    if (error) return <div className="text-red-500">Error al cargar el cultivo</div>;

    const isFormReady = !!cultivo;


    return (
        <div className="max-w-4xl mx-auto p-4">
            {isFormReady ? (
                <Formulario 
                
                    fields={[
                        { id: 'nombre_cultivo', label: 'Nombre del Cultivo', type: 'text' },
                        { id: 'fecha_plantacion', label: 'Fecha de Plantación', type: 'date' },
                        { id: 'descripcion', label: 'Descripción', type: 'text' },
                        { id: 'fk_id_especie', label: 'ID de Especie', type: 'number' },
                        { id: 'fk_id_semillero', label: 'ID de Semillero', type: 'number' },
                    ]} 
                    onSubmit={handleSubmit} 
                    isError={actualizarCultivo.isError} 
                    isSuccess={actualizarCultivo.isSuccess}
                    title="Actualizar Cultivo"  
                    initialValues={formData}  
                    key={JSON.stringify(formData)} // Forzar re-render
                />
            ) : (
                <div className="text-gray-500">Preparando formulario...</div>
            )}
        </div>
    );
};

export default ActualizarCultivo;
