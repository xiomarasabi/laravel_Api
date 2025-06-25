import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCrearCultivo, fetchEspecies, fetchSemilleros } from '../../../hooks/trazabilidad/cultivo/useCrearCultivos';
import Formulario from '../../../components/globales/Formulario';

interface FormErrors {
  nombre_cultivo?: string;
  fecha_plantacion?: string;
  descripcion?: string;
  fk_id_especie?: string;
  fk_id_semillero?: string;
}

interface FormField {
  id: string;
  label: string;
  type: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  options?: Array<{ value: string; label: string }>;
}

interface Especie {
  id_especie: number;
  nombre_comun: string;
  nombre_cientifico: string;
}

interface Semillero {
  id_semillero: number;
  nombre_semilla: string;
  fecha_siembra: string;
}

const CrearCultivo = () => {
  const { mutate, isPending, isError, error } = useCrearCultivo();
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [especies, setEspecies] = useState<Especie[]>([]);
  const [semilleros, setSemilleros] = useState<Semillero[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null); // Nuevo estado para errores de envío

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch (e) {
      console.error('Error formateando fecha:', dateString, e);
      return dateString;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [especiesData, semillerosData] = await Promise.all([
          fetchEspecies().catch(err => {
            console.error('Fallo en fetchEspecies:', err);
            return [];
          }),
          fetchSemilleros().catch(err => {
            console.error('Fallo en fetchSemilleros:', err);
            return [];
          }),
        ]);

        console.log('Especies cargadas:', especiesData); // Debug
        console.log('Semilleros cargados:', semillerosData); // Debug

        setEspecies(especiesData);
        setSemilleros(semillerosData);

        if (especiesData.length === 0 && semillerosData.length === 0) {
          setDataError('No se encontraron especies ni semilleros. Verifica la conexión con el servidor o las rutas de la API.');
        } else if (especiesData.length === 0) {
          setDataError('No se encontraron especies. Verifica el endpoint /especie.');
        } else if (semillerosData.length === 0) {
          setDataError('No se encontraron semilleros. Verifica el endpoint /semilleros.');
        } else {
          setDataError(null);
        }
      } catch (err) {
        console.error('Error general cargando datos:', err);
        setDataError('Error al cargar datos. Por favor, verifica el servidor o la conexión.');
        setEspecies([]);
        setSemilleros([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const formFields: FormField[] = [
    {
      id: 'nombre_cultivo',
      label: 'Nombre del Cultivo*',
      type: 'text',
      placeholder: 'Ej. Tomate Cherry',
      required: true,
      error: formErrors.nombre_cultivo,
    },
    {
      id: 'fecha_plantacion',
      label: 'Fecha de Plantación*',
      type: 'date',
      required: true,
      error: formErrors.fecha_plantacion,
    },
    {
      id: 'descripcion',
      label: 'Descripción*',
      type: 'textarea',
      placeholder: 'Descripción del cultivo...',
      required: true,
      error: formErrors.descripcion,
    },
    {
      id: 'fk_id_especie',
      label: 'Especie*',
      type: 'select',
      options: especies.length > 0
        ? [
            { value: '', label: 'Seleccione una especie...' },
            ...especies.map(e => ({
              value: e.id_especie.toString(),
              label: `${e.nombre_comun || 'Sin nombre'} (${e.nombre_cientifico || 'Sin nombre científico'})`,
            })),
          ]
        : [{ value: '', label: 'No hay especies disponibles' }],
      required: true,
      error: formErrors.fk_id_especie,
    },
    {
      id: 'fk_id_semillero',
      label: 'Semillero*',
      type: 'select',
      options: semilleros.length > 0
        ? [
            { value: '', label: 'Seleccione un semillero...' },
            ...semilleros.map(s => ({
              value: s.id_semillero.toString(),
              label: `${s.nombre_semilla || 'Semillero sin nombre'} (Siembra: ${formatDate(s.fecha_siembra)})`,
            })),
          ]
        : [{ value: '', label: 'No hay semilleros disponibles' }],
      required: true,
      error: formErrors.fk_id_semillero,
    },
  ];

  const validateForm = (formData: Record<string, string>) => {
    const errors: FormErrors = {};
    let isValid = true;

    if (!formData.nombre_cultivo?.trim()) {
      errors.nombre_cultivo = 'El nombre del cultivo es obligatorio';
      isValid = false;
    }

    if (!formData.fecha_plantacion) {
      errors.fecha_plantacion = 'La fecha de plantación es obligatoria';
      isValid = false;
    }

    if (!formData.descripcion?.trim()) {
      errors.descripcion = 'La descripción es obligatoria';
      isValid = false;
    }

    if (!formData.fk_id_especie) {
      errors.fk_id_especie = 'Seleccione una especie';
      isValid = false;
    }

    if (!formData.fk_id_semillero) {
      errors.fk_id_semillero = 'Seleccione un semillero';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = (formData: Record<string, string>) => {
    setSubmitError(null); // Limpiar error previo
    if (!validateForm(formData)) return;

    const cultivoData = {
      nombre_cultivo: formData.nombre_cultivo.trim(),
      fecha_plantacion: formData.fecha_plantacion,
      descripcion: formData.descripcion.trim(),
      fk_id_especie: parseInt(formData.fk_id_especie, 10),
      fk_id_semillero: parseInt(formData.fk_id_semillero, 10),
    };

    mutate(cultivoData, {
      onSuccess: () => {
        console.log('handleSubmit: Redirigiendo a /cultivo'); // Debug
        navigate('/cultivo');
      },
      onError: (err: any) => {
        console.error('Error en handleSubmit:', err);
        setSubmitError(err.message || 'Error al crear el cultivo. Por favor, intenta de nuevo.');
      },
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {(isLoading || isPending) && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-4 text-blue-700">
            {isPending ? 'Guardando cultivo...' : 'Cargando datos...'}
          </span>
        </div>
      )}

      {!isLoading && !isPending && dataError && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{dataError}</div>
      )}

      {!isLoading && !isPending && submitError && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{submitError}</div>
      )}

      {!isLoading && !isPending && (
        <Formulario
          title="Registrar Nuevo Cultivo"
          fields={formFields}
          onSubmit={handleSubmit}
          isError={isError}
          initialValues={{
            nombre_cultivo: '',
            fecha_plantacion: '',
            descripcion: '',
            fk_id_especie: '',
            fk_id_semillero: '',
          }}
        />
      )}

      {isError && error && !submitError && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          Error: {error.message || 'Ocurrió un error al crear el cultivo'}
        </div>
      )}
    </div>
  );
};

export default CrearCultivo;