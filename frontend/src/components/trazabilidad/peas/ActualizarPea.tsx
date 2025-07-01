import { useState, useEffect } from 'react';
import { useActualizarPea, ActualizarPeaInput } from '@/hooks/trazabilidad/pea/useActualizarPea';
import { usePeaPorId } from '@/hooks/trazabilidad/pea/usePeaPorId';
import { useNavigate, useParams } from 'react-router-dom';
import Formulario from '@/components/globales/Formulario';

const ActualizarPea = () => {
  const { id } = useParams<{ id: string }>();
  const peaId = parseInt(id || '0');
  const { data: pea, isLoading, error } = usePeaPorId(id);
  const mutation = useActualizarPea();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<{ [key: string]: string }>({
    nombre: '',
    descripcion: '',
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('🔐 No hay token, redirigiendo al login');
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (pea) {
      const initial = {
        nombre: pea.nombre || '',
        descripcion: pea.descripcion || '',
      };
      setFormData(initial);
      console.log('📦 Valores iniciales cargados:', initial);
    }
  }, [pea]);

  if (!id || isNaN(peaId)) {
    console.log('❌ ID inválido:', id);
    return <div className="text-center text-red-500 py-4">ID de PEA inválido</div>;
  }

  if (isLoading) {
    console.log('⏳ Cargando PEA con ID:', peaId);
    return <div className="text-center text-gray-500 py-4">Cargando datos...</div>;
  }

  if (error) {
    console.log('❌ Error al cargar PEA:', error.message);
    if (error.message.includes('Sesión inválida')) {
      navigate('/login');
    }
    return <div className="text-center text-red-500 py-4">Error al cargar el PEA: {error.message}</div>;
  }

  if (!pea) {
    console.log('❌ PEA no encontrado para ID:', peaId);
    return <div className="text-center text-red-500 py-4">PEA no encontrado</div>;
  }

  const handleSubmit = (data: { [key: string]: string }) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!data.nombre) {
      setErrorMessage('El nombre es obligatorio');
      console.log('❌ Validación fallida: nombre vacío');
      return;
    }

    const peaActualizada: ActualizarPeaInput = {
      nombre: data.nombre.trim(),
      descripcion: data.descripcion.trim() || null,
    };

    console.log('🚀 Enviando al hook:', { id_pea: peaId, ...peaActualizada });

    mutation.mutate({ id_pea: peaId, ...peaActualizada }, {
      onSuccess: () => {
        setSuccessMessage('PEA actualizado exitosamente');
        setTimeout(() => navigate('/pea', { replace: true }), 2000);
      },
      onError: (error: Error) => {
        const message = error.message.includes('Sesión inválida') ? 'Sesión inválida. Redirigiendo al login...' : error.message;
        setErrorMessage(message);
        console.error('❌ Error al actualizar PEA:', error);
        if (error.message.includes('Sesión inválida')) {
          setTimeout(() => navigate('/login'), 2000);
        }
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {errorMessage}
        </div>
      )}
      {mutation.isPending && (
        <div className="mb-4 p-4 bg-blue-100 text-blue-700 rounded">
          Actualizando PEA...
        </div>
      )}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
          {successMessage}
        </div>
      )}
      <Formulario
        fields={[
          { id: 'nombre', label: 'Nombre del PEA', type: 'text' },
          { id: 'descripcion', label: 'Descripción', type: 'textarea' },
        ]}
        onSubmit={handleSubmit}
        isError={mutation.isError}
        isSuccess={mutation.isSuccess}
        title="Actualizar PEA"
        initialValues={formData}
      />
    </div>
  );
};

export default ActualizarPea;