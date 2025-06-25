// src/pages/iot/IotPage.tsx (o Sensores.tsx según tu estructura)
import { useState } from 'react';
import { useSensores, Sensor } from '../../../hooks/iot/sensores/useSensores';
import Tabla from '../../globales/Tabla';
import VentanaModal from '../../globales/VentanasModales';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface TableRow {
  id: number;
  nombre: string;
  tipo: string;
  unidad: string;
  descripcion: string;
  minimo: number;
  maximo: number;
  evapotranspiracion: string;
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
    navigate(`/iot/editar-sensor/${sensor.id}`);
  };

  const headers = [ 'Nombre', 'Tipo', 'Unidad', 'Descripcion', 'Minimo', 'Maximo','Evapotranspiracion'];

  const handleRowClick = (row: TableRow) => {
    const originalSensor = sensores.find((s) => s.id_sensor === row.id);
    if (originalSensor) {
      openModalHandler(originalSensor);
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
      item.evapotranspiracion ? item.evapotranspiracion.toFixed(2) : 'N/A',
    ]);

    autoTable(doc, {
      head: [[ 'Nombre', 'Tipo', 'Unidad', 'Descripcion', 'Minimo', 'Maximo', 'Evapotranspiracion']],
      body: tableData,
      startY: 20,
      margin: { horizontal: 10 },
      styles: { overflow: 'linebreak' },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 30 },
        2: { cellWidth: 20 },
        3: { cellWidth: 20 },
        4: { cellWidth: 40 },
        5: { cellWidth: 20 },
        6: { cellWidth: 20 },
        7: { cellWidth: 20 },
      },
    });

    doc.save('Reporte_Sensores.pdf');
  };

  if (isLoading) return <div className="text-center">Cargando sensores...</div>;
  if (error) return <div className="text-red-600 text-center">Error al cargar los sensores: {error.message}</div>;

  // Forzamos datos vacíos si no hay sensores para evitar el mensaje "No se encontraron resultados"
  const mappedSensores = sensores.length > 0 ? sensores.map((sensor) => ({
    id: sensor.id_sensor,
    nombre: sensor.nombre_sensor,
    tipo: sensor.tipo_sensor,
    unidad: sensor.unidad_medida,
    descripcion: sensor.descripcion,
    minimo: sensor.medida_minima,
    maximo: sensor.medida_maxima,
    evapotranspiracion: sensor.evapotranspiracion ? sensor.evapotranspiracion.toFixed(2) : 'N/A',
  })) : [{ id: 0, nombre: '', tipo: '', unidad: '', descripcion: '', minimo: 0, maximo: 0, evapotranspiracion: '' }];

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
            ID: selectedSensor.id_sensor,
            Nombre: selectedSensor.nombre_sensor,
            Tipo: selectedSensor.tipo_sensor,
            Unidad: selectedSensor.unidad_medida,
            Descripción: selectedSensor.descripcion,
            Mínimo: selectedSensor.medida_minima,
            Máximo: selectedSensor.medida_maxima,
            Evapotranspiración: selectedSensor.evapotranspiracion ? selectedSensor.evapotranspiracion.toFixed(2) : 'N/A',
          }}
        />
      )}
    </div>
  );
};

export default Sensores;