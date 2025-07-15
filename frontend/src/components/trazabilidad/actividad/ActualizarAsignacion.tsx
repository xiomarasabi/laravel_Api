import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAsignacionPorId } from '@/hooks/trazabilidad/asignacion/useAsignacionPorId';
import { Asignacion, useEditarAsignacion } from '@/hooks/trazabilidad/asignacion/useEditarAsignacion';
import { useUsuarios } from '@/hooks/usuarios/useUsuarios';
import { useAsignacion } from '@/hooks/trazabilidad/asignacion/useAsignacion';
import Formulario from '../../globales/Formulario';

const ActualizarAsignacion = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: asignacion, isLoading, error: asignacionError } = useAsignacionPorId(id);
  const { data: usuarios = [], isLoading: isLoadingUsuarios, error: usuariosError } = useUsuarios();
  const { data: asignaciones = [], isLoading: isLoadingAsignaciones, error: asignacionesError } = useAsignacion();
  const mutation = useEditarAsignacion();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({
    fecha: '',
    fk_id_actividad: '',
    fk_identificacion: '',
  });

  // Inicializa el formulario con los datos recibidos
  useEffect(() => {
    if (asignacion) {
      const initialData = {
        fecha: asignacion.fecha ?? '',
        fk_id_actividad: asignacion.actividad?.id_actividad?.toString() ?? '',
        fk_identificacion: asignacion.user?.identificacion?.toString() ?? '',
      };
      setFormData(initialData);
    }
  }, [asignacion]);

  // Construye opciones únicas de actividades
  const actividadOptions = Array.from(
    new Map(
      asignaciones.map((item) => [
        item.actividad?.id_actividad?.toString() ?? '',
        {
          value: item.actividad?.id_actividad?.toString() ?? '',
          label: item.actividad?.nombre_actividad ?? 'Sin nombre',
        },
      ])
    ).values()
  ).filter((opt) => opt.value !== '');

  // Opciones de usuarios
  const usuarioOptions = usuarios.map((usr) => ({
    value: usr.identificacion?.toString() ?? '',
    label: `${usr.nombre ?? 'Sin nombre'} ${usr.email ?? ''}`.trim(),
  }));

  // Depuración
  useEffect(() => {
    console.log('👤 Usuarios:', usuarios);
    console.log('📋 Actividades:', actividadOptions);
  }, [usuarios, asignaciones]);

  const formFields = [
    { id: 'fecha', label: 'Fecha', type: 'date', required: true },
    {
      id: 'fk_id_actividad',
      label: 'Actividad',
      type: 'select',
      options: [{ value: '', label: 'Seleccione una actividad' }, ...actividadOptions],
      required: true,
    },
    {
      id: 'fk_identificacion',
      label: 'Usuario',
      type: 'select',
      options: [{ value: '', label: 'Seleccione un usuario' }, ...usuarioOptions],
      required: true,
    },
  ];

  const handleSubmit = (data: Record<string, string>) => {
    setErrorMessage(null);

    const missingFields = ['fecha', 'fk_id_actividad', 'fk_identificacion'].filter(
      (field) => !data[field]
    );

    if (missingFields.length > 0) {
      setErrorMessage(`Completa los campos obligatorios: ${missingFields.join(', ')}`);
      return;
    }

    const originalData = {
      fecha: asignacion?.fecha ?? '',
      fk_id_actividad: asignacion?.actividad?.id_actividad?.toString() ?? '',
      fk_identificacion: asignacion?.user?.identificacion?.toString() ?? '',
    };

    const hasChanges = Object.keys(data).some((key) => data[key] !== originalData[key as keyof typeof originalData]);

    if (!hasChanges) {
      setErrorMessage('No se han realizado cambios en la asignación.');
      return;
    }

    const asignacionActualizada: Asignacion = {
      id_asignacion_actividad: Number(id),
      fecha: data.fecha,
      fk_id_actividad: Number(data.fk_id_actividad),
      fk_identificacion: Number(data.fk_identificacion),
    };

    mutation.mutate(asignacionActualizada, {
      onSuccess: () => {
        navigate('/actividad');
      },
      onError: (error: any) => {
        console.error('❌ Error al actualizar:', error);
        setErrorMessage(
          error.message.includes('Base table or view not found')
            ? 'La tabla de actividades no existe en la base de datos.'
            : error.response?.data?.message ?? error.message
        );
      },
    });
  };

  // Mensajes de carga o error
  if (isLoading || isLoadingUsuarios || isLoadingAsignaciones) {
    return <div className="text-center text-gray-500">Cargando datos...</div>;
  }

  if (asignacionError || usuariosError || asignacionesError) {
    return (
      <div className="text-center text-red-500">
        Error al cargar los datos:{' '}
        {asignacionError?.message || usuariosError?.message || asignacionesError?.message}
      </div>
    );
  }

  if (!asignacion) {
    return <div className="text-center text-red-500">Asignación no encontrada</div>;
  }

  if (!usuarioOptions.length) {
    return <div className="text-center text-red-500">No hay usuarios disponibles.</div>;
  }

  if (!actividadOptions.length) {
    return <div className="text-center text-red-500">No hay actividades disponibles.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{errorMessage}</div>
      )}
      <Formulario
        fields={formFields}
        onSubmit={handleSubmit}
        isError={mutation.isError}
        isSuccess={mutation.isSuccess}
        title="Actualizar Asignación"
        initialValues={formData}
      />
    </div>
  );
};

export default ActualizarAsignacion;
