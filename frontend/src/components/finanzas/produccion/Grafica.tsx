import React from "react";
import { useNavigate } from "react-router-dom";
import { useProduccion } from "@/hooks/finanzas/produccion/useProduccion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const GraficaProduccionPorLote: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useProduccion();

  const datos = data?.map((item) => ({
    nombre: item.cultivo?.nombre_cultivo ?? "Sin nombre",
    cantidad: item.cantidad_producida ?? 0,
  })) ?? [];

  if (isLoading) return <div className="text-center">Cargando gráfica...</div>;
  if (error) return <div className="text-center text-red-500">Error al cargar datos</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">
        Producción por Cultivo
      </h2>

      <div className="bg-white p-4 shadow-md rounded-lg mb-6">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={datos}>
            <XAxis dataKey="nombre" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="cantidad" fill="#4F46E5" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="text-center">
        <button
          onClick={() => navigate("/produccion")}
          className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          Volver
        </button>
      </div>
    </div>
  );
};

export default GraficaProduccionPorLote;
