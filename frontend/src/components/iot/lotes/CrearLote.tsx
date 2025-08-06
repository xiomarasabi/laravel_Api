// CrearLote.tsx
import { useState } from 'react';
import { useCrearLote } from '@/hooks/iot/lote/useCrearLote';
import { useUbicaciones } from '@/hooks/iot/ubicacion/useUbicacion'; // Ajusta la ruta según tu estructura
import Formulario from '@/components/globales/Formulario';
import { useNavigate } from 'react-router-dom';

export interface Lote {
  id?: number; // Opcional, ya que el backend lo genera
  dimension: number; // Cambiado de string a number
  nombre_lote: string;
  fk_id_ubicacion: number;
  estado: string;
}

const CrearLote = () => {
  const { mutate, isError, isSuccess, error } = useCrearLote();
  const { data: ubicaciones = [], isLoading: isLoadingUbicaciones } = useUbicaciones();
  const navigate = useNavigate();
  const [errorMensaje, setErrorMensaje] = useState('');

  // Crear opciones para el select de ubicaciones
  const ubicacionOptions = ubicaciones.map((ubicacion) => ({
    value: ubicacion.id_ubicacion,
    label: `Lat: ${ubicacion.latitud.toFixed(6)}, Lon: ${ubicacion.longitud.toFixed(6)}`,
  }));

  const formFields = [
    {
      id: 'fk_id_ubicacion',
      label: 'Ubicación',
      type: 'select',
      options: [
        { value: '', label: 'Seleccione una ubicación' },
        ...ubicacionOptions,
      ],
    },
    {
      id: 'dimension',
      label: 'Dimensión (m²)',
      type: 'number',
      step: '0.01',
      min: '0.01',
      placeholder: 'Ej: 120.50',
    },
    {
      id: 'nombre_lote',
      label: 'Nombre del Lote',
      type: 'text',
      placeholder: 'Ej: Lote 1',
    },
    {
      id: 'estado',
      label: 'Estado',
      type: 'select',
      options: [
        { value: 'Activo', label: 'Activo' },
        { value: 'Inactivo', label: 'Inactivo' },
      ],
    },
  ];

  const handleSubmit = (formData: { [key: string]: string }) => {
    if (!formData.fk_id_ubicacion) {
      setErrorMensaje('❌ Debes seleccionar una ubicación.');
      return;
    }
    if (!formData.dimension || isNaN(Number(formData.dimension)) || Number(formData.dimension) < 0.01) {
      setErrorMensaje('❌ La dimensión debe ser un número mayor o igual a 0.01.');
      return;
    }
    if (!formData.nombre_lote || formData.nombre_lote.trim() === '') {
      setErrorMensaje('❌ El nombre del lote es obligatorio.');
      return;
    }
    if (!['Activo', 'Inactivo'].includes(formData.estado)) {
      setErrorMensaje('❌ El estado debe ser Activo o Inactivo.');
      return;
    }

    const nuevoLote: Lote = {
      id: 0, // Incluido para compatibilidad, pero el backend lo ignora
      fk_id_ubicacion: Number(formData.fk_id_ubicacion),
      dimension: Number(formData.dimension), // Convertir a number
      nombre_lote: formData.nombre_lote.trim(),
      estado: formData.estado,
    };

    console.log('🚀 Enviando Lote al backend:', nuevoLote);

    mutate(nuevoLote, {
      onSuccess: () => {
        console.log('✅ Lote creado exitosamente.');
        navigate('/Lotes');
      },
      onError: (error: any) => {
        console.error('❌ Error al crear Lote:', error?.response?.data || error.message);
        setErrorMensaje('Ocurrió un error al registrar el lote.');
      },
    });
  };

  if (isLoadingUbicaciones) {
    return <div className="text-center text-gray-500">Cargando ubicaciones...</div>;
  }

  return (
    <div className="p-10">
      {isError && (
        <p className="text-red-500">
          Error: {error?.response?.data?.message || error?.message}
        </p>
      )}
      {errorMensaje && <p className="text-red-500 mb-2">{errorMensaje}</p>}
      {isSuccess && <p className="text-green-500 mb-2">Lote creado con éxito</p>}
      <Formulario
        fields={formFields}
        onSubmit={handleSubmit}
        isError={isError}
        isSuccess={isSuccess}
        title="Crear Lote"
      />
    </div>
  );
};

export default CrearLote;