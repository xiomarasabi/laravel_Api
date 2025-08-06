import { useCrearControlFitosanitario } from '@/hooks/trazabilidad/control/useCrearControlFitosanitario';
import { useDesarrollan } from '@/hooks/trazabilidad/control/useDesarrollan';
import Formulario from '@/components/globales/Formulario';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const CrearControlFitosanitario = () => {
  const mutation = useCrearControlFitosanitario();
  const navigate = useNavigate();
  const [errorMensaje, setErrorMensaje] = useState('');

  // ✅ Usamos el hook correcto
  const { data: desarrollanList = [], isLoading: isLoadingDesarrollan } = useDesarrollan();

  // Generar opciones para el select
  const desarrollanOptions = desarrollanList.map((d) => {
    const nombrePea = d.pea?.nombre || 'Sin PEA';
    const nombreCultivo = d.cultivo?.nombre_cultivo || 'Sin Cultivo';
    return {
      value: d.id,
      label: `${nombreCultivo} - ${nombrePea}`,
    };
  });

  const formFields = [
    { id: 'fecha_control', label: 'Fecha de Control', type: 'date' },
    { id: 'descripcion', label: 'Descripción', type: 'text' },
    {
      id: 'fk_id_desarrollan',
      label: 'Selecciona el PEA y Cultivo',
      type: 'select',
      options: desarrollanOptions,
    },
  ];

  const handleSubmit = (formData: Record<string, any>) => {
    if (!formData.fecha_control || !formData.descripcion || !formData.fk_id_desarrollan) {
      setErrorMensaje('❌ Todos los campos son obligatorios.');
      return;
    }

    const nuevoControl = {
      fecha_control: formData.fecha_control,
      descripcion: formData.descripcion.trim(),
      fk_id_desarrollan: parseInt(formData.fk_id_desarrollan, 10),
    };

    mutation.mutate(nuevoControl, {
      onSuccess: () => {
        navigate('/control-fitosanitario');
      },
      onError: (error: any) => {
        setErrorMensaje('Ocurrió un error al registrar el control.');
        console.error('Error al crear control:', error?.response?.data || error.message);
      },
    });
  };

  if (isLoadingDesarrollan) {
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
