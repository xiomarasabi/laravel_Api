import { Semillero } from '@/hooks/trazabilidad/semillero/useCrearSemillero';
import { useCrearSemillero } from '@/hooks/trazabilidad/semillero/useCrearSemillero';
import Formulario from '../../globales/Formulario';
import { useNavigate } from 'react-router-dom';

const CrearSemillero = () => {
  const mutation = useCrearSemillero();
  const navigate = useNavigate();

  // Campos del formulario
  const formFields = [
    { id: 'nombre_semilla', label: 'Nombre del Semillero', type: 'text', required: true },
    { id: 'fecha_siembra', label: 'Fecha de Siembra', type: 'date', required: true },
    { id: 'fecha_estimada', label: 'Fecha Estimada', type: 'date', required: true },
    { id: 'cantidad', label: 'Cantidad', type: 'number', required: true },
  ];

  // Manejo del envío del formulario
  const handleSubmit = (formData: { [key: string]: string }) => {
    // Validaciones
    if (
      !formData.nombre_semilla?.trim() ||
      !formData.fecha_siembra ||
      !formData.fecha_estimada ||
      !formData.cantidad
    ) {
      alert('Todos los campos son obligatorios');
      return;
    }

    const cantidad = parseInt(formData.cantidad, 10);
    if (isNaN(cantidad) || cantidad <= 0) {
      alert('La cantidad debe ser un número mayor a 0');
      return;
    }

    // Crear objeto Semillero
    const nuevoSemillero: Semillero = {
      id_semillero: 0, // El backend asignará el ID
      nombre_semilla: formData.nombre_semilla.trim(),
      fecha_siembra: new Date(formData.fecha_siembra).toISOString().split('T')[0],
      fecha_estimada: new Date(formData.fecha_estimada).toISOString().split('T')[0],
      cantidad,
    };

    // Log para depuración
    console.log('🚀 Datos del formulario:', nuevoSemillero);

    // Enviar la mutación
    mutation.mutate(nuevoSemillero, {
      onSuccess: () => {
        alert('Semillero creado con éxito');
        navigate('/semilleros');
      },
      onError: (error: any) => {
        const message = error?.response?.data?.message || 'Error al crear el semillero';
        alert(`Error: ${message}`);
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Formulario
        fields={formFields}
        onSubmit={handleSubmit}
        isError={mutation.isError}
        isSuccess={mutation.isSuccess}
        title="Registrar Nuevo Semillero"
        submitButtonText="Crear Semillero"
      />
    </div>
  );
};

export default CrearSemillero;