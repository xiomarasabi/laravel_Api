import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const useReporteSemilleroPDF = () => {
  const generarPDF = async () => {
    try {
      const token = localStorage.getItem("token");

      const { data: semilleros } = await axios.get(`${apiUrl}semilleros`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("Reporte de Semilleros", 14, 20);

      autoTable(doc, {
        startY: 30,
        head: [["ID", "Nombre Semilla", "Fecha Siembra", "Fecha Estimada", "Cantidad"]],
        body: semilleros.map((s: any) => [
          s.id,
          s.nombre_semilla,
          s.fecha_siembra,
          s.fecha_estimada,
          s.cantidad,
        ]),
      });

      doc.save("reporte_semilleros.pdf");
    } catch (error) {
      console.error("❌ Error al generar el reporte de semilleros:", error);
    }
  };

  return { generarPDF };
};

export default useReporteSemilleroPDF;
