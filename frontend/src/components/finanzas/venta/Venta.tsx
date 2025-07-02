import { useState } from 'react';
import { useVenta } from '../../../hooks/finanzas/venta/useVenta';
import Tabla from '../../globales/Tabla';
import VentanaModal from '../../globales/VentanasModales';
import { useNavigate } from "react-router-dom";
import useReporteVentasPDF from '../../../hooks/finanzas/venta/useReporteVenta';
import useReporteMensualPDF from '@/hooks/finanzas/venta/useReportePorMes';

const VentaComponent = () => {
  const navigate = useNavigate();
  const { data: ventas, isLoading, error } = useVenta();
  const { generarPDF } = useReporteVentasPDF();
  const { generarPDF: generarReportePorMes } = useReporteMensualPDF();
  const [selectedVenta, setSelectedVenta] = useState<object | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModalHandler = (venta: object) => {
    setSelectedVenta(venta);
    setIsModalOpen(true);
  };

  const handleRowClick = (venta: { id: number }) => {
    openModalHandler(venta);
  };

  const closeModal = () => {
    setSelectedVenta(null);
    setIsModalOpen(false);
  };

  const handleUpdate = (cultivo: { id: number }) => {
    navigate(`/actualizarventa/${cultivo.id}`);
  };

  const handleCreate = () => {
    navigate("/Registrar-Venta");
  };

  const irAGraficas = () => {
    navigate("/graficas-ventas");
  };

  if (isLoading) return <div className="text-center text-gray-500">Cargando ventas...</div>;
  if (error) return <div className="text-center text-red-500">Error al cargar los datos: {error.message}</div>;

  const ventasList = Array.isArray(ventas) ? ventas : [];
  console.log ('ventas array', ventasList)

  const mappedVentas = ventasList.map((venta) => ({
    id: venta.id,
    cantidad: venta.cantidad,
    precio_unitario: venta.precio_unitario,
    total_venta: venta.cantidad * venta.precio_unitario,
    fecha_venta: new Date(venta.fecha_venta).toLocaleDateString(),
    cantidad_producida: venta.produccion?.cantidad_producida ?? "No disponible",
    fecha_produccion: venta.produccion?.fecha_produccion
      ? new Date(venta.produccion.fecha_produccion).toLocaleDateString()
      : "No disponible",
  }));

  const headers = [
    "ID",
    "Cantidad",
    "Precio Unitario",
    "Total Venta",
    "Fecha Venta",
    "Cantidad Producida",
    "Fecha Produccion"
  ];

  return (
    <div className="mx-auto p-4">
      <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
        <button
          onClick={generarPDF}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Generar Reporte PDF
        </button>
        <button
          onClick={generarReportePorMes}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
        >
          Reporte por Mes
        </button>
        <button
          onClick={irAGraficas}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Ver Gráficas
        </button>
      </div>

      <Tabla
        title="Lista de Ventas"
        headers={headers}
        data={mappedVentas}
        onClickAction={handleRowClick}
        onUpdate={handleUpdate}
        onCreate={handleCreate}
        createButtonTitle="Crear"
      />

      {selectedVenta && (
        <VentanaModal
          isOpen={isModalOpen}
          onClose={closeModal}
          titulo="Detalles de Venta"
          contenido={selectedVenta}
        />
      )}
    </div>
  );
};

export default VentaComponent;
