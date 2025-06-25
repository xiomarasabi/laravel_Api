import { useState, useEffect } from 'react';
import { useActualizarResiduo, ActualizarResiduoInput } from '@/hooks/trazabilidad/residuo/useActualizarResiduo';
import Formulario from '@/components/globales/Formulario';
import { useNavigate, useParams } from 'react-router-dom';
import { useCultivo } from '@/hooks/trazabilidad/cultivo/useCultivo';
import { useResiduos } from '@/hooks/trazabilidad/residuo/useResiduos';

interface FormField {
    id: string;
    label: string;
    type: 'text' | 'date' | 'select';
    options?: { value: string | number; label: string }[];
}

const ActualizarResiduo = () => {
    const { id } = useParams<{ id: string }>();
    const residuoId = parseInt(id || '0');
    const mutation = useActualizarResiduo();
    const navigate = useNavigate();
    const { data: cultivos = [], isLoading: isLoadingCultivos } = useCultivo();
    const { data: residuos = [], isLoading: isLoadingResiduos } = useResiduos();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [initialValues, setInitialValues] = useState<{ [key: string]: string } | null>(null);

    const residuo = residuos.find((r) => r.id_residuo === residuoId);

    const cultivosValidos = Array.isArray(cultivos)
        ? cultivos.filter((c) => c?.id_cultivo && c?.nombre_cultivo)
        : [];
    const residuosValidos = Array.isArray(residuos)
        ? residuos.filter((r) => r?.fk_id_tipo_residuo?.id_tipo_residuo && r?.fk_id_tipo_residuo?.nombre_residuo)
        : [];

    const cultivosUnicos = Array.from(
        new Map(cultivosValidos.map((cultivo) => [cultivo.id_cultivo, cultivo])).values()
    );

    const tiposResiduosUnicos = Array.from(
        new Map(
            residuosValidos.map((residuo) => [residuo.fk_id_tipo_residuo.id_tipo_residuo, residuo.fk_id_tipo_residuo])
        ).values()
    );

    useEffect(() => {
        if (residuo) {
            const initial = {
                nombre: residuo.nombre || '',
                fecha: residuo.fecha ? new Date(residuo.fecha).toISOString().split('T')[0] : '',
                descripcion: residuo.descripcion || '',
                fk_id_cultivo: residuo.fk_id_cultivo?.id_cultivo?.toString() || '',
                fk_id_tipo_residuo: residuo.fk_id_tipo_residuo?.id_tipo_residuo?.toString() || '',
            };
            setInitialValues(initial);
            console.log('Valores iniciales:', initial);
        }
    }, [residuo]);

    if (isLoadingCultivos || isLoadingResiduos) {
        return <div className="text-center text-gray-500 py-4">Cargando datos...</div>;
    }

    if (!residuo) {
        return (
            <div className="text-center text-red-500 py-4">
                Residuo no encontrado.
            </div>
        );
    }

    if (cultivosUnicos.length === 0 || tiposResiduosUnicos.length === 0) {
        return (
            <div className="text-center text-red-500 py-4">
                No hay cultivos o tipos de residuos disponibles. Por favor, crea algunos primero.
            </div>
        );
    }

    if (!initialValues) {
        return <div className="text-center text-gray-500 py-4">Cargando datos del residuo...</div>;
    }

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

    const handleSubmit = async (formData: { [key: string]: string }) => {
        setErrorMessage(null);

        if (
            !formData.nombre ||
            !formData.fecha ||
            !formData.fk_id_cultivo ||
            !formData.fk_id_tipo_residuo
        ) {
            setErrorMessage('Todos los campos obligatorios deben estar llenos.');
            return;
        }

        const residuoActualizado: ActualizarResiduoInput = {
            nombre: formData.nombre,
            fecha: formData.fecha,
            descripcion: formData.descripcion || '',
            fk_id_cultivo: parseInt(formData.fk_id_cultivo),
            fk_id_tipo_residuo: parseInt(formData.fk_id_tipo_residuo),
        };

        console.log('Enviando al hook:', residuoActualizado);

        mutation.mutate({ id: residuoId, ...residuoActualizado }, {
            onSuccess: async () => {
                console.log('Mutación exitosa, navegando a /residuos');
                navigate('/residuos');
            },
            onError: (error: any) => {
                setErrorMessage(
                    error.response?.data?.message || 'Error al actualizar el residuo. Inténtalo de nuevo.'
                );
                console.error('Error en mutación:', error);
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
                    Actualizando residuo...
                </div>
            )}
            {mutation.isSuccess && (
                <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
                    Residuo actualizado exitosamente.
                </div>
            )}
            <Formulario
                fields={formFields}
                onSubmit={handleSubmit}
                isError={mutation.isError}
                isSuccess={mutation.isSuccess}
                title="Actualizar Residuo"
                initialValues={initialValues}
            />
        </div>
    );
};

export default ActualizarResiduo;