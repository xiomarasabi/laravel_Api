// CrearEspecie.tsx
import { useState } from 'react';
import { useCrearEspecie } from '@/hooks/trazabilidad/especie/useCrearEspecie';
import { useTipoCultivos } from '@/hooks/trazabilidad/cultivo/useTipoCultivos'; // Nuevo hook
import Formulario from '@/components/globales/Formulario';
import { useNavigate } from 'react-router-dom';

const CrearEspecie = () => {
  const mutation = useCrearEspecie();
  const { data: tipoCultivos = [], isLoading } = useTipoCultivos();
  const navigate = useNavigate();
  const [errorMensaje, setErrorMensaje] = useState('');

  // Crear opciones para el select de tipo de cultivo
  const tipoCultivoOptions = tipoCultivos.map((tipo) => ({
    value: tipo.id.toString(),
    label: tipo.nombre,
  }));

  const formFields = [
    {
      id: 'nombre_comun',
      label: 'Nombre Común',
      type: 'text',
      placeholder: 'Ej: Maíz',
      required: true,
    },
    {
      id: 'nombre_cientifico',
      label: 'Nombre Científico',
      type: 'text',
      placeholder: 'Ej: Zea mays',
      required: true,
    },
    {
      id: 'descripcion',
      label: 'Descripción',
      type: 'text',
      placeholder: 'Ej: Cultivo de maíz amarillo',
      required: true,
    },
    {
      id: 'fk_id_tipo_cultivo',
      label: 'Tipo de Cultivo',
      type: 'select',
      options: [
        { value: '', label: 'Seleccione un tipo de cultivo' },
        ...tipoCultivoOptions,
      ],
      required: true,
    },
  ];

  const handleSubmit = (formData: { [key: string]: string }) => {
    if (!formData.nombre_comun?.trim()) {
      setErrorMensaje('❌ El nombre común es obligatorio.');
      return;
    }
    if (!formData.nombre_cientifico?.trim()) {
      setErrorMensaje('❌ El nombre científico es obligatorio.');
      return;
    }
    if (!formData.descripcion?.trim()) {
      setErrorMensaje('❌ La descripción es obligatoria.');
      return;
    }
    if (!formData.fk_id_tipo_cultivo) {
      setErrorMensaje('❌ Debes seleccionar un tipo de cultivo.');
      return;
    }

    const nuevaEspecie = {
      id: 0, // Incluido para compatibilidad, pero el backend lo ignora
      nombre_comun: formData.nombre_comun.trim(),
      nombre_cientifico: formData.nombre_cientifico.trim(),
      descripcion: formData.descripcion.trim(),
      fk_id_tipo_cultivo: Number(formData.fk_id_tipo_cultivo),
    };

    console.log('🚀 Enviando Especie al backend:', nuevaEspecie);

    mutation.mutate(nuevaEspecie, {
      onSuccess: () => {
        console.log('✅ Especie creada exitosamente.');
        navigate('/especies');
      },
      onError: (error: any) => {
        const msg = error?.response?.data?.message || 'Error al crear la especie';
        console.error('❌ Error al crear Especie:', error?.response?.data || error.message);
        setErrorMensaje(`❌ Error: ${msg}`);
      },
    });
  };

  if (isLoading) {
    return <div className="text-center text-gray-500">Cargando tipos de cultivo...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {errorMensaje && <p className="text-red-500 mb-2">{errorMensaje}</p>}
      {mutation.isError && (
        <p className="text-red-500 mb-2">
          Error: {mutation.error?.response?.data?.message || mutation.error?.message}
        </p>
      )}
      {mutation.isSuccess && <p className="text-green-500 mb-2">Especie creada con éxito</p>}
      <Formulario
        fields={formFields}
        onSubmit={handleSubmit}
        isError={mutation.isError}
        isSuccess={mutation.isSuccess}
        title="Registrar Nueva Especie"
      />
    </div>
  );
};

export default CrearEspecie;