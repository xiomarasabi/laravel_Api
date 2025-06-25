import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const useReporteMensualPDF = () => {
  const generarPDF = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${apiUrl}venta/reporte_mes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const ventas = data.reporteVentas;

      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("Reporte de Ventas por Mes", 14, 20);

      autoTable(doc, {
        startY: 30,
        head: [["Año", "Mes", "Total Recaudado"]],
        body: ventas.map((v: any) => [
          v.anio,
          new Date(0, v.mes - 1).toLocaleString("es-ES", { month: "long" }),
          `$${Number(v.total_recaudado).toFixed(2)}`,
        ]),
      });

      doc.save("reporte_ventas_por_mes.pdf");
    } catch (error) {
      console.error("Error al generar el reporte:", error);
    }
  };

  return { generarPDF };
};


export default useReporteMensualPDF;