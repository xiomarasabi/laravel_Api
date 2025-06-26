import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useActualizarInsumo, Insumo } from "@/hooks/inventario/insumos/useActualizarInsumos";
import { useInsumo } from "../../../hooks/inventario/insumos/useInsumo";
import Formulario from "../../globales/Formulario";

const ActualizarInsumo = () => {
    const { id } = useParams<{ id: string }>();
    const { data: insumos, isLoading, error } = useInsumo();
    const mutation = useActualizarInsumo();
    const [selectedInsumo, setSelectedInsumo] = useState<Insumo | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && insumos && id) {
            const insumoId = Number(id);
            const insumo = insumos.find((i: Insumo) => i.id === insumoId);
            setSelectedInsumo(insumo || null);
        }
    }, [insumos, isLoading, id]);

    if (isLoading) return <div>Cargando insumos...</div>;
    if (error instanceof Error) return (
        <div className="p-10">
            <h2 className="text-xl font-bold mb-4">Error</h2>
            <p>Error al cargar los insumos: {error.message}</p>
            <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => navigate('/insumos')}
            >
                Volver a Insumos
            </button>
        </div>
    );
    if (!selectedInsumo) return (
        <div className="p-10">
            <h2 className="text-xl font-bold mb-4">Insumo no encontrado</h2>
            <p>No se encontró un insumo con el ID proporcionado: {id}</p>
            <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => navigate('/insumos')}
            >
                Volver a Insumos
            </button>
        </div>
    );

    const formFields = [
        { id: "nombre", label: "Nombre", type: "text" },
        { id: "tipo", label: "Tipo", type: "text" },
        { id: "precio_unidad", label: "Precio por Unidad", type: "number" },
        { id: "cantidad", label: "Cantidad", type: "number" },
        { id: "fecha_vencimiento", label: "Fecha de Vencimiento", type: "date" },
        { id: "unidad_medida", label: "Unidad de Medida", type: "text" },
    ];

    const handleSubmit = (formData: { [key: string]: string }) => {
        const updatedInsumo: Insumo = {
            id: selectedInsumo.id,
            nombre: formData.nombre || selectedInsumo.nombre,
            tipo: formData.tipo || selectedInsumo.tipo,
            precio_unidad: formData.precio_unidad ? parseFloat(formData.precio_unidad) : selectedInsumo.precio_unidad,
            cantidad: formData.cantidad ? parseInt(formData.cantidad, 10) : selectedInsumo.cantidad,
            fecha_vencimiento: formData.fecha_vencimiento || selectedInsumo.fecha_vencimiento.toString(),
            unidad_medida: formData.unidad_medida || selectedInsumo.unidad_medida,
        };

        mutation.mutate(updatedInsumo, {
            onSuccess: () => {
                navigate("/insumos");
            },
            onError: (error) => {
                console.error("Error al actualizar el insumo:", error);
                alert("Error al actualizar el insumo. Verifica los datos e intenta de nuevo.");
            },
        });
    };

    return (
        <div className="p-10">
            <Formulario
                fields={formFields}
                onSubmit={handleSubmit}
                isError={mutation.isError}
                isSuccess={mutation.isSuccess}
                title="Actualizar Insumo"
                initialValues={{
                    nombre: selectedInsumo.nombre,
                    tipo: selectedInsumo.tipo,
                    precio_unidad: selectedInsumo.precio_unidad.toString(),
                    cantidad: selectedInsumo.cantidad.toString(),
                    fecha_vencimiento: selectedInsumo.fecha_vencimiento instanceof Date
                        ? selectedInsumo.fecha_vencimiento.toISOString().split('T')[0]
                        : selectedInsumo.fecha_vencimiento,
                    unidad_medida: selectedInsumo.unidad_medida,
                }}
            />
        </div>
    );
};

export default ActualizarInsumo;