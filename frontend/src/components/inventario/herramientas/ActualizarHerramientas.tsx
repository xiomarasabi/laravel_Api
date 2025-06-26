import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useHerramientas, Herramientas } from "../../../hooks/inventario/herramientas/useHerramientas";
import { useActualizarHerramientas } from "../../../hooks/inventario/herramientas/useActualizarHerramientas";
import Formulario from "../../globales/Formulario";

const ActualizarHerramientas = () => {
    const { id } = useParams<{ id: string }>();
    const { data: herramientas, isLoading, error } = useHerramientas();
    const mutation = useActualizarHerramientas();
    const [selectedHerramienta, setSelectedHerramienta] = useState<Herramientas | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        console.log("useEffect ejecutado - isLoading:", isLoading, "herramientas:", herramientas, "id:", id); // Depuración adicional
        if (!isLoading && herramientas && id) {
            console.log("Herramientas disponibles:", herramientas); // Depuración
            const herramienta = herramientas.find((h: Herramientas) => h.id === Number(id));
            console.log("Herramienta encontrada:", herramienta); // Depuración
            setSelectedHerramienta(herramienta || null);
        }
    }, [herramientas, isLoading, id]);

    if (isLoading) {
        console.log("Cargando datos...");
        return <div>Cargando herramientas...</div>;
    }
    if (error instanceof Error) {
        console.log("Error al cargar:", error.message);
        return (
            <div className="p-10">
                <h2 className="text-xl font-bold mb-4">Error</h2>
                <p>Error al cargar herramientas: {error.message}</p>
                <button
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => navigate('/herramientas')}
                >
                    Volver a Herramientas
                </button>
            </div>
        );
    }
    if (!selectedHerramienta) {
        console.log("Herramienta no encontrada - ID:", id, "Herramientas:", herramientas);
        return (
            <div className="p-10">
                <h2 className="text-xl font-bold mb-4">Herramienta no encontrada</h2>
                <p>No se encontró una herramienta con el ID proporcionado: {id}</p>
                <button
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => navigate('/herramientas')}
                >
                    Volver a Herramientas
                </button>
            </div>
        );
    }

    const formFields = [
        { id: "nombre", label: "Nombre", type: "text" },
        { id: "cantidad", label: "Cantidad", type: "number" },
        { id: "estado", label: "Estado", type: "text" },
        { id: "precio", label: "Precio", type: "number" },
    ];

    const handleSubmit = (formData: { [key: string]: string }) => {
        const herramientaActualizada: Partial<Herramientas> & { id: number } = {
            id: selectedHerramienta.id,
            nombre: formData.nombre || selectedHerramienta.nombre,
            cantidad: formData.cantidad ? parseInt(formData.cantidad, 10) : selectedHerramienta.cantidad,
            estado: formData.estado || selectedHerramienta.estado,
            precio: formData.precio ? parseFloat(formData.precio) : selectedHerramienta.precio,
        };

        console.log("Enviando actualización:", herramientaActualizada); // Depuración
        mutation.mutate(herramientaActualizada, {
            onSuccess: () => {
                navigate('/herramientas');
            },
            onError: (error) => {
                console.error("Error al actualizar la herramienta:", error);
                alert("Error al actualizar la herramienta. Verifica los datos e intenta de nuevo.");
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
                title="Actualizar Herramienta"
                initialValues={{
                    nombre: selectedHerramienta.nombre,
                    cantidad: selectedHerramienta.cantidad.toString(),
                    estado: selectedHerramienta.estado,
                    precio: selectedHerramienta.precio.toString(),
                }}
            />
        </div>
    );
};

export default ActualizarHerramientas;