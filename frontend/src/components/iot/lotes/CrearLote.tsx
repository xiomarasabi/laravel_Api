// /src/components/iot/lotes/CrearLote.tsx
import { useCrearLote } from '../../../hooks/iot/lote/useCrearLote';
import { useUbicaciones, Ubicacion } from '../../../hooks/iot/ubicacion/useUbicacion';
import Formulario from '../../globales/Formulario';
import { useNavigate } from 'react-router-dom';

export interface Lote {
  id: number;
  dimension: string; // Cambiado a string para coincidir con la respuesta del backend
  nombre_lote: string;
  fk_id_ubicacion: number;
  estado: string;
}

const CrearLote = () => {
  const mutation = useCrearLote();
  const navigate = useNavigate();
  const { data: ubicaciones = [], isLoading, isError } = useUbicaciones();

  console.log('Estado de useUbicaciones:', { isLoading, isError, ubicaciones }); // Depuración

  // Definir los campos del formulario
  const formFields = [
    {
      id: 'fk_id_ubicacion',
      label: 'Ubicación',
      type: 'select',
      options: isLoading
        ? [{ value: '', label: 'Cargando ubicaciones...' }]
        : isError
        ? [{ value: '', label: 'Error al cargar ubicaciones' }]
        : ubicaciones.length === 0
        ? [{ value: '', label: 'No hay ubicaciones disponibles' }]
        : ubicaciones.map((ubicacion: Ubicacion) => ({
            value: ubicacion.id.toString(),
            label: `Ubicación ${ubicacion.id}: Lat ${ubicacion.latitud}, Long ${ubicacion.longitud}`,
          })),
    },
    {
      id: 'dimension',
      label: 'Dimensión (m²)',
      type: 'number',
      step: '0.01',
      min: '0',
    },
    {
      id: 'nombre_lote',
      label: 'Nombre del Lote',
      type: 'text',
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

  // Manejar el envío del formulario
  const handleSubmit = (formData: { [key: string]: string }) => {
    if (
      !formData.fk_id_ubicacion ||
      !formData.dimension ||
      !formData.nombre_lote ||
      !formData.estado
    ) {
      console.log('Campos faltantes');
      return;
    }

    const nuevoLote: Omit<Lote, 'id'> = {
      fk_id_ubicacion: Number(formData.fk_id_ubicacion),
      dimension: formData.dimension, // Enviado como string para coincidir con el backend
      nombre_lote: formData.nombre_lote.trim(),
      estado: formData.estado,
    };

    mutation.mutate(nuevoLote, {
      onSuccess: () => {
        console.log('✅ Lote creado correctamente');
        navigate('/Lotes');
      },
      onError: (error) => {
        console.error('❌ Error al crear el lote:', error);
      },
    });
  };

  return (
    <div className="p-10">
      {mutation.isError && <p className="text-red-500">Error: {mutation.error?.message}</p>}
      {mutation.isSuccess && <p className="text-green-500">Lote creado con éxito</p>}
      <Formulario
        fields={formFields}
        onSubmit={handleSubmit}
        isError={mutation.isError}
        isSuccess={mutation.isSuccess}
        title="Crear Lote"
      />
    </div>
  );
};

export default CrearLote;