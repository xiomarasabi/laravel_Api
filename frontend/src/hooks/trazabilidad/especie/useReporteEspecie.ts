import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const useReporteEspeciePDF = () => {
  const generarPDF = async () => {
    try {
      const token = localStorage.getItem("token");

      const { data: especies } = await axios.get(`${apiUrl}especies`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("Reporte de Especies", 14, 20);

      autoTable(doc, {
        startY: 30,
        head: [
          [
            "ID",
            "Nombre Común",
            "Nombre Científico",
            "Descripción",
            "ID Tipo Cultivo",
            "Tipo Cultivo",
          ],
        ],
        body: especies.map((especie: any) => [
          especie.id,
          especie.nombre_comun || "Sin nombre común",
          especie.nombre_cientifico || "Sin nombre científico",
          especie.descripcion || "Sin descripción",
          especie.fk_id_tipo_cultivo || "Sin ID",
          especie.tipo_cultivo?.nombre || "Sin tipo cultivo",
        ]),
      });

      doc.save("reporte_especies.pdf");
    } catch (error) {
      console.error("❌ Error al generar el reporte de especies:", error);
    }
  };

  return { generarPDF };
};

export default useReporteEspeciePDF;
