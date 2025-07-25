import { useCrearLote } from '../../../hooks/iot/lote/useCrearLote';
import Formulario from '../../globales/Formulario';
import { useNavigate } from 'react-router-dom';

export interface Lote {
  id: number;
  dimension: string;
  nombre_lote: string;
  fk_id_ubicacion: number;
  estado: string;
}

const CrearLote = () => {
  const { mutate, isError, isSuccess, error } = useCrearLote();
  const navigate = useNavigate();

  const formFields = [
    {
      id: 'fk_id_ubicacion',
      label: 'Ubicación',
      type: 'number',
      
    },
    {
      id: 'dimension',
      label: 'Dimensión (m²)',
      type: 'number',
      step: '0.01',
      min: '0',
    },
    {
      id: 'nombre_lote',
      label: 'Nombre del Lote',
      type: 'text',
    },
    {
      id: 'estado',
      label: 'Estado',
      type: 'select',
      options: [
        { value: 'Activo', label: 'Activo' },
        { value: 'Inactivo', label: 'Inactivo' },
      ],
    },
  ];

  const handleSubmit = (formData: { [key: string]: string }) => {
    if (
      !formData.fk_id_ubicacion ||
      !formData.dimension ||
      !formData.nombre_lote ||
      !formData.estado
    ) {
      console.log('Campos faltantes');
      return;
    }

    const nuevoLote: Lote = {
      id: 0, // Incluimos id como 0 para satisfacer el tipo Lote, pero el backend lo ignora
      fk_id_ubicacion: Number(formData.fk_id_ubicacion),
      dimension: formData.dimension,
      nombre_lote: formData.nombre_lote.trim(),
      estado: formData.estado,
    };
    console.log("que es ", nuevoLote)

    mutate(nuevoLote, {
      onSuccess: () => {
        navigate('/Lotes');
      },
    });
  };

  return (
    <div className="p-10">
      {isError && <p className="text-red-500">Error: {error?.message}</p>}
      {isSuccess && <p className="text-green-500">Lote creado con éxito</p>}
      <Formulario
        fields={formFields}
        onSubmit={handleSubmit}
        isError={isError}
        isSuccess={isSuccess}
        title="Crear Lote"
      />
    </div>
  );
};

export default CrearLote;