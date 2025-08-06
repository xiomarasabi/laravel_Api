// CrearUbicacion.tsx
import { useState } from 'react';
import { useCrearUbicacion } from '@/hooks/iot/ubicacion/useCrearUbicacion';
import Formulario from '@/components/globales/Formulario';
import { useNavigate } from 'react-router-dom';

const CrearUbicacion = () => {
  const mutation = useCrearUbicacion();
  const navigate = useNavigate();
  const [errorMensaje, setErrorMensaje] = useState('');

  const formFields = [
    {
      id: 'latitud',
      label: 'Latitud',
      type: 'number',
      placeholder: 'Ej: 4.60971000',
      step: '0.00000001',
      min: '-90',
      max: '90',
    },
    {
      id: 'longitud',
      label: 'Longitud',
      type: 'number',
      placeholder: 'Ej: -74.08175000',
      step: '0.00000001',
      min: '-180',
      max: '180',
    },
  ];

  const handleSubmit = (formData: Record<string, any>) => {
    if (isNaN(formData.latitud) || formData.latitud < -90 || formData.latitud > 90) {
      setErrorMensaje('❌ La latitud debe ser un número entre -90 y 90.');
      return;
    }
    if (isNaN(formData.longitud) || formData.longitud < -180 || formData.longitud > 180) {
      setErrorMensaje('❌ La longitud debe ser un número entre -180 y 180.');
      return;
    }

    const nuevaUbicacion = {
      latitud: Number(formData.latitud),
      longitud: Number(formData.longitud),
    };

    console.log('🚀 Enviando Ubicación al backend:', nuevaUbicacion);

    mutation.mutate(nuevaUbicacion, {
      onSuccess: () => {
        console.log('✅ Ubicación creada exitosamente.');
        navigate('/ubicaciones');
      },
      onError: (error: any) => {
        console.error('❌ Error al crear Ubicación:', error?.response?.data || error.message);
        setErrorMensaje('Ocurrió un error al registrar la ubicación.');
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {errorMensaje && <p className="text-red-500 mb-2">{errorMensaje}</p>}
      <Formulario
        fields={formFields}
        onSubmit={handleSubmit}
        isError={mutation.isError}
        isSuccess={mutation.isSuccess}
        title="Registrar Ubicación"
      />
    </div>
  );
};

export default CrearUbicacion;