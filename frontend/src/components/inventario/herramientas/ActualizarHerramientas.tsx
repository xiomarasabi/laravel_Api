import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useHerramientas, Herramientas } from "../../../hooks/inventario/herramientas/useHerramientas";
import { useActualizarHerramientas } from "../../../hooks/inventario/herramientas/useActualizarHerramientas";
import Formulario from "../../globales/Formulario";

const ActualizarHerramientas = () => {
    const { id_herramienta } = useParams<{ id_herramienta: string }>();
    const { data: herramientas, isLoading, error } = useHerramientas();
    const mutation = useActualizarHerramientas();
    const [selectedHerramienta, setSelectedHerramienta] = useState<Herramientas | null>(null);
    const navigate = useNavigate();

    // Buscar la herramienta seleccionada cuando se cargan los datos
    useEffect(() => {
        if (!isLoading && herramientas && id_herramienta) {
            const herramienta = herramientas.find(
                (h: Herramientas) => h.id_herramienta === Number(id_herramienta)
            );
            if (herramienta) {
                setSelectedHerramienta({
                    ...herramienta,
                    fecha_prestamo: herramienta.fecha_prestamo
                        ? new Date(herramienta.fecha_prestamo).toISOString().split('T')[0]
                        : '',
                });
            } else {
                setSelectedHerramienta(null);
            }
        }
    }, [herramientas, isLoading, id_herramienta]);

    if (isLoading) return <div>Cargando herramientas...</div>;
    if (error instanceof Error) return (
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
    if (!selectedHerramienta) return (
        <div className="p-10">
            <h2 className="text-xl font-bold mb-4">Herramienta no encontrada</h2>
            <p>No se encontró una herramienta con el ID proporcionado.</p>
            <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => navigate('/herramientas')}
            >
                Volver a Herramientas
            </button>
        </div>
    );

    const formFields = [
        { id: "nombre_h", label: "Nombre", type: "text" },
        { id: "estado", label: "Estado", type: "text" },
        { id: "fecha_prestamo", label: "Fecha de Préstamo", type: "date" },
    ];

    const handleSubmit = (formData: { [key: string]: string }) => {
        const herramientaActualizada: Herramientas = {
            ...selectedHerramienta,
            ...formData,
            id_herramienta: selectedHerramienta.id_herramienta,
        };

        mutation.mutate(herramientaActualizada, {
            onSuccess: () => {
                navigate('/herramientas');
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
                    nombre_h: selectedHerramienta.nombre_h,
                    estado: selectedHerramienta.estado,
                    fecha_prestamo: selectedHerramienta.fecha_prestamo,
                }}
            />
        </div>
    );
};

export default ActualizarHerramientas;