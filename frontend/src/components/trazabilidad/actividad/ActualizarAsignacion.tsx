import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useAsignacionporId } from '@/hooks/trazabilidad/asignacion/useAsignacionPorId';
import { useEditarAsignacion } from '@/hooks/trazabilidad/asignacion/useEditarAsignacion';
import { useUsuarios } from '@/hooks/usuarios/useUsuarios';
import { useAsignacion } from '@/hooks/trazabilidad/asignacion/useAsignacion';
import Formulario from '../../globales/Formulario';

const ActualizarAsignacion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: asignacion, isLoading, error: asignacionError } = useAsignacionporId(id);
  const { data: usuarios = [], isLoading: isLoadingUsuarios, error: usuariosError } = useUsuarios();
  const { data: asignaciones = [], isLoading: isLoadingAsignaciones, error: asignacionesError } = useAsignacion();
  const mutation = useEditarAsignacion();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<{ [key: string]: string }>({
    fecha: '',
    fk_id_actividad: '',
    fk_identificacion: '',
  });

  // Cargar datos iniciales desde la asignación
  useEffect(() => {
    if (asignacion) {
      console.log('🔄 Datos de la asignación recibidos:', asignacion);
      const initialData = {
        fecha: asignacion.fecha || '',
        fk_id_actividad: asignacion.fk_id_actividad?.id?.toString() || asignacion.fk_id_actividad?.toString() || '',
        fk_identificacion: asignacion.fk_identificacion?.id?.toString() || asignacion.fk_identificacion?.toString() || '',
      };
      setFormData(initialData);
      console.log('📋 formData inicializado con:', initialData);
    }
  }, [asignacion]);

  // Filtrar actividades únicas
  const actividadOptions = Array.from(
    new Map(
      asignaciones.map((asignacion) => [
        asignacion.fk_id_actividad.id.toString(),
        {
          value: asignacion.fk_id_actividad.id.toString(),
          label: asignacion.fk_id_actividad.nombre_actividad || 'Sin nombre',
        },
      ])
    ).values()
  );

  // Mapeo de usuarios
  const usuarioOptions = usuarios.map((usr) => ({
    value: usr.identificacion.toString(),
    label: `${usr.nombre || 'Sin nombre'} ${usr.email || ''}`.trim() || 'Usuario sin nombre',
  }));

  // Depuración
  useEffect(() => {
    console.log('👤 Usuarios disponibles:', usuarios);
    console.log('📋 Opciones de usuario:', usuarioOptions);
    console.log('📋 Asignaciones disponibles:', asignaciones);
    console.log('📋 Opciones de actividad únicas:', actividadOptions);
    if (usuarioOptions.length === 0 && !isLoadingUsuarios) {
      console.warn('⚠️ No hay usuarios disponibles para seleccionar:', usuarios);
    }
    if (actividadOptions.length === 0 && !isLoadingAsignaciones) {
      console.warn('⚠️ No hay actividades disponibles para seleccionar:', asignaciones);
    }
  }, [usuarioOptions, isLoadingUsuarios, usuarios, asignaciones, actividadOptions, isLoadingAsignaciones]);

  // Definir campos del formulario
  const formFields = [
    { id: 'fecha', label: 'Fecha', type: 'date', required: true },
    {
      id: 'fk_id_actividad',
      label: 'Actividad',
      type: 'select',
      options: [
        { value: '', label: 'Seleccione una actividad' },
        ...actividadOptions,
      ],
      required: true,
    },
    {
      id: 'fk_identificacion',
      label: 'Usuario',
      type: 'select',
      options: [
        { value: '', label: 'Seleccione un usuario' },
        ...usuarioOptions,
      ],
      required: true,
    },
  ];

  // Manejar envío del formulario
  const handleSubmit = (data: { [key: string]: string }) => {
    setErrorMessage(null);

    console.log('📋 FormData recibido:', data);

    // Validar campos requeridos
    const requiredFields = ['fecha', 'fk_id_actividad', 'fk_identificacion'];
    const missingFields = requiredFields.filter((field) => !data[field] || data[field] === '');
    if (missingFields.length > 0) {
      setErrorMessage(`Los siguientes campos son obligatorios: ${missingFields.join(', ')}`);
      return;
    }

    // Validar que fk_id_actividad sea un número
    const fkIdActividad = parseInt(data.fk_id_actividad, 10);
    if (isNaN(fkIdActividad)) {
      setErrorMessage('La actividad seleccionada no es válida');
      return;
    }

    // Comparar con datos originales
    const originalData = {
      fecha: asignacion?.fecha || '',
      fk_id_actividad: asignacion?.fk_id_actividad?.id?.toString() || asignacion?.fk_id_actividad?.toString() || '',
      fk_identificacion: asignacion?.fk_identificacion?.id?.toString() || asignacion?.fk_identificacion?.toString() || '',
    };
    const hasChanges = Object.keys(data).some((key) => data[key] !== originalData[key as keyof typeof originalData]);
    if (!hasChanges) {
      setErrorMessage('No se han realizado cambios en la asignación');
      return;
    }

    const asignacionActualizada = {
      id: Number(id),
      fecha: data.fecha,
      fk_id_actividad: fkIdActividad.toString(), // Enviar como cadena para consistencia
      fk_identificacion: data.fk_identificacion,
    };

    console.log('🚀 Enviando asignación al backend:', asignacionActualizada);

    mutation.mutate(asignacionActualizada, {
      onSuccess: (response) => {
        console.log('✅ Asignación actualizada con éxito:', response);
        queryClient.invalidateQueries({ queryKey: ['asignaciones_actividades'] });
        queryClient.invalidateQueries({ queryKey: ['asignaciones'] }); // Asegurar compatibilidad
        navigate('/actividad');
      },
      onError: (error: any) => {
        console.error('❌ Error al actualizar asignación:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        setErrorMessage(
          error.response?.data?.msg || error.message || 'Error al actualizar la asignación. Por favor, intenta de nuevo.'
        );
      },
    });
  };

  // Estados de carga y error
  if (isLoading || isLoadingUsuarios || isLoadingAsignaciones) {
    return <div className='text-center text-gray-500'>Cargando datos...</div>;
  }

  if (asignacionError || usuariosError || asignacionesError) {
    return (
      <div className='text-center text-red-500'>
        Error al cargar los datos: {asignacionError?.message || usuariosError?.message || asignacionesError?.message}
      </div>
    );
  }

  if (!asignacion) {
    return <div className='text-center text-red-500'>Asignación no encontrada</div>;
  }

  if (usuarioOptions.length === 0 && !isLoadingUsuarios) {
    return <div className='text-center text-red-500'>No hay usuarios disponibles para seleccionar.</div>;
  }

  if (actividadOptions.length === 0 && !isLoadingAsignaciones) {
    return <div className='text-center text-red-500'>No hay actividades disponibles para seleccionar.</div>;
  }

  return (
    <div className='max-w-4xl mx-auto p-4'>
      {errorMessage && (
        <div className='mb-4 p-4 bg-red-100 text-red-700 rounded'>{errorMessage}</div>
      )}
      <Formulario
        fields={formFields}
        onSubmit={handleSubmit}
        isError={mutation.isError}
        isSuccess={mutation.isSuccess}
        title='Actualizar Asignación'
        initialValues={formData}
      />
    </div>
  );
};

export default ActualizarAsignacion;