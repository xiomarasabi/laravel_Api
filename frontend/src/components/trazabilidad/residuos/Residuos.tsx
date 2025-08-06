import { useState } from 'react';
import { useResiduos, Residuo } from '../../../hooks/trazabilidad/residuo/useResiduos';
import VentanaModal from '../../globales/VentanasModales';
import Tabla from '../../globales/Tabla';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ResiduoRow {
  id: number;
  nombre: string;
  fecha: string;
  descripcion: string;
  cultivo: string;
  tipo_residuo: string;
}

const ResiduosComponent = () => {
  const { data: residuos = [], isLoading, error } = useResiduos();
  const [selectedResiduo, setSelectedResiduo] = useState<Residuo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const openModalHandler = (residuo: Residuo) => {
    setSelectedResiduo(residuo);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedResiduo(null);
    setIsModalOpen(false);
  };

  const handleRowClick = (row: ResiduoRow) => {
    const residuo = residuos.find((r) => r.id === row.id);
    if (residuo) {
      openModalHandler(residuo);
    }
  };

  const handleUpdate = (row: ResiduoRow) => {
    navigate(`/residuos/editar/${row.id}`);
  };

  const handleCreate = () => {
    navigate('/crearresiduo');
  };

  const generarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Residuos', 14, 15);

    const tableData = mappedResiduos.map((residuo) => [
      residuo.id,
      residuo.nombre,
      residuo.fecha,
      residuo.descripcion,
      residuo.cultivo,
      residuo.tipo_residuo,
    ]);

    autoTable(doc, {
      head: [['ID', 'Nombre', 'Fecha', 'Descripcion', 'Cultivo', 'Tipo Residuo']],
      body: tableData,
      startY: 20,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [22, 101, 52] },
    });

    doc.save('residuos.pdf');
  };

  if (isLoading) {
    return <div className="text-center py-4">Cargando residuos...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-4">
        Error al cargar los residuos: {error.message}
      </div>
    );
  }

  const mappedResiduos: ResiduoRow[] = residuos.map((residuo) => {
    console.log('Mapeando residuo:', residuo); // Depuración adicional
    return {
      id: residuo.id,
      nombre: residuo.nombre || 'Sin nombre',
      fecha: residuo.fecha
        ? new Date(residuo.fecha).toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : 'Sin fecha',
      descripcion: residuo.descripcion || 'Sin descripción',
      cultivo: residuo.cultivo?.nombre_cultivo || 'Sin cultivo',
      tipo_residuo: residuo.tipo_residuo?.nombre_residuo || 'Sin tipo',
    };
  });

  const headers = ['ID', 'Nombre', 'Fecha', 'Descripcion', 'Cultivo', 'Tipo Residuo'];

  return (
    <div className="overflow-x-auto shadow-md rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <button
            onClick={generarPDF}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mr-2"
          >
            Generar Reporte PDF
          </button>
        </div>
      </div>
      <Tabla
        title="Lista de Residuos"
        headers={headers}
        data={mappedResiduos}
        onClickAction={handleRowClick}
        onUpdate={handleUpdate}
        onCreate={handleCreate}
        createButtonTitle="Crear Residuo"
      />
      {selectedResiduo && (
        <VentanaModal
          isOpen={isModalOpen}
          onClose={closeModal}
          titulo="Detalles del Residuo"
          contenido={{
            ID: selectedResiduo.id,
            Nombre: selectedResiduo.nombre || 'Sin nombre',
            Fecha: selectedResiduo.fecha
              ? new Date(selectedResiduo.fecha).toLocaleDateString('es-CO', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : 'Sin fecha',
            Descripción: selectedResiduo.descripcion || 'Sin descripción',
            Cultivo: selectedResiduo.cultivo?.nombre_cultivo || 'Sin cultivo',
            'Tipo Residuo': selectedResiduo.tipo_residuo?.nombre_residuo || 'Sin tipo',
          }}
        />
      )}
    </div>
  );
};

export default ResiduosComponent;