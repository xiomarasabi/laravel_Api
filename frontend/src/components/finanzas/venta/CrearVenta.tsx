import { NuevaVenta } from '@/hooks/finanzas/venta/useCrearVenta';
import { useCrearVenta } from '../../../hooks/finanzas/venta/useCrearVenta';
import Formulario from '../../globales/Formulario';
import { useNavigate } from 'react-router-dom';
import { useProduccion } from '@/hooks/finanzas/produccion/useProduccion'; // Usamos producciones, no cultivos

const CrearVenta = () => {
  const mutation = useCrearVenta();
  const navigate = useNavigate();
  const { data: producciones = [] } = useProduccion(); // Obtener producciones

  const formFields = [
    {
      id: 'fk_id_produccion',
      label: 'Producción',
      type: 'select',
      options: producciones.map(produccion => ({
        value: String(produccion.id_produccion),
        label: `${produccion.nombre_produccion} - ${new Date(produccion.fecha_produccion).toLocaleDateString()}`
      }))
    },
    { id: 'cantidad', label: 'Cantidad', type: 'number' },
    { id: 'precio_unidad', label: 'Precio por Unidad', type: 'number' },
    { id: 'fecha', label: 'Fecha', type: 'date' },
  ];

  const handleSubmit = (formData: { [key: string]: string }) => {
    const cantidad = parseFloat(formData.cantidad);
    const precio_unidad = parseFloat(formData.precio_unidad);
    const fk_id_produccion = parseInt(formData.fk_id_produccion);

    const nuevaVenta = {
      fk_id_produccion,
      cantidad,
      precio_unitario: precio_unidad, // Renombrado aquí
      total_venta: cantidad * precio_unidad,
      fecha_venta: formData.fecha, // Renombrado aquí
    };

    mutation.mutate(nuevaVenta, {
      onSuccess: () => {
        navigate("/ventas");
      },
    });

    console.log("✅ Venta enviada:", nuevaVenta);
  };

  return (
    <div className="p-10">
      <Formulario
        fields={formFields}
        onSubmit={handleSubmit}
        isError={mutation.isError}
        isSuccess={mutation.isSuccess}
        title="Crear Venta"
      />
    </div>
  );
};

export default CrearVenta;
