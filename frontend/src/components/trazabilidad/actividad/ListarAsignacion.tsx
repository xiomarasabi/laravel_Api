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
    // Guardamos la asignación original, no el objeto mapeado
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

    let currentY = 20;
    autoTable(doc, {
      head: [['ID', 'Fecha', 'Actividad', 'Usuario', 'Email']],
      body: asignaciones.map((asignacion) => [
        asignacion.id,
        asignacion.fecha
          ? new Date(asignacion.fecha).toLocaleDateString('es-ES')
          : 'Sin fecha',
        asignacion.fk_id_actividad?.nombre_actividad || 'Sin actividad',
        asignacion.fk_id_actividad?.fk_identificacion?.nombre || 'Sin usuario',
        asignacion.fk_id_actividad?.fk_identificacion?.email || 'Sin email',
      ]),
      startY: currentY,
    });
    currentY = doc.internal.pageSize.height - 10;

    const actividadReporte = asignaciones.reduce((acc, asignacion) => {
      const nombre = asignacion.fk_id_actividad?.nombre_actividad || 'Sin nombre';
      if (!acc[nombre]) {
        acc[nombre] = [];
      }
      acc[nombre].push(asignacion);
      return acc;
    }, {} as Record<string, any[]>);

    doc.text('Reporte de Actividades por Nombre', 14, currentY + 10);
    currentY += 20;

    Object.entries(actividadReporte).forEach(([nombre, asignacionesGrupo]) => {
      doc.text(`${nombre} (Cantidad: ${asignacionesGrupo.length})`, 14, currentY);
      currentY += 10;

      autoTable(doc, {
        head: [['ID', 'Fecha', 'Actividad', 'Usuario', 'Email']],
        body: asignacionesGrupo.map((asignacion) => [
          asignacion.id,
          asignacion.fecha
            ? new Date(asignacion.fecha).toLocaleDateString('es-ES')
            : 'Sin fecha',
          asignacion.fk_id_actividad?.nombre_actividad || 'Sin actividad',
          asignacion.fk_id_actividad?.fk_identificacion?.nombre || 'Sin usuario',
          asignacion.fk_id_actividad?.fk_identificacion?.email || 'Sin email',
        ]),
        startY: currentY,
      });

      currentY += 10;
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
          // Pasamos el objeto asignacion original a onClickAction
          data={asignaciones.map((asignacion) => ({
            id: asignacion.id,
            fecha: asignacion.fecha
              ? new Date(asignacion.fecha).toLocaleDateString('es-ES')
              : 'Sin fecha',
            actividad: asignacion.fk_id_actividad?.nombre_actividad || 'Sin actividad',
            usuario: asignacion.fk_id_actividad?.fk_identificacion?.nombre || 'Sin usuario',
            email: asignacion.fk_id_actividad?.fk_identificacion?.email || 'Sin email',
            original: asignacion, // Añadimos el objeto original
          }))}
          onClickAction={(row) => openModalHandler(row.original)} // Pasamos el objeto original
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
            ID: selectedAsignacion.id,
            Fecha: selectedAsignacion.fecha
              ? new Date(selectedAsignacion.fecha).toLocaleDateString('es-ES')
              : 'Sin fecha',
            Actividad: selectedAsignacion.fk_id_actividad?.nombre_actividad || 'Sin actividad',
            Descripción: selectedAsignacion.fk_id_actividad?.descripcion || 'Sin descripción',
            Usuario: selectedAsignacion.fk_id_actividad?.fk_identificacion?.nombre || 'Sin usuario',
            Email: selectedAsignacion.fk_id_actividad?.fk_identificacion?.email || 'Sin email',
            Rol: selectedAsignacion.fk_id_actividad?.fk_identificacion?.fk_id_rol?.nombre_rol || 'Sin rol',
          }}
        />
      )}
    </div>
  );
};

export default Asignaciones;