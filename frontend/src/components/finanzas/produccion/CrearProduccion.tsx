import { useNavigate } from 'react-router-dom';
import { useCrearProduccion, Produccion } from '@/hooks/finanzas/produccion/useCrearProduccion';
import { useCultivo } from '@/hooks/trazabilidad/cultivo/useCultivo';
import { useLotes } from '@/hooks/iot/lote/useLotes';
import Formulario from '@/components/globales/Formulario';

const CrearProduccion = () => {
  const navigate = useNavigate();
  const mutation = useCrearProduccion();
  const { data: cultivos = [], isLoading: loadingCultivos, error: errorCultivos } = useCultivo();
  const { data: lotes = [], isLoading: loadingLotes, error: errorLotes } = useLotes();

  const formFields = [
    {
      id: 'fk_id_cultivo',
      label: 'Cultivo',
      type: 'select',
      options: [
        { value: '', label: 'Seleccione un cultivo' },
        ...cultivos.map((c) => ({
          value: String(c.id),
          label: c.nombre_cultivo || `Cultivo ID ${c.id}`,
        })),
      ],
    },
    { id: 'nombre_produccion', label: 'Nombre de Producción', type: 'text' },
    { id: 'cantidad_producida', label: 'Cantidad Producida', type: 'number' },
    { id: 'fecha_produccion', label: 'Fecha de Producción', type: 'date' },
    {
      id: 'fk_id_lote',
      label: 'Lote',
      type: 'select',
      options: [
        { value: '', label: 'Seleccione un lote' },
        ...lotes.map((l) => ({
          value: String(l.id),
          label: l.nombre_lote || `Lote ID ${l.id}`,
        })),
      ],
    },
    { id: 'descripcion_produccion', label: 'Descripción', type: 'text' },
    {
      id: 'estado',
      label: 'Estado',
      type: 'select',
      options: [
        { value: '', label: 'Seleccione un estado' },
        { value: 'Activo', label: 'Activo' },
        { value: 'Inactivo', label: 'Inactivo' },
        { value: 'Finalizado', label: 'Finalizado' },
      ],
    },
    { id: 'fecha_cosecha', label: 'Fecha de Cosecha', type: 'date' },
  ];

  const handleSubmit = (formData: { [key: string]: string }) => {
    const nuevaProduccion: Produccion = {
      fk_id_cultivo: parseInt(formData.fk_id_cultivo, 10),
      nombre_produccion: formData.nombre_produccion,
      cantidad_producida: parseFloat(formData.cantidad_producida),
      fecha_produccion: formData.fecha_produccion,
      fk_id_lote: parseInt(formData.fk_id_lote, 10),
      descripcion_produccion: formData.descripcion_produccion || '',
      estado: formData.estado,
      fecha_cosecha: formData.fecha_cosecha || null,
    };

    if (
      !nuevaProduccion.fk_id_cultivo ||
      !nuevaProduccion.nombre_produccion ||
      isNaN(nuevaProduccion.cantidad_producida) ||
      !nuevaProduccion.fecha_produccion ||
      !nuevaProduccion.fk_id_lote ||
      !nuevaProduccion.estado
    ) {
      alert('Por favor, complete todos los campos requeridos');
      return;
    }

    mutation.mutate(nuevaProduccion, {
      onSuccess: () => navigate('/produccion'),
    });
  };

  if (loadingCultivos || loadingLotes) return <p className="text-gray-500">Cargando datos...</p>;
  if (errorCultivos || errorLotes) return <p className="text-red-500">Error al cargar cultivos o lotes</p>;
  if (!cultivos.length || !lotes.length) return <p className="text-yellow-500">No hay cultivos o lotes disponibles</p>;

  return (
    <div className="p-6">
      <Formulario
        fields={formFields}
        onSubmit={handleSubmit}
        isError={mutation.isError}
        isSuccess={mutation.isSuccess}
        title="Registrar Producción"
      />
    </div>
  );
};

export default CrearProduccion;
