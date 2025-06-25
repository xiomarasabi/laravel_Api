import { useState } from "react";
import { useProduccion } from "../../../hooks/finanzas/produccion/useProduccion";
import Tabla from "../../globales/Tabla";
import VentanaModal from "../../globales/VentanasModales";
import { useNavigate } from "react-router-dom";
import useReporteProduccionPDF from "@/hooks/finanzas/produccion/useReporteProduccion";

// Función para formatear fechas en formato dd/mm/yyyy
const formatearFecha = (fechaISO: string) => {
  const fecha = new Date(fechaISO);
  return fecha.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const ProduccionComponent = () => {
  const navigate = useNavigate();
  const { data: producciones, isLoading, error } = useProduccion();
  const [selectedProduccion, setSelectedProduccion] = useState<object | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { generarPDF: generarReporteProduccion } = useReporteProduccionPDF();

  const openModalHandler = (produccion: object) => {
    setSelectedProduccion(produccion);
    setIsModalOpen(true);
  };

  const handleRowClick = (produccion: { id_produccion: number }) => {
    openModalHandler(produccion);
  };

  const closeModal = () => {
    setSelectedProduccion(null);
    setIsModalOpen(false);
  };

  const handleUpdate = (cultivo: { id_produccion: number }) => {
    navigate(`/actualizarproduccion/${cultivo.id_produccion}`);
  };

  const handleCreate = () => {
    navigate("/Registrar-Producción");
  };

  const irAGrafica = () => {
    navigate("/grafica-produccion");
  };

  if (isLoading) return <div className="text-center text-gray-500">Cargando producciones...</div>;
  if (error instanceof Error) return <div className="text-center text-red-500">Error al cargar los datos: {error.message}</div>;

  // Mapeo de los datos para la tabla
  const produccionList = Array.isArray(producciones) ? producciones : [];
  const mappedProducciones = produccionList.map((produccion) => ({
    id_produccion: produccion.id_produccion,
    nombre_produccion: produccion.nombre_produccion,
    cantidad_producida: produccion.cantidad_producida ?? null,
    fecha_producción: produccion.fecha_produccion
      ? formatearFecha(produccion.fecha_produccion)
      : "No disponible",
    nombre_cultivo: produccion.cultivo?.nombre_cultivo ?? "No disponible",
    fecha_plantación: produccion.cultivo?.fecha_plantacion
      ? formatearFecha(produccion.cultivo.fecha_plantacion)
      : "No disponible"
  }));

  const headers = ["ID Produccion", "Cantidad Producida", "Fecha Producción", "Nombre Cultivo", "Fecha Plantación"];

  return (
    <div className="mx-auto p-4">
      <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
        <button
          onClick={generarReporteProduccion}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Generar Reporte PDF
        </button>
        <button
          onClick={irAGrafica}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Ver gráfica
        </button>
      </div>

      <Tabla
        title="Lista de Producciones"
        headers={headers}
        data={mappedProducciones}
        onClickAction={handleRowClick}
        onUpdate={handleUpdate}
        onCreate={handleCreate}
        createButtonTitle="Crear"
      />

      {selectedProduccion && (
        <VentanaModal
          isOpen={isModalOpen}
          onClose={closeModal}
          titulo="Detalles de Producción"
          contenido={selectedProduccion}
        />
      )}
    </div>
  );
};

export default ProduccionComponent;
