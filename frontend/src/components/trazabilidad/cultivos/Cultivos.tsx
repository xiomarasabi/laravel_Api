// src/components/Cultivos.tsx

import { useState } from 'react';
import { useCultivo, Cultivos } from '../../../hooks/trazabilidad/cultivo/useCultivo'; // Importamos la interfaz Cultivos
import VentanaModal from '../../globales/VentanasModales';
import Tabla from '../../globales/Tabla';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const CultivosComponent = () => {
  const { data: cultivos, isLoading, error } = useCultivo();
  const [selectedCultivo, setSelectedCultivo] = useState<Cultivos | null>(null); // Usamos la interfaz Cultivos
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const openModalHandler = (cultivo: Cultivos) => {
    setSelectedCultivo(cultivo);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedCultivo(null);
    setIsModalOpen(false);
  };

  const handleRowClick = (cultivo: { id: number }) => {
    const selected = cultivos?.find((c) => c.id_cultivo === cultivo.id);
    if (selected) openModalHandler(selected);
  };

  const handleUpdate = (cultivo: { id: number }) => {
    navigate(`/actualizarcultivo/${cultivo.id}`);
  };

  const handleCreate = () => {
    navigate('/crearcultivo');
  };

  const generarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Cultivos Activos', 14, 15);

    const tableData = mappedCultivos.map((cultivo) => [
      cultivo.id,
      cultivo.nombre,
      cultivo.fecha_plantacion,
      cultivo.descripcion,
      cultivo.especie,
      cultivo.semillero,
      cultivo.nombre_cientifico || 'N/A',
      cultivo.tipo_cultivo || 'N/A',
    ]);

    autoTable(doc, {
      head: [headers],
      body: tableData,
      startY: 20,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [34, 197, 94] },
    });

    doc.save('cultivos-activos.pdf');
  };

  if (isLoading) return <div className="text-center">Cargando cultivos...</div>;
  if (error)
    return (
      <div className="text-red-500 text-center">
        Error al cargar los cultivos: {error.message}
      </div>
    );

  const cultivosList = Array.isArray(cultivos) ? cultivos : [];

  const mappedCultivos = cultivosList.map((cultivo) => ({
    id: cultivo.id_cultivo,
    nombre: cultivo.nombre_cultivo,
    fecha_plantacion: new Date(cultivo.fecha_plantacion).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    descripcion: cultivo.descripcion || 'Sin descripción',
    especie: cultivo.fk_id_especie?.nombre_comun || 'Sin especie',
    semillero: cultivo.fk_id_semillero?.nombre_semilla || 'Sin semillero',
    nombre_cientifico: cultivo.fk_id_especie?.nombre_cientifico || 'N/A',
    tipo_cultivo: cultivo.fk_id_especie?.fk_id_tipo_cultivo?.nombre || 'N/A',
  }));

  const headers = [
    'ID',
    'Nombre',
    'Fecha_Plantacion',
    'descripcion',
    'Especie',
    'Semillero',
  ];

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
        title="Listar Cultivos"
        headers={headers}
        data={mappedCultivos}
        onClickAction={handleRowClick}
        onUpdate={handleUpdate}
        onCreate={handleCreate}
        createButtonTitle="Crear"
      />

      {selectedCultivo && (
        <VentanaModal
          isOpen={isModalOpen}
          onClose={closeModal}
          titulo="Detalles del Cultivo"
          contenido={{
            ID: selectedCultivo.id_cultivo,
            Nombre: selectedCultivo.nombre_cultivo,
            'Fecha Plantación': new Date(selectedCultivo.fecha_plantacion).toLocaleDateString('es-CO'),
            Descripción: selectedCultivo.descripcion,
            Especie: selectedCultivo.fk_id_especie?.nombre_comun || 'Sin especie',
            'Nombre Científico': selectedCultivo.fk_id_especie?.nombre_cientifico || 'N/A',
            'Tipo de Cultivo': selectedCultivo.fk_id_especie?.fk_id_tipo_cultivo?.nombre || 'N/A',
            Semillero: selectedCultivo.fk_id_semillero?.nombre_semilla || 'Sin semillero',
            'Fecha Siembra': selectedCultivo.fk_id_semillero?.fecha_siembra
              ? new Date(selectedCultivo.fk_id_semillero.fecha_siembra).toLocaleDateString('es-CO')
              : 'N/A',
            'Fecha Estimada': selectedCultivo.fk_id_semillero?.fecha_estimada
              ? new Date(selectedCultivo.fk_id_semillero.fecha_estimada).toLocaleDateString('es-CO')
              : 'N/A',
            Cantidad: selectedCultivo.fk_id_semillero?.cantidad || 'N/A',
          }}
        />
      )}
    </div>
  );
};

export default CultivosComponent;