import { Asignacion } from '@/hooks/trazabilidad/asignacion/useCrearAsignacion';
import { useCrearAsignacion } from '@/hooks/trazabilidad/asignacion/useCrearAsignacion';
import { useQueryClient } from '@tanstack/react-query';
import Formulario from '../../globales/Formulario';
import { useUsuarios } from '@/hooks/usuarios/useUsuarios';
import { useAsignacion } from '@/hooks/trazabilidad/asignacion/useAsignacion';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const CrearAsignacion = () => {
  const mutation = useCrearAsignacion();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: usuarios = [], isLoading: isLoadingUsuarios, error: usuariosError } = useUsuarios();
  const { data: asignaciones = [], isLoading: isLoadingAsignaciones, error: asignacionesError } = useAsignacion();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Filtrar actividades únicas para evitar duplicados
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

  // Mapeo de opciones para el select de usuarios
  const usuarioOptions = usuarios.map((usr) => ({
    value: usr.identificacion?.toString() || (usr.id?.toString() || ''),
    label: `${usr.nombre || 'Sin nombre'} ${usr.apellido || ''}`.trim() || 'Usuario sin nombre',
  }));

  // Depuración
  useEffect(() => {
    console.log('Usuarios disponibles:', usuarios);
    console.log('Opciones de usuario:', usuarioOptions);
    console.log('Asignaciones disponibles:', asignaciones);
    console.log('Opciones de actividad únicas:', actividadOptions);
    if (usuarioOptions.length === 0 && !isLoadingUsuarios) {
      console.warn('No hay usuarios disponibles para seleccionar:', usuarios);
    }
    if (actividadOptions.length === 0 && !isLoadingAsignaciones) {
      console.warn('No hay actividades disponibles para seleccionar:', asignaciones);
    }
  }, [usuarioOptions, isLoadingUsuarios, usuarios, asignaciones, actividadOptions, isLoadingAsignaciones]);

  // Definición de los campos del formulario
  const formFields = [
    { id: 'fecha', label: 'Fecha', type: 'date', required: true },
    {
      id: 'fk_id_actividad',
      label: 'Actividad',
      type: 'select',
      options: actividadOptions,
      required: true,
    },
    {
      id: 'fk_identificacion',
      label: 'Usuario',
      type: 'select',
      options: usuarioOptions,
      required: true,
    },
  ];

  // Manejo del formulario
  const handleSubmit = (formData: { [key: string]: string }) => {
    setErrorMessage(null);

    console.log('FormData recibido:', formData);

    const requiredFields = ['fecha', 'fk_id_actividad', 'fk_identificacion'];
    const missingFields = requiredFields.filter((field) => !formData[field] || formData[field] === '');
    if (missingFields.length > 0) {
      setErrorMessage(`Los siguientes campos son obligatorios: ${missingFields.join(', ')}`);
      return;
    }

    const newAsignacion: Asignacion = {
      fecha: formData.fecha,
      fk_id_actividad: String(formData.fk_id_actividad),
      fk_identificacion: String(formData.fk_identificacion),
    };

    console.log('🚀 Enviando asignación al backend:', newAsignacion);

    mutation.mutate(newAsignacion, {
      onSuccess: (response) => {
        console.log('✅ Asignación creada con éxito:', response);
        queryClient.invalidateQueries({ queryKey: ['asignaciones'] });
        navigate('/actividad');
      },
      onError: (error: any) => {
        console.error('❌ Error al crear asignación:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        setErrorMessage(
          error.response?.data?.msg || error.message || 'Error al crear la asignación. Por favor, intenta de nuevo.'
        );
      },
    });
  };

  if (isLoadingAsignaciones || isLoadingUsuarios) {
    return <div className="text-center text-gray-500">Cargando datos...</div>;
  }

  if (usuariosError || asignacionesError) {
    return (
      <div className="text-center text-red-500">
        Error al cargar los datos: {usuariosError?.message || asignacionesError?.message}
      </div>
    );
  }

  if (usuarioOptions.length === 0 && !isLoadingUsuarios) {
    return (
      <div className="text-center text-red-500">
        No hay usuarios disponibles para seleccionar.
      </div>
    );
  }

  if (actividadOptions.length === 0 && !isLoadingAsignaciones) {
    return (
      <div className="text-center text-red-500">
        No hay actividades disponibles para seleccionar.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {errorMessage}
        </div>
      )}
      <Formulario
        fields={formFields}
        onSubmit={handleSubmit}
        isError={mutation.isError}
        isSuccess={mutation.isSuccess}
        title="Crear Asignación"
      />
    </div>
  );
};

export default CrearAsignacion;