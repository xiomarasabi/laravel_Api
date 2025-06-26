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

  const handleUpdate = (herramienta: { id: number }) => {
    navigate(`/ActualizarHerramienta/${herramienta.id}`);
  };

  const handleCreate = () => {
    navigate("/CrearHerramientas");
  };

  if (isLoading) return <div>Cargando herramientas...</div>;
  if (error instanceof Error)
    return <div>Error al cargar herramientas: {error.message}</div>;

  const mappedHerramientas =
    herramientas?.map((h) => ({
      id: h.id,
      nombre: h.nombre,
      cantidad: h.cantidad,
      precio: h.precio,
      estado: h.estado,
    })) || [];

  return (
    <div>
      <Tabla
        title="Herramientas"
        headers={["id", "Nombre", "cantidad","precio","Estado"]}
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
            id_herramienta: selectedHerramientas.id,
            nombre: selectedHerramientas.nombre,
            cantidad: selectedHerramientas.cantidad,
            estado: selectedHerramientas.estado,
            precio: selectedHerramientas.precio
          }}
        />
      )}
    </div>
  );
};

export default ListarHerramientas;
