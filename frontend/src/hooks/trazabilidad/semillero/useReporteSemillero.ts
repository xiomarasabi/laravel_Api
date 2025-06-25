import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const useReporteSemilleroPDF = () => {
  const generarPDF = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${apiUrl}semilleros/reporte`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { total_semilleros, nombres_semilleros } = data.reporte;

      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("Reporte de Semilleros", 14, 20);

      autoTable(doc, {
        startY: 30,
        head: [["Total de Semilleros", "Nombres"]],
        body: [[
          total_semilleros,
          nombres_semilleros || "Sin nombres registrados"
        ]]
      });

      doc.save("reporte_semilleros.pdf");
    } catch (error) {
      console.error("❌ Error al generar el reporte de semilleros:", error);
    }
  };

  return { generarPDF };
};

export default useReporteSemilleroPDF;
