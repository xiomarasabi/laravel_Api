import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";

const apiUrl = import.meta.env.VITE_API_URL;

const GraficasVentas: React.FC = () => {
  const [ventasProduccion, setVentasProduccion] = useState([]);
  const [ventasMensuales, setVentasMensuales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchData = async () => {
      try {
        const [resProduccion, resMensual] = await Promise.all([
          axios.get(`${apiUrl}venta/reporte_ventas`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${apiUrl}venta/reporte_mes`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setVentasProduccion(
          resProduccion.data.reporteVentas.map((v: any) => ({
            descripcion: v.descripcion_produccion,
            total: Number(v.total_recaudado),
          }))
        );

        setVentasMensuales(
          resMensual.data.reporteVentas.map((v: any) => ({
            mes: new Date(0, v.mes - 1).toLocaleString("es-ES", { month: "long" }),
            anio: v.anio,
            total: Number(v.total_recaudado),
          }))
        );

        setLoading(false);
      } catch (err) {
        console.error("Error al obtener datos de ventas:", err);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center">Cargando gráficas...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Resumen de Ventas
      </h1>

      {/* Contenedor en fila para ambas gráficas */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Gráfica por Producción */}
        <div className="flex-1 bg-white p-4 shadow-md rounded-xl">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 text-center">
            Ventas por Producción
          </h2>
          <div className="w-full overflow-x-auto">
            <div className="min-w-[500px]">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={ventasProduccion} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="descripcion" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" fill="#4ade80" name="Recaudado ($)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Gráfica por Mes */}
        <div className="flex-1 bg-white p-4 shadow-md rounded-xl">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 text-center">
            Ventas por Mes
          </h2>
          <div className="w-full overflow-x-auto">
            <div className="min-w-[500px]">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={ventasMensuales} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" fill="#60a5fa" name="Recaudado ($)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraficasVentas;
