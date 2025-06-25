import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const useReporteVentasPDF = () => {
  const generarPDF = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${apiUrl}venta/reporte_ventas`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const ventas = data.reporteVentas;

      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("Reporte de Ventas por Producción", 14, 20);

      autoTable(doc, {
        startY: 30,
        head: [["ID Producción", "Descripción", "Cantidad Vendida", "Total Recaudado"]],
        body: ventas.map((v: any) => [
          v.id_produccion,
          v.descripcion_produccion,
          v.total_cantidad_vendida,
          `$${Number(v.total_recaudado).toFixed(2)}`,
        ]),
      });

      doc.save("reporte_ventas_por_produccion.pdf");
    } catch (error) {
      console.error("Error al generar el reporte por producción:", error);
    }
  };

  return { generarPDF };
};

export default useReporteVentasPDF;
