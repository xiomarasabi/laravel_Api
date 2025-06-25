// src/components/iot/eras/EditarEras.tsx
import { useState, useEffect, useMemo } from 'react';
import { useEditarEras, Eras } from '@/hooks/iot/eras/useEditarEras';
import { useNavigate, useParams } from 'react-router-dom';
import { useEraPorId } from '@/hooks/iot/eras/useEraPorId';
import { useLotes } from '@/hooks/iot/lote/useLotes';
import Formulario from '../../globales/Formulario';

// Extender la interfaz FormField para incluir required
interface ExtendedFormField {
  id: string;
  label: string;
  type: string;
  options?: { value: string | number; label: string }[];
  value?: string;
  required?: boolean;
}

const EditarEras = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: era, isLoading, error } = useEraPorId(id);
  const actualizarEra = useEditarEras();
  const { data: lotes = [] } = useLotes();

  const [formData, setFormData] = useState({
    fk_id_lote: '',
    descripcion: '',
    estado: 'Activo',
  });

  useEffect(() => {
    if (era) {
      console.log('🔄 Cargando datos de la Era:', era);
      setFormData({
        fk_id_lote: era.fk_id_lote.toString() || '',
        descripcion: era.descripcion || '',
        estado: era.estado || 'Activo',
      });
    }
  }, [era]);

  const initialValues = useMemo(() => formData, [formData]);

  const handleSubmit = (data: { [key: string]: string }) => {
    if (!id) return;

    const eraActualizada: Eras = {
      id: Number(id),
      fk_id_lote: Number(data.fk_id_lote),
      descripcion: data.descripcion.trim(),
      estado: data.estado,
    };

    actualizarEra.mutate(eraActualizada, {
      onSuccess: () => {
        console.log('✅ Era actualizada correctamente');
        navigate('/Eras');
      },
      onError: (error: any) => {
        console.error('❌ Error al actualizar:', error.message);
      },
    });
  };

  if (!id || id === 'undefined') return <div className='text-red-500'>Error: ID no válido</div>;
  if (isLoading) return <div className='text-gray-500'>Cargando datos...</div>;
  if (error) return <div className='text-red-500'>Error al cargar la Era: {(error as Error).message}</div>;

  return (
    <div className='max-w-4xl mx-auto p-4'>
      <Formulario
        fields={[
          {
            id: 'fk_id_lote',
            label: 'Lote',
            type: 'select',
            options: lotes.map((lote) => ({
              value: lote.id.toString(),
              label: lote.nombre_lote,
            })),
            required: true,
          },
          {
            id: 'descripcion',
            label: 'Descripción',
            type: 'text',
            required: true,
          },
          {
            id: 'estado',
            label: 'Estado',
            type: 'select',
            options: [
              { value: 'Activo', label: 'Activo' },
              { value: 'Inactivo', label: 'Inactivo' },
            ],
            required: true,
          },
        ] as ExtendedFormField[]}
        onSubmit={handleSubmit}
        isError={actualizarEra.isError}
        isSuccess={actualizarEra.isSuccess}
        title="Actualizar Era"
        initialValues={initialValues}
      />
      {actualizarEra.isError && (
        <div className="text-red-500 mt-4 mb-4 flex justify-center items-center">
          Error al actualizar: {actualizarEra.error?.message || 'Ocurrió un error'}
        </div>
      )}
    </div>
  );
};

export default EditarEras;