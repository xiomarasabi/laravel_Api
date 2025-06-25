import { Produccion } from '@/hooks/finanzas/produccion/useCrearProduccion';
import { useCrearProduccion } from '../../../hooks/finanzas/produccion/useCrearProduccion';
import Formulario from '../../globales/Formulario';
import { useNavigate } from 'react-router-dom';
import { useCultivo } from '../../../hooks/trazabilidad/cultivo/useCultivo';
import { useLotes } from '../../../hooks/iot/lote/useLotes';

const CrearProduccion = () => {
  const mutation = useCrearProduccion();
  const navigate = useNavigate();
  const { data: cultivos = [], isLoading: isLoadingCultivos, error: errorCultivos } = useCultivo();
  const { data: lotes = [], isLoading: isLoadingLotes, error: errorLotes } = useLotes();

  console.log("📋 Lotes cargados:", lotes); // Depuración

  const formFields = [
    {
      id: 'fk_id_cultivo',
      label: 'Cultivo',
      type: 'select',
      options: [
        { value: '', label: 'Seleccione un cultivo' },
        ...cultivos.map((cultivo) => ({
          value: String(cultivo.id_cultivo),
          label: cultivo.nombre_cultivo || `Cultivo ID ${cultivo.id_cultivo}`,
        })),
      ],
    },
    { id: 'nombre_produccion', label: 'Nombre', type: 'text' },
    { id: 'cantidad_producida', label: 'Cantidad de Producción', type: 'number' },
    { id: 'fecha_produccion', label: 'Fecha de Producción', type: 'date' },
    {
      id: 'fk_id_lote',
      label: 'Lote',
      type: 'select',
      options: [
        { value: '', label: 'Seleccione un lote' },
        ...lotes.map((lote) => ({
          value: String(lote.id),
          label: lote.nombre_lote || `Lote ID ${lote.id}`,
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
    console.log("📋 Formulario enviado:", formData); // Depuración

    // Validar campos requeridos
    if (!formData.fk_id_cultivo || formData.fk_id_cultivo === 'undefined') {
      alert('Por favor, seleccione un cultivo válido');
      return;
    }
    if (!formData.fk_id_lote || formData.fk_id_lote === 'undefined') {
      alert('Por favor, seleccione un lote válido');
      return;
    }
    if (!formData.nombre_produccion) {
      alert('Por favor, ingrese un nombre para la producción');
      return;
    }
    if (!formData.cantidad_producida || isNaN(parseFloat(formData.cantidad_producida))) {
      alert('Por favor, ingrese una cantidad válida');
      return;
    }
    if (!formData.fecha_produccion) {
      alert('Por favor, seleccione una fecha de producción');
      return;
    }
    if (!formData.estado || formData.estado === 'undefined') {
      alert('Por favor, seleccione un estado válido');
      return;
    }

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

    // Validar que fk_id_lote no sea NaN
    if (isNaN(nuevaProduccion.fk_id_lote)) {
      alert('El ID del lote no es válido');
      return;
    }

    console.log("🌱 Nueva producción:", nuevaProduccion); // Depuración

    mutation.mutate(nuevaProduccion, {
      onSuccess: () => {
        navigate("/produccion");
      },
      onError: (error: any) => {
        console.error("❌ Error en creación de producción:", error.response?.data || error.message);
      },
    });
  };

  if (isLoadingCultivos || isLoadingLotes) return <div className="text-gray-500">Cargando datos...</div>;
  if (errorCultivos || errorLotes) return <div className="text-red-500">Error al cargar cultivos o lotes</div>;
  if (!cultivos.length || !lotes.length) return <div className="text-yellow-500">No hay cultivos o lotes disponibles</div>;

  return (
    <div className="p-10">
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