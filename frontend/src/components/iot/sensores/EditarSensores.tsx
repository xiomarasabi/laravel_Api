import { useState, useEffect } from "react";
import { useEditarSensor } from "@/hooks/iot/sensores/useEditarSensor";
import { useNavigate, useParams } from "react-router-dom";
import { useSensorPorId } from "@/hooks/iot/sensores/useSensorPorId";
import Formulario from "../../globales/Formulario";
import { Sensores } from "@/hooks/iot/sensores/useEditarSensor";

const EditarSensor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  console.log("🔍 Accediendo a EditarSensor con ID:", id);

  if (!id || isNaN(Number(id))) {
    console.error("❌ Error: ID no válido:", id);
    return <div className="text-red-500">Error: ID no válido</div>;
  }

  const { data: sensor, isLoading, error } = useSensorPorId(id);
  const actualizarSensor = useEditarSensor();
  const [formData, setFormData] = useState<Sensores>({
    id: Number(id),
    nombre_sensor: "",
    tipo_sensor: "",
    unidad_medida: "",
    descripcion: "",
    medida_minima: 0,
    medida_maxima: 0,
  });
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (sensor) {
      console.log("🔄 Cargando datos del Sensor:", sensor);
      setFormData({
        id: Number(id),
        nombre_sensor: sensor.nombre_sensor || "",
        tipo_sensor: sensor.tipo_sensor || "",
        unidad_medida: sensor.unidad_medida || "",
        descripcion: sensor.descripcion || "",
        medida_minima: sensor.medida_minima ?? 0,
        medida_maxima: sensor.medida_maxima ?? 0,
      });
    }
  }, [sensor, id]);

  const handleSubmit = (data: { [key: string]: string }) => {
    if (!id) return;

    const errors: string[] = [];
    if (!data.nombre_sensor.trim()) {
      errors.push("El nombre del sensor es requerido.");
    }
    if (!data.tipo_sensor.trim()) {
      errors.push("El tipo de sensor es requerido.");
    } else if (
      ![
        "TEMPERATURA",
        "HUMEDAD_AMBIENTAL",
        "ILUMINACION",
        "HUMEDAD_TERRENO",
        "VELOCIDAD_VIENTO",
        "NIVEL_DE_PH",
      ].includes(data.tipo_sensor.toUpperCase())
    ) {
      errors.push("El tipo de sensor no es válido.");
    }
    if (!data.unidad_medida.trim()) {
      errors.push("La unidad de medida es requerida.");
    }
    if (!data.descripcion.trim()) {
      errors.push("La descripción es requerida.");
    }
    if (!data.medida_minima || isNaN(Number(data.medida_minima))) {
      errors.push("La medida mínima es requerida y debe ser un número válido.");
    }
    if (!data.medida_maxima || isNaN(Number(data.medida_maxima))) {
      errors.push("La medida máxima es requerida y debe ser un número válido.");
    } else if (Number(data.medida_maxima) <= Number(data.medida_minima)) {
      errors.push("La medida máxima debe ser mayor que la medida mínima.");
    }

    if (errors.length > 0) {
      setFormError(errors.join(" "));
      console.error("⚠️ Datos inválidos:", errors);
      return;
    }

    const sensorActualizado: Sensores = {
      id: Number(id),
      nombre_sensor: data.nombre_sensor.trim(),
      tipo_sensor: data.tipo_sensor.trim().toUpperCase(),
      unidad_medida: data.unidad_medida.trim(),
      descripcion: data.descripcion.trim(),
      medida_minima: Number(data.medida_minima),
      medida_maxima: Number(data.medida_maxima),
    };

    console.log("🚀 Enviando Sensor actualizado:", sensorActualizado);

    actualizarSensor.mutate(sensorActualizado, {
      onSuccess: (response) => {
        console.log("✅ Sensor actualizado correctamente:", response);
        setFormError(null);
        navigate("/iot/sensores");
      },
      onError: (err: any) => {
        const errorMessage = err.message || "Error al actualizar el sensor.";
        setFormError(errorMessage);
        console.error("❌ Error al actualizar:", errorMessage, err.response?.data);
      },
    });
  };

  if (isLoading) {
    console.log("⏳ Componente en estado de carga");
    return <div className="text-gray-500">Cargando datos...</div>;
  }
  if (error) {
    console.log("❌ Error al cargar sensor:", error);
    return <div className="text-red-500">Error al cargar el Sensor: {error.message}</div>;
  }
  if (!sensor) {
    console.log("⚠️ Sensor no encontrado para ID:", id);
    return <div className="text-red-500">Sensor no encontrado</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {formError && (
        <div className="text-red-500 mb-4 p-4 bg-red-100 rounded-md">{formError}</div>
      )}
      {actualizarSensor.isPending ? (
        <div className="text-center text-gray-600">Actualizando sensor...</div>
      ) : (
        <Formulario
          fields={[
            { id: "nombre_sensor", label: "Nombre del Sensor", type: "text" },
            {
              id: "tipo_sensor",
              label: "Tipo de Sensor",
              type: "select",
              options: [
                { value: "TEMPERATURA", label: "Temperatura" },
                { value: "HUMEDAD_AMBIENTAL", label: "Humedad ambiental" },
                { value: "ILUMINACION", label: "Iluminación" },
                { value: "HUMEDAD_TERRENO", label: "Humedad terreno" },
                { value: "VELOCIDAD_VIENTO", label: "Velocidad viento" },
                { value: "NIVEL_DE_PH", label: "Nivel de pH" },
              ],
            },
            { id: "unidad_medida", label: "Unidad de Medida", type: "text" },
            { id: "descripcion", label: "Descripción", type: "text" },
            { id: "medida_minima", label: "Medida Mínima", type: "number" },
            { id: "medida_maxima", label: "Medida Máxima", type: "number" },
          ]}
          onSubmit={handleSubmit}
          isError={actualizarSensor.isError || !!formError}
          isSuccess={actualizarSensor.isSuccess}
          title="Actualizar Sensor"
          initialValues={{
            nombre_sensor: formData.nombre_sensor,
            tipo_sensor: formData.tipo_sensor,
            unidad_medida: formData.unidad_medida,
            descripcion: formData.descripcion,
            medida_minima: formData.medida_minima.toString(),
            medida_maxima: formData.medida_maxima.toString(),
          }}
          key={JSON.stringify(formData)}
        />
      )}
    </div>
  );
};

export default EditarSensor;