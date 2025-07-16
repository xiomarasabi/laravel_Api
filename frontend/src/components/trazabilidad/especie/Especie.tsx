import { useState } from 'react';
import { useEspecie } from '@/hooks/trazabilidad/especie/useEspecie';
import VentanaModal from '@/components/globales/VentanasModales';
import Tabla from '@/components/globales/Tabla';
import { useNavigate } from 'react-router-dom';
import useReporteEspeciePDF from '@/hooks/trazabilidad/especie/useReporteEspecie';

const Especies = () => {
  const { data: especies = [], error } = useEspecie();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEspecie, setSelectedEspecie] = useState<any>(null);
  const { generarPDF } = useReporteEspeciePDF();
  const navigate = useNavigate();

  const openModal = (especie: any) => {
    setSelectedEspecie(especie);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedEspecie(null);
    setIsModalOpen(false);
  };

  const handleUpdate = (especie: { id: number }) => {
    navigate(`/actualizarEspecie/${especie.id}`);
  };

  const handleCreate = () => {
    navigate('/CrearEspecie');
  };

  const tablaData = especies.map((e) => ({
    id: e.id,
    nombre_comun: e.nombre_comun || 'Sin nombre',
    nombre_cientifico: e.nombre_cientifico || 'Sin nombre',
    descripcion: e.descripcion || 'Sin descripción',
    tipo_cultivo: e.tipo_cultivo?.nombre || 'Sin tipo de cultivo',
  }));

  const headers = ['id', 'Nombre Comun', 'Nombre Cientifico', 'Descripcion', 'Tipo Cultivo'];

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <button
          onClick={generarPDF}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Generar PDF
        </button>
      </div>

      {error && (
        <div className="text-center text-red-500">
          Error al cargar las especies: {error.message}
        </div>
      )}

      <Tabla
        title="Especies"
        headers={headers}
        data={tablaData}
        onClickAction={openModal}
        onUpdate={handleUpdate}
        onCreate={handleCreate}
        createButtonTitle="Crear Especie"
      />

      {selectedEspecie && (
        <VentanaModal
          isOpen={isModalOpen}
          onClose={closeModal}
          titulo="Detalles de la Especie"
          contenido={selectedEspecie}
        />
      )}
    </div>
  );
};

export default Especies;
