import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const useReporteProduccionPDF = () => {
  const generarPDF = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${apiUrl}produccion/reporte`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const producciones = data.producciones;

      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("Reporte de Producción por Lote", 14, 20);

      autoTable(doc, {
        startY: 30,
        head: [["ID Lote", "Nombre del Lote", "Cantidad Producida"]],
        body: producciones.map((p: any) => [
          p.fk_id_lote.id,
          p.fk_id_lote.nombre_lote,
          `${Number(p.cantidad_producida).toFixed(2)}`,
        ]),
      });

      doc.save("reporte_produccion_por_lote.pdf");
    } catch (error) {
      console.error("❌ Error al generar el reporte de producción:", error);
    }
  };

  return { generarPDF };
};

export default useReporteProduccionPDF;
