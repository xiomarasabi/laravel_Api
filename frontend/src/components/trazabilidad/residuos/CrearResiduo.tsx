import { useState } from 'react';
import { useCrearResiduo, CrearResiduoInput } from '@/hooks/trazabilidad/residuo/useCrearResiduo';
import { useCultivo } from '@/hooks/trazabilidad/cultivo/useCultivo';
import Formulario from '@/components/globales/Formulario';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL.replace(/\/+$/, '');

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'date' | 'select';
  options?: { value: string | number; label: string }[];
}

interface TipoResiduo {
  id: number;
  nombre_residuo: string;
  descripcion?: string;
}

const CrearResiduo = () => {
  const mutation = useCrearResiduo();
  const navigate = useNavigate();
  const { data: cultivos = [], isLoading: isLoadingCultivos } = useCultivo();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Obtener tipos de residuos directamente desde el endpoint /tipo_residuos
  const { data: tiposResiduos = [], isLoading: isLoadingTiposResiduos } = useQuery<TipoResiduo[], Error>({
    queryKey: ['TiposResiduos'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token disponible. Por favor, inicia sesión.');
      }
      const response = await axios.get(`${apiUrl}/tipo_residuos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Respuesta de tipos de residuos:', response.data);
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Los datos de tipos de residuos no tienen el formato esperado.');
      }
      return response.data.map((tipo: any) => ({
        id: tipo.id,
        nombre_residuo: tipo.nombre_residuo || 'Sin nombre',
        descripcion: tipo.descripcion,
      }));
    },
    gcTime: 1000 * 60 * 10,
    retry: 2,
    staleTime: 1000 * 60 * 5,
  });

  // Validar cultivos y tipos de residuos
  const cultivosValidos = Array.isArray(cultivos)
    ? cultivos.filter((c) => c?.id && c?.nombre_cultivo)
    : [];
  const tiposResiduosValidos = Array.isArray(tiposResiduos)
    ? tiposResiduos.filter((t) => t?.id && t?.nombre_residuo)
    : [];

  // Obtener cultivos únicos
  const cultivosUnicos = Array.from(
    new Map(cultivosValidos.map((cultivo) => [cultivo.id, cultivo])).values()
  );

  // Obtener tipos de residuos únicos
  const tiposResiduosUnicos = Array.from(
    new Map(tiposResiduosValidos.map((tipo) => [tipo.id, tipo])).values()
  );

  // Mostrar mensaje de carga si los datos no están listos
  if (isLoadingCultivos || isLoadingTiposResiduos) {
    return <div className="text-center text-gray-500 py-4">Cargando datos...</div>;
  }

  // Validar que haya datos disponibles
  if (cultivosUnicos.length === 0 || tiposResiduosUnicos.length === 0) {
    return (
      <div className="text-center text-red-500 py-4">
        No hay cultivos o tipos de residuos disponibles. Por favor, crea algunos primero.
      </div>
    );
  }

  // Definir los campos del formulario
  const formFields: FormField[] = [
    { id: 'nombre', label: 'Nombre del Residuo*', type: 'text' },
    { id: 'fecha', label: 'Fecha*', type: 'date' },
    { id: 'descripcion', label: 'Descripción', type: 'text' },
    {
      id: 'fk_id_cultivo',
      label: 'Cultivo*',
      type: 'select',
      options: cultivosUnicos.map((cultivo) => ({
        value: cultivo.id,
        label: cultivo.nombre_cultivo,
      })),
    },
    {
      id: 'fk_id_tipo_residuo',
      label: 'Tipo de Residuo*',
      type: 'select',
      options: tiposResiduosUnicos.map((tipo) => ({
        value: tipo.id,
        label: tipo.nombre_residuo,
      })),
    },
  ];

  // Manejo del formulario
  const handleSubmit = (formData: { [key: string]: string }) => {
    setErrorMessage(null);

    // Validar campos obligatorios
    if (!formData.nombre || !formData.fecha || !formData.fk_id_cultivo || !formData.fk_id_tipo_residuo) {
      setErrorMessage('Todos los campos obligatorios deben estar completos.');
      return;
    }

    const nuevoResiduo: CrearResiduoInput = {
      nombre: formData.nombre,
      fecha: formData.fecha,
      descripcion: formData.descripcion || '',
      fk_id_cultivo: parseInt(formData.fk_id_cultivo),
      fk_id_tipo_residuo: parseInt(formData.fk_id_tipo_residuo),
    };

    console.log('Datos enviados al crear residuo:', nuevoResiduo); // Depuración
    mutation.mutate(nuevoResiduo, {
      onSuccess: () => {
        navigate('/residuos');
      },
      onError: (error: any) => {
        setErrorMessage(
          error.message || 'Error al crear el residuo. Inténtalo de nuevo.'
        );
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
          Creando residuo...
        </div>
      )}
      {mutation.isSuccess && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
          Residuo creado exitosamente.
        </div>
      )}
      <Formulario
        fields={formFields}
        onSubmit={handleSubmit}
        isError={mutation.isError}
        isSuccess={mutation.isSuccess}
        title="Registrar Nuevo Residuo"
      />
    </div>
  );
};

export default CrearResiduo;