import { useCrearVenta, NuevaVenta } from '@/hooks/finanzas/venta/useCrearVenta';
import Formulario from '../../globales/Formulario';
import { useNavigate } from 'react-router-dom';
import { useProduccion } from '@/hooks/finanzas/produccion/useProduccion';

const CrearVenta = () => {
  const mutation = useCrearVenta();
  const navigate = useNavigate();
  const { data: producciones = [] } = useProduccion();

  const formFields = [  
    {
      id: 'fk_id_produccion',
      label: 'Producción',
      type: 'select',
      options: producciones.map((produccion) => ({
        value: String(produccion.id),
        label: `${produccion.nombre_produccion} - ${new Date(produccion.fecha_produccion).toLocaleDateString()}`,
      })),
    },
    { id: 'cantidad', label: 'Cantidad', type: 'number' },
    { id: 'precio_unidad', label: 'Precio por Unidad', type: 'number' },
    { id: 'fecha', label: 'Fecha', type: 'date' },
  ];

  const handleSubmit = (formData: { [key: string]: string }) => {
    console.log("Detalles del formulario: ", formData);

    const rawProduccion = formData.fk_id_produccion;

    if (!rawProduccion || rawProduccion === 'undefined') {
      console.error("❌ Producción no seleccionada");
      return;
    }

    const fk_id_produccion = parseInt(rawProduccion);
    const cantidad = parseFloat(formData.cantidad);
    const precio_unitario = parseFloat(formData.precio_unidad);
    const fecha_venta = formData.fecha;

    if (isNaN(fk_id_produccion) || isNaN(cantidad) || isNaN(precio_unitario)) {
      console.error("❌ Datos numéricos inválidos");
      return;
    }

    const nuevaVenta: NuevaVenta = {
      fk_id_produccion,
      cantidad,
      precio_unitario,
      total_venta: cantidad * precio_unitario,
      fecha_venta,
    };

    console.log("✅ Venta enviada:", nuevaVenta);

    mutation.mutate(nuevaVenta, {
      onSuccess: () => {
        navigate("/ventas");
      },
    });
  };

  return (
    <div className="p-10">
      <Formulario
        fields={formFields}
        onSubmit={handleSubmit}
        isError={mutation.isError}
        isSuccess={mutation.isSuccess}
        title="Crear Venta"
        initialValues={{ fk_id_produccion: '' }} // Prevenir 'undefined'
      />
    </div>
  );
};

export default CrearVenta;
