import { useState } from 'react';
import { useCrearResiduo, CrearResiduoInput } from '@/hooks/trazabilidad/residuo/useCrearResiduo';
import Formulario from '@/components/globales/Formulario';
import { useNavigate } from 'react-router-dom';
import { useCultivo } from '@/hooks/trazabilidad/cultivo/useCultivo';
import { useResiduos } from '@/hooks/trazabilidad/residuo/useResiduos';

// Interfaz para los campos del formulario
interface FormField {
    id: string;
    label: string;
    type: 'text' | 'date' | 'select';
    options?: { value: string | number; label: string }[];
}

const CrearResiduo = () => {
    const mutation = useCrearResiduo();
    const navigate = useNavigate();
    const { data: cultivos = [], isLoading: isLoadingCultivos } = useCultivo();
    const { data: residuos = [], isLoading: isLoadingResiduos } = useResiduos();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Validar cultivos y residuos
    const cultivosValidos = Array.isArray(cultivos)
        ? cultivos.filter((c) => c?.id_cultivo && c?.nombre_cultivo)
        : [];
    const residuosValidos = Array.isArray(residuos)
        ? residuos.filter((r) => r?.fk_id_tipo_residuo?.id_tipo_residuo && r?.fk_id_tipo_residuo?.nombre_residuo)
        : [];

    // Obtener cultivos únicos
    const cultivosUnicos = Array.from(
        new Map(cultivosValidos.map((cultivo) => [cultivo.id_cultivo, cultivo])).values()
    );

    // Obtener tipos de residuos únicos
    const tiposResiduosUnicos = Array.from(
        new Map(
            residuosValidos.map((residuo) => [residuo.fk_id_tipo_residuo.id_tipo_residuo, residuo.fk_id_tipo_residuo])
        ).values()
    );

    // Mostrar mensaje de carga si los datos no están listos
    if (isLoadingCultivos || isLoadingResiduos) {
        return <div className="text-center text-gray-500 py-4">Cargando datos...</div>;
    }

    // Validar que haya datos disponibles
    if (cultivosUnicos.length === 0 || tiposResiduosUnicos.length === 0) {
        return (
            <div className="text-center text-red-500 py-4">
                No hay cultivos o tipos de residuos disponibles. Por favor, crea algunos primero.
            </div>
        );
    }

    // Definir los campos del formulario
    const formFields: FormField[] = [
        { id: 'nombre', label: 'Nombre del Residuo', type: 'text' },
        { id: 'fecha', label: 'Fecha', type: 'date' },
        { id: 'descripcion', label: 'Descripción', type: 'text' },
        {
            id: 'fk_id_cultivo',
            label: 'Cultivo',
            type: 'select',
            options: cultivosUnicos.map((cultivo) => ({
                value: cultivo.id_cultivo,
                label: cultivo.nombre_cultivo,
            })),
        },
        {
            id: 'fk_id_tipo_residuo',
            label: 'Tipo de Residuo',
            type: 'select',
            options: tiposResiduosUnicos.map((tipo) => ({
                value: tipo.id_tipo_residuo,
                label: tipo.nombre_residuo,
            })),
        },
    ];

    // Manejo del formulario
    const handleSubmit = (formData: { [key: string]: string }) => {
        setErrorMessage(null);

        // Validar campos obligatorios
        if (
            !formData.nombre ||
            !formData.fecha ||
            !formData.fk_id_cultivo ||
            !formData.fk_id_tipo_residuo
        ) {
            setErrorMessage('Todos los campos son obligatorios.');
            return;
        }

        const nuevoResiduo: CrearResiduoInput = {
            nombre: formData.nombre,
            fecha: new Date(formData.fecha).toISOString().split('T')[0],
            descripcion: formData.descripcion || '',
            fk_id_cultivo: parseInt(formData.fk_id_cultivo),
            fk_id_tipo_residuo: parseInt(formData.fk_id_tipo_residuo),
        };

        mutation.mutate(nuevoResiduo, {
            onSuccess: () => {
                navigate('/residuos');
            },
            onError: (error: any) => {
                setErrorMessage(
                    error.response?.data?.message || 'Error al crear el residuo. Inténtalo de nuevo.'
                );
            },
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            {errorMessage && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
                    {errorMessage}
                </div>
            )}
            {mutation.isPending && (
                <div className="mb-4 p-4 bg-blue-100 text-blue-700 rounded">
                    Creando residuo...
                </div>
            )}
            {mutation.isSuccess && (
                <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
                    Residuo creado exitosamente.
                </div>
            )}
            <Formulario
                fields={formFields}
                onSubmit={handleSubmit}
                isError={mutation.isError}
                isSuccess={mutation.isSuccess}
                title="Registrar Nuevo Residuo"
            />
        </div>
    );
};

export default CrearResiduo;