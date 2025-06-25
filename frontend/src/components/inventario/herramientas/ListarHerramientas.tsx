import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useHerramientas,
  Herramientas,
} from "@/hooks/inventario/herramientas/useHerramientas";
import Tabla from "../../globales/Tabla";
import VentanaModal from "../../globales/VentanasModales";

const ListarHerramientas = () => {
  const { data: herramientas, isLoading, error } = useHerramientas();
  const [selectedHerramientas, setSelectedHerramientas] =
    useState<Herramientas | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleRowClick = (herramienta: Herramientas) => {
    setSelectedHerramientas(herramienta);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedHerramientas(null);
    setIsModalOpen(false);
  };

  const handleUpdate = (herramienta: { id_herramienta: number }) => {
    navigate(`/ActualizarHerramienta/${herramienta.id_herramienta}`);
  };

  const handleCreate = () => {
    navigate("/CrearHerramientas");
  };

  if (isLoading) return <div>Cargando herramientas...</div>;
  if (error instanceof Error)
    return <div>Error al cargar herramientas: {error.message}</div>;

  const mappedHerramientas =
    herramientas?.map((h) => ({
      id_herramienta: h.id_herramienta,
      nombre: h.nombre_h,
      estado: h.estado,
      fecha_prestamo: h.fecha_prestamo
        ? new Date(h.fecha_prestamo).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
        : "N/A",
    })) || [];

  return (
    <div>
      <Tabla
        title="Herramientas"
        headers={["id herramienta", "Nombre", "Estado", "Fecha Prestamo"]}
        data={mappedHerramientas}
        onClickAction={handleRowClick}
        onUpdate={handleUpdate}
        onCreate={handleCreate}
        createButtonTitle="Crear"
      />
      {selectedHerramientas && (
        <VentanaModal
          isOpen={isModalOpen}
          onClose={closeModal}
          titulo="Detalles de Herramienta"
          contenido={{
            id_herramienta: selectedHerramientas.id_herramienta,
            nombre: selectedHerramientas.nombre_h,
            estado: selectedHerramientas.estado,
            fecha_prestamo: selectedHerramientas.fecha_prestamo
              ? new Date(
                  selectedHerramientas.fecha_prestamo
                ).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })
              : "N/A",
          }}
        />
      )}
    </div>
  );
};

export default ListarHerramientas;
