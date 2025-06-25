import { useState } from 'react';
import { useLotes, Lote } from '../../../hooks/iot/lote/useLotes';
import Tabla from '../../globales/Tabla';
import VentanaModal from '../../globales/VentanasModales';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface TableRow {
  id: number;
  nombre: string;
  dimension: string;
  ubicacion: string;
  estado: string;
}

const Lotes = () => {
  const { data: lotes = [], isLoading, error } = useLotes();
  const [selectedLote, setSelectedLote] = useState<Lote | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const openModalHandler = (lote: Lote) => {
    setSelectedLote(lote);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedLote(null);
    setIsModalOpen(false);
  };

  const handleUpdate = (lote: { id: number }) => {
    navigate(`/Editarlote/${lote.id}`);
  };

  const headers = [ 'Nombre', 'Dimension', 'Ubicacion', 'Estado'];

  const handleRowClick = (row: TableRow) => {
    const originalLote = lotes.find((l) => l.id === row.id);
    if (originalLote) {
      openModalHandler(originalLote);
    }
  };

  const handleCreate = () => {
    navigate('/Crear-lote');
  };

  const generarPDF = () => {
    if (isLoading) {
      alert('Cargando lotes, por favor espera.');
      return;
    }
    if (error) {
      alert('No se puede generar el PDF: error al cargar los lotes.');
      return;
    }
    if (!lotes.length) {
      alert('No hay lotes para generar el reporte.');
      return;
    }

    const doc = new jsPDF();
    doc.text('Reporte de Lotes', 14, 10);

    const tableData = lotes.map((item, index) => [
      index + 1,
      item.nombre_lote,
      item.dimension,
      item.fk_id_ubicacion ? `${item.fk_id_ubicacion.latitud}, ${item.fk_id_ubicacion.longitud}` : 'Sin ubicación',
      item.estado,
    ]);

    autoTable(doc, {
      head: [['#', 'Nombre', 'Dimensión', 'Ubicación', 'Estado']],
      body: tableData,
      startY: 20,
    });

    doc.save('Reporte_Lotes.pdf');
  };

  if (isLoading) return <div className="text-center">Cargando lotes...</div>;
  if (error) return <div className="text-red-600 text-center">Error al cargar los lotes: {error.message}</div>;

  const mappedLotes = lotes.map((lote) => ({
    id: lote.id,
    nombre: lote.nombre_lote,
    dimension: lote.dimension,
    ubicacion: lote.fk_id_ubicacion
      ? `${lote.fk_id_ubicacion.latitud}, ${lote.fk_id_ubicacion.longitud}`
      : 'Sin ubicación',
    estado: lote.estado,
  }));

  return (
    <div className="overflow-x-auto rounded-lg p-4">
      <div className="flex justify-end items-center mb-4">
        <button
          onClick={generarPDF}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-green-300"
          disabled={isLoading || !lotes.length || !!error}
        >
          Generar Reporte PDF
        </button>
      </div>
      <Tabla
        title="Lotes"
        headers={headers}
        data={mappedLotes}
        onClickAction={handleRowClick}
        onUpdate={handleUpdate}
        onCreate={handleCreate}
        createButtonTitle="Crear Lote"
      />
      {selectedLote && (
        <VentanaModal
          isOpen={isModalOpen}
          onClose={closeModal}
          titulo="Detalles del Lote"
          contenido={{
            ID: selectedLote.id,
            Nombre: selectedLote.nombre_lote,
            Dimensión: selectedLote.dimension,
            Ubicación: selectedLote.fk_id_ubicacion
              ? `${selectedLote.fk_id_ubicacion.latitud}, ${selectedLote.fk_id_ubicacion.longitud}`
              : 'Sin ubicación',
            Estado: selectedLote.estado,
          }}
        />
      )}
    </div>
  );
};

export default Lotes;