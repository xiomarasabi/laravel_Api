import { useState, useEffect } from "react";
import { useActualizarControlFitosanitario } from "../../../hooks/trazabilidad/control/useActualizarControlFitosanitario";
import { useNavigate, useParams } from "react-router-dom";
import { useControlFitosanitarioPorId } from "../../../hooks/trazabilidad/control/useControlFitosanitarioPorId";
import { useControlFitosanitario } from "../../../hooks/trazabilidad/control/useControlFitosanitario";
import Formulario from "../../globales/Formulario";

export interface ControlFitosanitario {
  id: number;
  fecha_control: string;
  descripcion: string;
  fk_id_desarrollan: number;
  desarrollan: Desarrollan;
}

export interface Desarrollan {
  id: number;
  cultivo: Cultivo;
  pea: Pea;
}

export interface Cultivo {
  id: number;
  nombre_cultivo: string;
  fecha_plantacion: string;
  descripcion: string;
}

export interface Pea {
  id: number;
  nombre: string;
  descripcion: string;
}

const ActualizarControlFitosanitario = () => {
  const { id } = useParams<{ id: string }>();
  const { data: control, isLoading: isLoadingControl, error: errorControl } = useControlFitosanitarioPorId(id);
  const { data: controles = [], isLoading: isLoadingControles, error: errorControles } = useControlFitosanitario();
  const actualizarControl = useActualizarControlFitosanitario();
  const navigate = useNavigate();
  const [errorMensaje, setErrorMensaje] = useState<string>('');

  const [formData, setFormData] = useState<{ [key: string]: string }>({
    fecha_control: "",
    descripcion: "",
    fk_id_desarrollan: "",
  });

  // Extraer opciones únicas para el select de desarrollan
  const desarrollanOptions = Array.from(
    new Map(
      controles.map((control) => {
        const desarrollan = control.desarrollan;
        const nombrePea = desarrollan?.pea?.nombre || '';
        const nombreCultivo = desarrollan?.cultivo?.nombre_cultivo || '';
        const label = nombreCultivo && nombrePea ? `${nombreCultivo} - ${nombrePea}` : nombreCultivo || nombrePea || `Desarrollan ID: ${desarrollan?.id}`;
        return [desarrollan?.id, { value: desarrollan?.id.toString(), label }];
      })
    ).values()
  );

  useEffect(() => {
    if (control && Object.keys(control).length > 0) {
      console.log("🔄 Cargando datos del Control Fitosanitario:", control);
      setFormData({
        fecha_control: control.fecha_control ?? "",
        descripcion: control.descripcion ?? "",
        fk_id_desarrollan: control.fk_id_desarrollan ? control.fk_id_desarrollan.toString() : "",
      });
    }
  }, [control]);

  const handleSubmit = (data: { [key: string]: string }) => {
    if (!id) {
      setErrorMensaje("❌ ID no proporcionado.");
      return;
    }

    if (!data.fecha_control || !data.descripcion || !data.fk_id_desarrollan) {
      setErrorMensaje("❌ Todos los campos son obligatorios.");
      return;
    }

    const controlActualizado = {
      id: Number(id),
      fecha_control: data.fecha_control,
      descripcion: data.descripcion.trim(),
      fk_id_desarrollan: Number(data.fk_id_desarrollan),
    };

    console.log("🚀 Enviando Control Fitosanitario actualizado:", controlActualizado);

    actualizarControl.mutate(controlActualizado, {
      onSuccess: () => {
        console.log("✅ Control Fitosanitario actualizado correctamente");
        navigate("/control-fitosanitario");
      },
      onError: (error: any) => {
        const message = error?.message || "Error desconocido";
        console.error("❌ Error al actualizar Control Fitosanitario:", message);
        setErrorMensaje(`Ocurrió un error al actualizar el control: ${message}`);
      },
    });
  };

  if (isLoadingControl || isLoadingControles) {
    return <div className="text-center text-gray-500">Cargando datos...</div>;
  }

  if (errorControl || errorControles) {
    const errorMessage = errorControl?.message || errorControles?.message || "Error al cargar los datos";
    return <div className="text-red-500 text-center">Error: {errorMessage}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {errorMensaje && <p className="text-red-500 mb-2">{errorMensaje}</p>}
      <Formulario
        fields={[
          { id: 'fecha_control', label: 'Fecha de Control', type: 'date' },
          { id: 'descripcion', label: 'Descripción', type: 'text' },
          {
            id: 'fk_id_desarrollan',
            label: 'Selecciona el PEA y Cultivo',
            type: 'select',
            options: desarrollanOptions,
          },
        ]}
        onSubmit={handleSubmit}
        isError={actualizarControl.isError}
        isSuccess={actualizarControl.isSuccess}
        title="Actualizar Control Fitosanitario"
        initialValues={formData}
      />
    </div>
  );
};

export default ActualizarControlFitosanitario;