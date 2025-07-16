import { useState, useCallback } from 'react';
import { useAsignacion } from '@/hooks/trazabilidad/asignacion/useAsignacion';
import { useNavigate } from 'react-router-dom';
import Tabla from '../../globales/Tabla';
import VentanaModal from '../../globales/VentanasModales';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Asignaciones = () => {
  const navigate = useNavigate();
  const { data: asignaciones = [], isLoading, error } = useAsignacion();
  const [selectedAsignacion, setSelectedAsignacion] = useState<Record<string, any> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModalHandler = useCallback((asignacion: Record<string, any>) => {
    setSelectedAsignacion(asignacion);
    setIsModalOpen(true);
  }, []);

  const handleUpdate = (asignacion: Record<string, any>) => {
    navigate(`/ActualizarAsignacion/${asignacion.id}`);
  };

  const handleCreate = () => {
    navigate('/CrearAsignacion/');
  };

  const closeModal = useCallback(() => {
    setSelectedAsignacion(null);
    setIsModalOpen(false);
  }, []);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Lista de Asignaciones', 14, 10);

    // Tabla principal de asignaciones
    autoTable(doc, {
      head: [['Id_asignacion_actividades', 'Fecha', 'Actividad', 'Usuario', 'Email']],
      body: asignaciones.map((asignacion) => [
        asignacion.id_asignacion_actividad,
        asignacion.fecha
          ? new Date(asignacion.fecha).toLocaleDateString('es-ES')
          : 'Sin fecha',
        asignacion.actividad?.nombre_actividad || 'Sin actividad',
        asignacion.user?.nombre || 'Sin usuario',
        asignacion.user?.email || 'Sin email',
      ]),
      startY: 20,
    });

    // Reporte agrupado por actividad
    const actividadReporte = asignaciones.reduce((acc, asignacion) => {
      const nombre = asignacion.actividad?.nombre_actividad || 'Sin actividad';
      if (!acc[nombre]) {
        acc[nombre] = [];
      }
      acc[nombre].push(asignacion);
      return acc;
    }, {} as Record<string, any[]>);

    let currentY = (doc as any).lastAutoTable.finalY + 10; // Posición después de la tabla principal

    doc.text('Reporte de Actividades por Nombre', 14, currentY);
    currentY += 10;

    Object.entries(actividadReporte).forEach(([nombre, asignacionesGrupo]) => {
      doc.text(`${nombre} (Cantidad: ${asignacionesGrupo.length})`, 14, currentY);
      currentY += 10;

      autoTable(doc, {
        head: [['ID', 'Fecha', 'Actividad', 'Usuario', 'Email']],
        body: asignacionesGrupo.map((asignacion) => [
          asignacion.id ||'sin id',
          asignacion.fecha
            ? new Date(asignacion.fecha).toLocaleDateString('es-ES')
            : 'Sin fecha',
          asignacion.actividad?.nombre_actividad || 'Sin actividad',
          asignacion.user?.nombre || 'Sin usuario',
          asignacion.user?.email || 'Sin email',
        ]),
        startY: currentY,
      });

      currentY = (doc as any).lastAutoTable.finalY + 10;
    });

    doc.save('asignaciones.pdf');
  };

  const headers = ['ID', 'Fecha', 'Actividad', 'Usuario', 'Email'];

  return (
    <div className="overflow-x-auto rounded-lg p-4">
      <div className="flex justify-start gap-2 mb-4">
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          onClick={handleDownloadPDF}
        >
          Descargar PDF
        </button>
      </div>

      {isLoading && (
        <div className="text-center text-gray-500">Cargando asignaciones...</div>
      )}

      {error instanceof Error && (
        <div className="text-center text-red-500">
          Error al cargar las asignaciones: {error.message}
        </div>
      )}

      {!isLoading && !error && (!Array.isArray(asignaciones) || asignaciones.length === 0) && (
        <div className="text-center text-gray-500">No hay asignaciones registradas.</div>
      )}

      {Array.isArray(asignaciones) && asignaciones.length > 0 && (
        <Tabla
          title="Lista de Asignaciones"
          headers={headers}
          data={asignaciones.map((asignacion) => ({
            id: asignacion.id_asignacion_actividad || 'sin id',
            fecha: asignacion.fecha
              ? new Date(asignacion.fecha).toLocaleDateString('es-ES')
              : 'Sin fecha',
            actividad: asignacion.actividad?.nombre_actividad || 'Sin actividad',
            usuario: asignacion.user?.nombre || 'Sin usuario',
            email: asignacion.user?.email || 'Sin email',
            original: asignacion, // Objeto original para acciones
          }))}
          onClickAction={(row) => openModalHandler(row.original)}
          onUpdate={handleUpdate}
          onCreate={handleCreate}
          createButtonTitle="Crear"
        />
      )}

      {selectedAsignacion && (
        <VentanaModal
          isOpen={isModalOpen}
          onClose={closeModal}
          titulo="Detalles de la Asignación"
          contenido={{
            ID: selectedAsignacion.id || 'sin id',
            Fecha: selectedAsignacion.fecha
              ? new Date(selectedAsignacion.fecha).toLocaleDateString('es-ES')
              : 'Sin fecha',
            Actividad: selectedAsignacion.actividad?.nombre_actividad || 'Sin actividad',
            Descripción: selectedAsignacion.actividad?.descripcion || 'Sin descripción',
            Usuario: selectedAsignacion.user?.nombre || 'Sin usuario',
            Email: selectedAsignacion.user?.email || 'Sin email',
            Rol: selectedAsignacion.user?.fk_id_rol?.nombre_rol || 'Sin rol',
          }}
        />
      )}
    </div>
  );
};

export default Asignaciones;