// UbicacionesComponent.tsx
import { useState } from 'react';
import { useUbicaciones, Ubicacion } from '@/hooks/iot/ubicacion/useUbicacion';
import VentanaModal from '@/components/globales/VentanasModales';
import Tabla from '@/components/globales/Tabla';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const UbicacionesComponent = () => {
  const { data: ubicaciones, isLoading, error } = useUbicaciones();
  const [selectedUbicacion, setSelectedUbicacion] = useState<Ubicacion | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const openModalHandler = (ubicacion: Ubicacion) => {
    setSelectedUbicacion(ubicacion);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedUbicacion(null);
    setIsModalOpen(false);
  };

  const handleRowClick = (ubicacion: { id_ubicacion: number }) => {
    const selected = ubicaciones?.find((u) => u.id_ubicacion === ubicacion.id_ubicacion);
    if (selected) openModalHandler(selected);
  };

  const handleUpdate = (ubicacion: { id_ubicacion: number }) => {
    navigate(`/ubicaciones/editar/${ubicacion.id_ubicacion}`);
  };

  const handleCreate = () => {
    navigate('/crearubicacion');
  };

  const generarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Lista de Ubicaciones', 14, 15);

    const tableData = mappedUbicaciones.map((ubicacion) => [
      ubicacion.id,
      ubicacion.latitud,
      ubicacion.longitud,
    ]);

    autoTable(doc, {
      head: [['ID', 'Latitud', 'Longitud']],
      body: tableData,
      startY: 20,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [22, 101, 52] },
    });

    doc.save('ubicaciones.pdf');
  };

  if (isLoading) return <div className="text-center">Cargando ubicaciones...</div>;
  if (error)
    return (
      <div className="text-red-500 text-center">
        Error al cargar las ubicaciones: {error.message}
      </div>
    );

  const ubicacionesList = Array.isArray(ubicaciones) ? ubicaciones : [];

  const mappedUbicaciones = ubicacionesList.map((ubicacion) => ({
    id: ubicacion.id_ubicacion,
    latitud: ubicacion.latitud.toFixed(8), // Formatear para mejor legibilidad
    longitud: ubicacion.longitud.toFixed(8),
  }));

  const headers = ['ID', 'Latitud', 'Longitud'];

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
        title="Listar Ubicaciones"
        headers={headers}
        data={mappedUbicaciones}
        onClickAction={handleRowClick}
        onUpdate={handleUpdate}
        onCreate={handleCreate}
        createButtonTitle="Crear"
      />

      {selectedUbicacion && (
        <VentanaModal
          isOpen={isModalOpen}
          onClose={closeModal}
          titulo="Detalles de la Ubicación"
          contenido={{
            ID: selectedUbicacion.id_ubicacion,
            Latitud: selectedUbicacion.latitud.toFixed(8),
            Longitud: selectedUbicacion.longitud.toFixed(8),
          }}
        />
      )}
    </div>
  );
};

export default UbicacionesComponent;