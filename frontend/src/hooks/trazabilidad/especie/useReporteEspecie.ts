import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const useReporteEspeciePDF = () => {
  const generarPDF = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${apiUrl}especie/reporte`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const especies = data.reporte;
      console.log("a ver que trae esto",especies)

      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("Reporte de especies", 14, 20);

      autoTable(doc, {
        startY: 30,
        head: [["ID Tipo Cultivo", "Tipo Cultivo", "Total Especies"]],
        body: especies.map((p: any) => [
          p.id_tipo_cultivo,
          p.tipo_cultivo,
          p.total_especies,
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
