import { useState, useEffect } from 'react';
import { useActualizarResiduo, ActualizarResiduoInput } from '@/hooks/trazabilidad/residuo/useActualizarResiduo';
import { useResiduoPorId } from '@/hooks/trazabilidad/residuo/useResiduoPorId';
import { useCultivo } from '@/hooks/trazabilidad/cultivo/useCultivo';
import Formulario from '@/components/globales/Formulario';
import { useNavigate, useParams } from 'react-router-dom';
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
  descripcion?: string | null;
}

const ActualizarResiduo = () => {
  const { id } = useParams<{ id: string }>();
  const residuoId = id;
  const mutation = useActualizarResiduo();
  const navigate = useNavigate();
  const { data: residuo, isLoading: isLoadingResiduo } = useResiduoPorId(residuoId);
  const { data: cultivos = [], isLoading: isLoadingCultivos } = useCultivo();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState<{ [key: string]: string } | null>(null);

  // Obtener tipos de residuos desde /tipo_residuos
  const { data: tiposResiduos = [], isLoading: isLoadingTiposResiduos } = useQuery<TipoResiduo[], Error>({
    queryKey: ['TiposResiduos'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No hay token disponible. Por favor, inicia sesión.');
      const { data } = await axios.get(`${apiUrl}/tipo_residuos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!data || !Array.isArray(data)) {
        throw new Error('Los datos de tipos de residuos no tienen el formato esperado.');
      }
      return data.map((tipo: any) => ({
        id: tipo.id,
        nombre_residuo: tipo.nombre_residuo || 'Sin nombre',
        descripcion: tipo.descripcion || null,
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

  // Establecer valores iniciales del formulario
  useEffect(() => {
    if (residuo) {
      const initial = {
        nombre: residuo.nombre || '',
        fecha: residuo.fecha || '',
        descripcion: residuo.descripcion || '',
        fk_id_cultivo: residuo.fk_id_cultivo.toString() || '',
        fk_id_tipo_residuo: residuo.fk_id_tipo_residuo.toString() || '',
      };
      setInitialValues(initial);
      console.log('Valores iniciales:', initial);
    }
  }, [residuo]);

  // Mostrar mensaje de carga si los datos no están listos
  if (isLoadingResiduo || isLoadingCultivos || isLoadingTiposResiduos) {
    return <div className="text-center text-gray-500 py-4">Cargando datos...</div>;
  }

  // Validar que el residuo exista
  if (!residuo) {
    return (
      <div className="text-center text-red-500 py-4">
        Residuo no encontrado.
      </div>
    );
  }

  // Validar que haya datos disponibles
  if (cultivosUnicos.length === 0 || tiposResiduosUnicos.length === 0) {
    return (
      <div className="text-center text-red-500 py-4">
        No hay cultivos o tipos de residuos disponibles. Por favor, crea algunos primero.
      </div>
    );
  }

  // Validar que los valores iniciales estén cargados
  if (!initialValues) {
    return <div className="text-center text-gray-500 py-4">Cargando datos del residuo...</div>;
  }

  // Definir los campos del formulario
  const formFields: FormField[] = [
    { id: 'nombre', label: 'Nombre del Residuo', type: 'text' },
    { id: 'fecha', label: 'Fecha', type: 'date' },
    { id: 'descripcion', label: 'Descripción', type: 'text' },
    {
      id: 'fk_id_cultivo',
      label: 'Cultivo',
      type: 'select',
      options: cultivosUnicos.map((cultivo) => ({
        value: cultivo.id,
        label: cultivo.nombre_cultivo,
      })),
    },
    {
      id: 'fk_id_tipo_residuo',
      label: 'Tipo de Residuo',
      type: 'select',
      options: tiposResiduosUnicos.map((tipo) => ({
        value: tipo.id,
        label: tipo.nombre_residuo,
      })),
    },
  ];

  // Manejo del formulario
  const handleSubmit = async (formData: { [key: string]: string }) => {
    setErrorMessage(null);

    // Crear objeto con solo los campos que han cambiado
    const residuoActualizado: ActualizarResiduoInput = {};
    if (formData.nombre && formData.nombre !== initialValues.nombre) {
      residuoActualizado.nombre = formData.nombre;
    }
    if (formData.fecha && formData.fecha !== initialValues.fecha) {
      residuoActualizado.fecha = formData.fecha;
    }
    if (formData.descripcion !== initialValues.descripcion) {
      residuoActualizado.descripcion = formData.descripcion || null;
    }
    if (formData.fk_id_cultivo && formData.fk_id_cultivo !== initialValues.fk_id_cultivo) {
      residuoActualizado.fk_id_cultivo = parseInt(formData.fk_id_cultivo);
    }
    if (formData.fk_id_tipo_residuo && formData.fk_id_tipo_residuo !== initialValues.fk_id_tipo_residuo) {
      residuoActualizado.fk_id_tipo_residuo = parseInt(formData.fk_id_tipo_residuo);
    }

    // Si no hay cambios, mostrar mensaje
    if (Object.keys(residuoActualizado).length === 0) {
      setErrorMessage('No se han realizado cambios en el residuo.');
      return;
    }

    console.log('Enviando al hook:', residuoActualizado);

    mutation.mutate(
      { id: residuo.id, ...residuoActualizado },
      {
        onSuccess: () => {
          console.log('Mutación exitosa, navegando a /residuos');
          navigate('/residuos');
        },
        onError: (error: any) => {
          setErrorMessage(
            error.response?.data?.message || 'Error al actualizar el residuo. Inténtalo de nuevo.'
          );
          console.error('Error en mutación:', error);
        },
      }
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{errorMessage}</div>
      )}
      {mutation.isPending && (
        <div className="mb-4 p-4 bg-blue-100 text-blue-700 rounded">Actualizando residuo...</div>
      )}
      {mutation.isSuccess && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">Residuo actualizado exitosamente.</div>
      )}
      <Formulario
        fields={formFields}
        onSubmit={handleSubmit}
        isError={mutation.isError}
        isSuccess={mutation.isSuccess}
        title="Actualizar Residuo"
        initialValues={initialValues}
      />
    </div>
  );
};

export default ActualizarResiduo;