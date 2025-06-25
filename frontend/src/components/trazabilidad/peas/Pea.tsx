import { useState } from 'react';
import { usePea } from '../../../hooks/trazabilidad/pea/usePea';
import VentanaModal from '../../globales/VentanasModales';
import Tabla from '../../globales/Tabla';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Pea = () => {
  const { data: peas = [], isLoading, error } = usePea();
  const [selectedPea, setSelectedPea] = useState<object | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const openModalHandler = (pea: object) => {
    setSelectedPea(pea);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPea(null);
    setIsModalOpen(false);
  };

  const handleRowClick = (pea: object) => {
    openModalHandler(pea);
  };

  const handleUpdate = (pea: { id_pea: number }) => {
    navigate(`/pea/editar/${pea.id_pea}`);
  };

  const handleCreate = () => {
    navigate('/crearpea');
  };

  if (isLoading) return <div className="text-center text-gray-500 py-4">Cargando PEAs...</div>;
  if (error) return <div className="text-center text-red-500 py-4">Error al cargar los PEAs: {error.message}</div>;

  const mappedPeas = peas.map(pea => ({
    id_pea: pea.id_pea,
    nombre: pea.nombre,
    descripcion: pea.descripcion || 'Sin descripción',
  }));

  const generarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('PEAs Registrados', 14, 15);

    const tableData = mappedPeas.map(pea => [
      pea.id_pea,
      pea.nombre,
      pea.descripcion,
    ]);

    autoTable(doc, {
      head: [['ID', 'Nombre', 'Descripción']],
      body: tableData,
      startY: 20,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [34, 197, 94] },
    });

    doc.save('PEAs_Registrados.pdf');
  };

  const headers = [ 'Nombre', 'Descripcion'];

  return (
    <div className="overflow-x-auto rounded-lg p-4">
      <div className="flex justify-end items-center mb-4 space-x-2">
        <button
          onClick={generarPDF}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Generar PDF
        </button>
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Crear PEA
        </button>
      </div>
      <Tabla
        title="Lista de PEAs"
        headers={headers}
        data={mappedPeas}
        onClickAction={handleRowClick}
        onUpdate={handleUpdate}
        onCreate={handleCreate}
        createButtonTitle="Crear"
      />
      {selectedPea && (
        <VentanaModal
          isOpen={isModalOpen}
          onClose={closeModal}
          titulo="Detalles del PEA"
          contenido={selectedPea}
        />
      )}
    </div>
  );
};

export default Pea;