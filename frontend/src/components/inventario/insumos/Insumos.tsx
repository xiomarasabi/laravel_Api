import { useEffect, useState } from 'react';
import { useInsumo } from '../../../hooks/inventario/insumos/useInsumo';
import { Insumo } from '../../../hooks/inventario/insumos/useInsumo';
import Tabla from '../../globales/Tabla';
import VentanaModal from '../../globales/VentanasModales';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Insumos = () => {
  const { data: insumo, isLoading, error, refetch } = useInsumo(); 
  const [selectedInsumo, setSelectedInsumo] = useState<Insumo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedInsumo) {
      console.log("Insumo seleccionado:", selectedInsumo);
    }
  }, [selectedInsumo]);

  // Efecto para actualizar los datos automáticamente
  useEffect(() => {
    const interval = setInterval(() => {
      refetch(); 
    }, 1000); 

    return () => clearInterval(interval);
  }, [refetch]);

  const openModalHandler = (insumo: Insumo) => {
    setSelectedInsumo(insumo);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedInsumo(null);
    setIsModalOpen(false);
  };

  const headers = ["id", "Nombre", "Tipo", "Precio Unidad", "Cantidad", "Unidad Medida"];

  const handleRowClick = (insumo: Insumo) => {
    openModalHandler(insumo);
  };

  const handleUpdate = (residuo: { id: number }) => {
    navigate(`/ActualizarInsumos/${residuo.id}`);
  };

  const handleCreate = () => {
    navigate("/crearinsumos");
  };

  const generarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Reporte de Insumos', 10, 10);

    if (mappedInsumo.length > 0) {
      const tableData = mappedInsumo.map(item => [
        item.id,
        item.nombre,
        item.tipo,
        item.precio_unidad,
        item.cantidad,
        item.unidad_medida,
      ]);

      autoTable(doc,{
        head: [['ID', 'Nombre', 'Tipo', 'Precio Unidad', 'Cantidad', 'Unidad Medida']],
        body: tableData,
        startY: 20,
      });

      doc.save(`reporte_insumos_${new Date().toLocaleDateString('es-ES')}.pdf`);
    } else {
      doc.text('No hay datos disponibles para el reporte.', 10, 20);
      doc.save(`reporte_insumos_vacio_${new Date().toLocaleDateString('es-ES')}.pdf`);
    }
  };

  if (isLoading) return <div className="text-gray-500">Cargando insumos...</div>;
  if (error instanceof Error) return <div className="text-red-500">Error al cargar los insumos: {error.message}</div>;

  const InsumoList = Array.isArray(insumo) ? insumo : [];

  const mappedInsumo = Array.isArray(InsumoList)
    ? InsumoList.map(insumo => ({
        id: insumo.id_insumo,
        nombre: insumo.nombre,
        tipo: insumo.tipo,
        precio_unidad: insumo.precio_unidad,
        cantidad: insumo.cantidad,
        unidad_medida: insumo.unidad_medida,
      }))
    : [];

  console.log("mappedInsumo:", mappedInsumo, Array.isArray(mappedInsumo));

  return (
    <div className="mx-auto p-4">
      <div className="flex gap-4 mb-4">
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          onClick={generarPDF}
        >
          Descargar PDF
        </button>
      </div>

      <Tabla
        title="Insumos"
        headers={headers}
        data={mappedInsumo}
        onClickAction={handleRowClick}
        onUpdate={handleUpdate}
        onCreate={handleCreate}
        createButtonTitle="Crear"
      />

      {selectedInsumo && (
        <VentanaModal
          isOpen={isModalOpen}
          onClose={closeModal}
          titulo="Detalles del Insumo"
          contenido={selectedInsumo}
        />
      )}
    </div>
  );
};

export default Insumos;