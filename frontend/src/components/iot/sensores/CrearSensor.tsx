import { Sensores } from '@/hooks/iot/sensores/useCrearSensores';
import { useCrearSensores } from '../../../hooks/iot/sensores/useCrearSensores';
import Formulario from '../../globales/Formulario';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const CrearSensor = () => {
  const mutation = useCrearSensores();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const TIPO_SENSOR_OPTIONS = [
    { value: 'TEMPERATURA', label: 'Temperatura' },
    { value: 'HUMEDAD_AMBIENTAL', label: 'Humedad ambiental' },
    { value: 'ILUMINACION', label: 'Iluminación' },
    { value: 'HUMEDAD_TERRENO', label: 'Humedad terreno' },
    { value: 'VELOCIDAD_VIENTO', label: 'Velocidad viento' },
    { value: 'NIVEL_DE_PH', label: 'Nivel de pH' },
  ];

  const formFields = [
    { id: 'nombre_sensor', label: 'Nombre del Sensor', type: 'text' },
    {
      id: 'tipo_sensor',
      label: 'Tipo de Sensor',
      type: 'select',
      options: TIPO_SENSOR_OPTIONS,
    },
    { id: 'unidad_medida', label: 'Unidad de Medida', type: 'text' },
    { id: 'descripcion', label: 'Descripción', type: 'text' },
    { id: 'medida_minima', label: 'Medida Mínima', type: 'number' },
    { id: 'medida_maxima', label: 'Medida Máxima', type: 'number' },
  ];

  const handleSubmit = (formData: { [key: string]: string }) => {
    setErrorMessage(null);

    if (
      !formData.nombre_sensor ||
      !formData.tipo_sensor ||
      !formData.unidad_medida ||
      !formData.descripcion ||
      !formData.medida_minima ||
      !formData.medida_maxima
    ) {
      setErrorMessage('Por favor, completa todos los campos requeridos.');
      return;
    }

    const newSensor: Sensores = {
      nombre_sensor: formData.nombre_sensor,
      tipo_sensor: formData.tipo_sensor,
      unidad_medida: formData.unidad_medida,
      descripcion: formData.descripcion,
      medida_minima: parseFloat(formData.medida_minima),
      medida_maxima: parseFloat(formData.medida_maxima),
    };

    console.log('Enviando nuevo sensor:', newSensor);
    mutation.mutate(newSensor, {
      onSuccess: (data) => {
        console.log('✅ Sensor creado, datos:', data);
        console.log('Intentando redirigir a /iot/sensores');
        try {
          navigate('/iot/sensores');
          console.log('✅ Redirección ejecutada');
        } catch (err) {
          console.error('❌ Error al redirigir:', err);
        }
      },
      onError: (error: any) => {
        console.error('❌ Error al crear el sensor:', error.message, error.response?.data);
        setErrorMessage(
          error.response?.data?.error || 'Ocurrió un error al crear el sensor. Intenta de nuevo.'
        );
      },
    });
  };

  return (
    <div className="p-10">
      {errorMessage && (
        <div className="mb-4 text-red-500 text-center">{errorMessage}</div>
      )}
      {mutation.isPending ? (
        <div className="text-center text-gray-600">Creando sensor...</div>
      ) : (
        <Formulario
          fields={formFields}
          onSubmit={handleSubmit}
          isError={mutation.isError || !!errorMessage}
          isSuccess={mutation.isSuccess}
          title="Crear Sensor"
        />
      )}
    </div>
  );
};

export default CrearSensor;