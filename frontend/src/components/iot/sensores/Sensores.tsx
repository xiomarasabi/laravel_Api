import { useState } from 'react';
import { useSensores, Sensor } from '../../../hooks/iot/sensores/useSensores';
import Tabla from '../../globales/Tabla';
import VentanaModal from '../../globales/VentanasModales';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface TableRow {
  id: number;
  nombre_sensor: string;
  tipo_sensor: string;
  unidad_medida: string;
  descripcion: string;
  medida_minima: number;
  medida_maxima: number;
}

const Sensores = () => {
  const { data: sensores = [], isLoading, error } = useSensores();
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const openModalHandler = (sensor: Sensor) => {
    setSelectedSensor(sensor);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedSensor(null);
    setIsModalOpen(false);
  };

  const handleUpdate = (sensor: { id: number }) => {
    if (!sensor.id || isNaN(sensor.id)) {
      console.error('ID no válido para edición');
      return;
    }
    navigate(`/editar-sensor/${sensor.id}`);
  };

  const headers = ['Nombre sensor', 'Tipo sensor', 'Unidad medida', 'Descripcion', 'medida Minima', 'medida Maxima'];

  const handleRowClick = (row: TableRow) => {
    const sensor = sensores.find((s) => s.id === row.id);
    if (sensor) {
      openModalHandler(sensor);
    }
  };

  const handleCreate = () => {
    navigate('/crear-sensor');
  };

  const generarPDF = () => {
    if (isLoading) {
      alert('Cargando sensores, por favor espera.');
      return;
    }
    if (error) {
      alert('No se puede generar el PDF: error al cargar los sensores.');
      return;
    }
    if (!sensores.length) {
      alert('No hay sensores para generar el reporte.');
      return;
    }

    const doc = new jsPDF();
    doc.text('Reporte de Sensores', 14, 10);

    const tableData = sensores.map((item, index) => [
      index + 1,
      item.nombre_sensor || 'N/A',
      item.tipo_sensor || 'N/A',
      item.unidad_medida || 'N/A',
      item.descripcion || 'N/A',
      item.medida_minima !== undefined ? item.medida_minima : 'N/A',
      item.medida_maxima !== undefined ? item.medida_maxima : 'N/A',
    ]);

    autoTable(doc, {
      head: [['#', 'Nombre', 'Tipo', 'Unidad', 'Descripción', 'Mínimo', 'Máximo']],
      body: tableData,
      startY: 20,
      margin: { horizontal: 10 },
      styles: { overflow: 'linebreak' },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 30 },
        2: { cellWidth: 30 },
        3: { cellWidth: 30 },
        4: { cellWidth: 50 },
        5: { cellWidth: 20 },
        6: { cellWidth: 20 },
      },
    });

    doc.save('Reporte_Sensores.pdf');
  };

  if (isLoading) return <div className="text-center">Cargando sensores...</div>;
  if (error) return <div className="text-red-600 text-center">Error al cargar los sensores: {error.message}</div>;

  const mappedSensores: TableRow[] = sensores.map((sensor) => ({
    id: sensor.id,
    nombre_sensor: sensor.nombre_sensor || 'Sin nombre',
    tipo_sensor: sensor.tipo_sensor || 'Sin tipo',
    unidad_medida: sensor.unidad_medida || 'Sin unidad',
    descripcion: sensor.descripcion || 'Sin descripción',
    medida_minima: sensor.medida_minima !== undefined ? sensor.medida_minima : 0,
    medida_maxima: sensor.medida_maxima !== undefined ? sensor.medida_maxima : 0,
  }));

  return (
    <div className="overflow-x-auto rounded-lg p-4">
      <div className="flex justify-end items-center mb-4">
        <button
          onClick={generarPDF}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-green-300"
          disabled={isLoading || !sensores.length || !!error}
        >
          Generar Reporte PDF
        </button>
      </div>
      <Tabla
        title="Sensores"
        headers={headers}
        data={mappedSensores}
        onClickAction={handleRowClick}
        onUpdate={handleUpdate}
        onCreate={handleCreate}
        createButtonTitle="Crear Sensor"
      />
      {selectedSensor && (
        <VentanaModal
          isOpen={isModalOpen}
          onClose={closeModal}
          titulo="Detalles del Sensor"
          contenido={{
            ID: selectedSensor.id,
            Nombre: selectedSensor.nombre_sensor,
            Tipo: selectedSensor.tipo_sensor,
            Unidad: selectedSensor.unidad_medida,
            Descripción: selectedSensor.descripcion || 'Sin descripción',
            Mínimo: selectedSensor.medida_minima,
            Máximo: selectedSensor.medida_maxima,
          }}
        />
      )}
    </div>
  );
};

export default Sensores;