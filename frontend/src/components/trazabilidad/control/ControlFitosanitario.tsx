import { useState } from 'react';
import { useControlFitosanitario, ControlFitosanitario } from '../../../hooks/trazabilidad/control/useControlFitosanitario';
import VentanaModal from '../../globales/VentanasModales';
import Tabla from '../../globales/Tabla';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ControlFitosanitariosComponent = () => {
  const { data: controlFitosanitarios, isLoading, error } = useControlFitosanitario();
  const [selectedControl, setSelectedControl] = useState<ControlFitosanitario | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const openModalHandler = (control: ControlFitosanitario) => {
    setSelectedControl(control);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedControl(null);
    setIsModalOpen(false);
  };

  const handleRowClick = (control: { id: number }) => {
    const selected = controlFitosanitarios?.find((c) => c.id === control.id);
    if (selected) openModalHandler(selected);
  };

  const handleUpdate = (control: { id: number }) => {
    navigate(`/controlfitosanitario/editar/${control.id}`); // Corregido
  };

  const handleCreate = () => {
    navigate('/crearcontrolfitosanitario');
  };

  const generarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Controles Fitosanitarios', 14, 15);

    const tableData = mappedControles.map((control) => [
      control.id,
      control.fecha_control,
      control.descripcion,
      control.cultivo,
      control.pea,
    ]);

    autoTable(doc, {
      head: [['ID', 'Fecha Control', 'Descripción', 'Cultivo', 'PEA']],
      body: tableData,
      startY: 20,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [22, 101, 52] },
    });

    doc.save('controles-fitosanitarios.pdf');
  };

  if (isLoading) return <div className="text-center">Cargando controles...</div>;
  if (error)
    return (
      <div className="text-red-500 text-center">
        Error al cargar los controles: {error.message}
      </div>
    );

  const controlesList = Array.isArray(controlFitosanitarios) ? controlFitosanitarios : [];

  const mappedControles = controlesList.map((control) => ({
    id: control.id,
    fecha_control: new Date(control.fecha_control).toLocaleDateString('es-CO'),
    descripcion: control.descripcion || 'Sin descripción',
    cultivo: control.desarrollan.cultivo.nombre_cultivo || 'Sin cultivo',
    pea: control.desarrollan.pea.nombre || 'Sin PEA',
  }));

  const headers = ['ID', 'Fecha Control', 'Descripcion', 'Cultivo', 'PEA'];

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
        title="Listar Controles Fitosanitarios"
        headers={headers}
        data={mappedControles}
        onClickAction={handleRowClick}
        onUpdate={handleUpdate}
        onCreate={handleCreate}
        createButtonTitle="Crear"
      />

      {selectedControl && (
        <VentanaModal
          isOpen={isModalOpen}
          onClose={closeModal}
          titulo="Detalles del Control Fitosanitario"
          contenido={{
            ID: selectedControl.id,
            'Fecha Control': new Date(selectedControl.fecha_control).toLocaleDateString('es-CO'),
            Descripción: selectedControl.descripcion || 'Sin descripción',
            Cultivo: selectedControl.desarrollan.cultivo.nombre_cultivo || 'Sin cultivo',
            PEA: selectedControl.desarrollan.pea.nombre || 'Sin PEA',
          }}
        />
      )}
    </div>
  );
};

export default ControlFitosanitariosComponent;