import { useState, useEffect } from "react";
import { useActualizarCultivo } from './../../../hooks/trazabilidad/cultivo/useActualizarCultivo';
import { useNavigate, useParams } from "react-router-dom";
import { useCultivoPorId } from "../../../hooks/trazabilidad/cultivo/useCultivoPorId";
import { fetchEspecies, fetchSemilleros, Especie, Semillero } from "../../../hooks/trazabilidad/cultivo/useCrearCultivos";
import Formulario from "../../globales/Formulario";

const ActualizarCultivo = () => {
  const { id } = useParams<{ id?: string }>();
  const { data: cultivo, isLoading, error } = useCultivoPorId(id);
  const actualizarCultivo = useActualizarCultivo();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<{
    nombre_cultivo: string;
    fecha_plantacion: string;
    descripcion: string;
    fk_id_especie: string;
    fk_id_semillero: string;
  }>({
    nombre_cultivo: "",
    fecha_plantacion: "",
    descripcion: "",
    fk_id_especie: "",
    fk_id_semillero: "",
  });

  const [especies, setEspecies] = useState<Especie[]>([]);
  const [semilleros, setSemilleros] = useState<Semillero[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsDataLoading(true);
        const [especiesData, semillerosData] = await Promise.all([
          fetchEspecies(),
          fetchSemilleros(),
        ]);
        setEspecies(especiesData);
        setSemilleros(semillerosData);
      } catch (err) {
        console.error("Error cargando especies o semilleros:", err);
      } finally {
        setIsDataLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (cultivo) {
      console.log("🔄 Actualizando formulario con:", cultivo);
      setFormData({
        nombre_cultivo: cultivo.nombre_cultivo ?? "",
        fecha_plantacion: cultivo.fecha_plantacion?.slice(0, 10) ?? "",
        descripcion: cultivo.descripcion ?? "",
        fk_id_especie: cultivo.fk_id_especie?.id?.toString() ?? "",
        fk_id_semillero: cultivo.fk_id_semillero?.id?.toString() ?? "",
      });
    }
  }, [cultivo]);

  const handleSubmit = (data: { [key: string]: string }) => {
    if (!id) return;

    const cultivoActualizado = {
      id: Number(id),
      nombre_cultivo: data.nombre_cultivo || "",
      fecha_plantacion: data.fecha_plantacion || "",
      descripcion: data.descripcion || null,
      fk_id_especie: parseInt(data.fk_id_especie) || 0,
      fk_id_semillero: parseInt(data.fk_id_semillero) || 0,
    };

    actualizarCultivo.mutate(cultivoActualizado, {
      onSuccess: () => {
        console.log("✅ Cultivo actualizado, redirigiendo a /cultivos");
        navigate("/cultivo");
      },
      onError: (error) => {
        console.error("❌ Error al actualizar cultivo:", error);
      },
    });
  };

  if (isLoading || isDataLoading) return <div className="text-gray-500">Cargando datos...</div>;
  if (error) return <div className="text-red-500">Error al cargar el cultivo</div>;

  const formFields = [
    { id: 'nombre_cultivo', label: 'Nombre del Cultivo*', type: 'text', required: true },
    { id: 'fecha_plantacion', label: 'Fecha de Plantación*', type: 'date', required: true },
    { id: 'descripcion', label: 'Descripción', type: 'textarea', required: false },
    {
      id: 'fk_id_especie',
      label: 'Especie*',
      type: 'select',
      options: especies.length > 0
        ? [{ value: '', label: 'Seleccione una especie...' }, ...especies.map(e => ({ value: e.id.toString(), label: e.nombre_comun || 'Sin nombre' }))]
        : [{ value: '', label: 'No hay especies disponibles' }],
      required: true,
    },
    {
      id: 'fk_id_semillero',
      label: 'Semillero*',
      type: 'select',
      options: semilleros.length > 0
        ? [{ value: '', label: 'Seleccione un semillero...' }, ...semilleros.map(s => ({ value: s.id.toString(), label: s.nombre_semilla || 'Sin nombre' }))]
        : [{ value: '', label: 'No hay semilleros disponibles' }],
      required: true,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Formulario
        title="Actualizar Cultivo"
        fields={formFields}
        onSubmit={handleSubmit}
        isError={actualizarCultivo.isError}
        isSuccess={actualizarCultivo.isSuccess}
        initialValues={formData}
        key={JSON.stringify(formData)}
      />
    </div>
  );
};

export default ActualizarCultivo;