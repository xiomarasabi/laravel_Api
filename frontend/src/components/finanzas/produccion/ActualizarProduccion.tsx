import { useState, useEffect } from "react";
import { useActualizarProduccion } from "../../../hooks/finanzas/produccion/useActualizarProduccion";
import { useNavigate, useParams } from "react-router-dom";
import { useProduccionId } from "../../../hooks/finanzas/produccion/useProduccionId";
import Formulario from "../../globales/Formulario";
// Hooks supuestos para obtener cultivos y lotes
import { useCultivo } from "../../../hooks/trazabilidad/cultivo/useCultivo";
import { useLotes } from "../../../hooks/iot/lote/useLotes";

const ActualizarProduccion = () => {
  const { id_produccion } = useParams();
  const { data: produccion, isLoading, error } = useProduccionId(id_produccion);
  const { data: cultivos = [] } = useCultivo(); // Hook para obtener cultivos
  const { data: lotes = [] } = useLotes(); // Hook para obtener lotes
  const actualizarProduccion = useActualizarProduccion();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fk_id_cultivo: "",
    nombre_produccion: "",
    cantidad_producida: "",
    fecha_produccion: "",
    fk_id_lote: "",
    descripcion_produccion: "",
    estado: "",
    fecha_cosecha: "",
  });

  useEffect(() => {
    console.log("Producción:", produccion); // Depuración
    console.log("Cultivos:", cultivos); // Depuración
    console.log("Lotes:", lotes); // Depuración
    if (produccion) {
      setFormData({
        fk_id_cultivo: produccion.cultivo?.id ? String(produccion.cultivo.id) : "",
        nombre_produccion: produccion.nombre_produccion || "",
        cantidad_producida: produccion.cantidad_producida?.toString() || "",
        fecha_produccion: produccion.fecha_produccion?.substring(0, 10) || "", // Formato yyyy-mm-dd
        fk_id_lote: produccion.lote?.id ? String(produccion.lote.id) : "",
        descripcion_produccion: produccion.descripcion_produccion || "",
        estado: produccion.estado || "",
        fecha_cosecha: produccion.fecha_cosecha?.substring(0, 10) || "", // Formato yyyy-mm-dd
      });
    }
  }, [produccion]);

  const handleSubmit = (data: { [key: string]: string }) => {
    if (!id_produccion) return;

    const produccionActualizada = {
      id_produccion: Number(id_produccion),
      nombre_produccion: data.nombre_produccion,
      fk_id_cultivo: data.fk_id_cultivo ? parseInt(data.fk_id_cultivo, 10) : null,
      cantidad_producida: parseFloat(data.cantidad_producida),
      fecha_produccion: data.fecha_produccion,
      fk_id_lote: data.fk_id_lote ? parseInt(data.fk_id_lote, 10) : null,
      descripcion_produccion: data.descripcion_produccion,
      estado: data.estado,
      fecha_cosecha: data.fecha_cosecha,
    };

    actualizarProduccion.mutate(produccionActualizada, {
      onSuccess: () => {
        setTimeout(() => navigate("/produccion"), 500);
      },
      onError: (error) => {
        console.error("❌ Error al actualizar producción:", error);
      },
    });
  };

  if (isLoading) return <div className="text-gray-500">Cargando datos...</div>;
  if (error) return <div className="text-red-500">Error al cargar la producción: {error.message}</div>;
  if (!cultivos.length || !lotes.length) return <div className="text-yellow-500">Cargando cultivos o lotes...</div>;

  const fields = [
    {
      id: "fk_id_cultivo",
      label: "Cultivo",
      type: "select",
      options: cultivos.map((cultivo) => ({
        value: String(cultivo.id_cultivo),
        label: cultivo.nombre_cultivo || `Cultivo ID ${cultivo.id_cultivo}`,
      })),
    },
    { id: "nombre_produccion", label: "Nombre", type: "text" },
    { id: "cantidad_producida", label: "Cantidad Producida", type: "number" },
    { id: "fecha_produccion", label: "Fecha Producción", type: "date" },
    {
      id: "fk_id_lote",
      label: "Lote",
      type: "select",
      options: lotes.map((lote) => ({
        value: String(lote.id),
        label: lote.nombre_lote || `Lote ID ${lote.id}`,
      })),
    },
    { id: "descripcion_produccion", label: "Descripción", type: "text" },
    {
      id: "estado",
      label: "Estado",
      type: "select",
      options: [
        { value: "Activo", label: "Activo" },
        { value: "Inactivo", label: "Inactivo" },
        { value: "Finalizado", label: "Finalizado" },
      ],
    },
    { id: "fecha_cosecha", label: "Fecha Cosecha", type: "date" },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Formulario
        fields={fields}
        onSubmit={handleSubmit}
        isError={actualizarProduccion.isError}
        isSuccess={actualizarProduccion.isSuccess}
        title="Actualizar Producción"
        initialValues={formData}
      />
    </div>
  );
};

export default ActualizarProduccion;