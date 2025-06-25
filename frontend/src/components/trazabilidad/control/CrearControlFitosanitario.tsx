import { useCrearControlFitosanitario } from '@/hooks/trazabilidad/control/useCrearControlFitosanitario';
import { useControlFitosanitario } from '@/hooks/trazabilidad/control/useControlFitosanitario';
import Formulario from '@/components/globales/Formulario';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const CrearControlFitosanitario = () => {
    const mutation = useCrearControlFitosanitario();
    const navigate = useNavigate();
    const [errorMensaje, setErrorMensaje] = useState("");

    // Obtener lista de controles fitosanitarios
    const { data: controles = [], isLoading: isLoadingControles } = useControlFitosanitario();

    // Extraer opciones únicas para el select de desarrollan
    const desarrollanOptions = Array.from(new Map(controles.map((control) => {
        const desarrollan = control.desarrollan;
        const nombrePea = desarrollan?.pea?.nombre || '';
        const nombreCultivo = desarrollan?.cultivo?.nombre_cultivo || '';
        const label = nombreCultivo && nombrePea ? `${nombreCultivo} - ${nombrePea}` : nombreCultivo || nombrePea || `Desarrollan ID: ${desarrollan?.id_desarrollan}`;
        return [desarrollan?.id_desarrollan, { value: desarrollan?.id_desarrollan, label }];
    })).values());

    // Campos del formulario
    const formFields = [
        { id: 'fecha_control', label: 'Fecha de Control', type: 'date' },
        { id: 'descripcion', label: 'Descripción', type: 'text' },
        {
            id: 'fk_id_desarrollan',
            label: 'Selecciona el PEA y Cultivo',
            type: 'select',
            options: desarrollanOptions,
        },
        {id: 'detalle', label: 'detalle', type: 'text' },
    ];

    const handleSubmit = (formData: Record<string, any>) => {
        if (!formData.fecha_control || !formData.descripcion  || formData.detalle, !formData.fk_id_desarrollan ) {
            setErrorMensaje("❌ Todos los campos son obligatorios.");
            return;
        }

        const nuevoControl = {
            fecha_control: formData.fecha_control,
            descripcion: formData.descripcion.trim(),
            detalle: formData.detalle.trim(),
            fk_id_desarrollan: parseInt(formData.fk_id_desarrollan, 10),
            
        };

        console.log("🚀 Enviando Control Fitosanitario al backend:", nuevoControl);

        mutation.mutate(nuevoControl, {
            onSuccess: () => {
                console.log("✅ Control Fitosanitario creado exitosamente.");
                navigate("/control-fitosanitario");
            },
            onError: (error: any) => {
                console.error("❌ Error al crear Control Fitosanitario:", error?.response?.data || error.message);
                setErrorMensaje("Ocurrió un error al registrar el control.");
            },
        });
        
    };

    if (isLoadingControles) {
        return <div className="text-center text-gray-500">Cargando desarrollan...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            {errorMensaje && <p className="text-red-500 mb-2">{errorMensaje}</p>}
            <Formulario 
                fields={formFields} 
                onSubmit={handleSubmit} 
                isError={mutation.isError} 
                isSuccess={mutation.isSuccess}
                title="Registrar Control Fitosanitario"
            />
        </div>
    );
};

export default CrearControlFitosanitario;
