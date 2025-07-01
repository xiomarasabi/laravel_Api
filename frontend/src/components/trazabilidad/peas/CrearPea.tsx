import { useState } from 'react';
import { useCrearPea, CrearPeaInput } from '@/hooks/trazabilidad/pea/useCrearPea';
import Formulario from '@/components/globales/Formulario';
import { useNavigate } from 'react-router-dom';

const CrearPea = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const mutation = useCrearPea();
  const navigate = useNavigate();

  const formFields = [
    { id: 'nombre', label: 'Nombre', type: 'text', required: true },
    { id: 'descripcion', label: 'Descripción', type: 'textarea', required: false },
  ];

  const handleSubmit = (formData: { [key: string]: string }) => {
    const nuevoPea: CrearPeaInput = {
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion.trim() || null,
    };

    if (!nuevoPea.nombre) {
      setErrorMessage('El nombre es obligatorio');
      return;
    }

    console.log('Enviando PEA al backend:', nuevoPea);

    mutation.mutate(nuevoPea, {
      onSuccess: () => {
        setSuccessMessage('PEA creado exitosamente');
        setErrorMessage(null);
        setTimeout(() => navigate('/pea', { replace: true }), 2000);
      },
      onError: (error: Error) => {
        setErrorMessage(error.message);
        setSuccessMessage(null);
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4"></h2>
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {successMessage}
        </div>
      )}
      <Formulario
        fields={formFields}
        onSubmit={handleSubmit}
        isError={mutation.isError}
        isSuccess={mutation.isSuccess}
        title="Registrar Nuevo PEA"
      />
    </div>
  );
};

export default CrearPea;