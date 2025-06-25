import { useState, useEffect, useMemo } from 'react';
import { useMide } from '../hooks/iot/mide/useMide';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SensorDisplayData {
  id: number;
  nombre: string;
  valor: string;
  icon: string;
}

interface ChartDataPoint {
  fecha: string;
  valor: number;
  sensor?: string;
}

const icons: { [key: string]: string } = {
  TEMPERATURA: '🌡️',
  HUMEDAD_AMBIENTAL: '💧',
  default: '📏',
};

// Colores para cada sensor
const sensorColors: { [key: number]: string } = {
  1: '#D1FAE5', // Verde menta claro para Temperatura
  2: '#EDE9FE', // Lavanda claro para Humedad
};

const formatSensorValue = (value: number, tipoSensor: string): string => {
  switch (tipoSensor.toUpperCase()) {
    case 'TEMPERATURA':
      return `${value.toFixed(2)}°C`;
    case 'HUMEDAD_AMBIENTAL':
      return `${value.toFixed(2)}%`;
    default:
      return value.toFixed(2);
  }
};

// Estilo personalizado para el Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 shadow-md rounded-lg p-2">
        <p className="text-gray-800 text-sm font-semibold">{label}</p>
        <p className="text-gray-600 text-sm">{`Valor: ${payload[0].value.toFixed(2)}`}</p>
      </div>
    );
  }
  return null;
};

const HomePage = () => {
  const { sensors, sensorData } = useMide();
  const [sensorDisplayData, setSensorDisplayData] = useState<SensorDisplayData[]>([]);

  // Generar datos para las tarjetas
  useEffect(() => {
    if (!sensors?.length) {
      setSensorDisplayData([]);
      return;
    }

    const updatedSensorData = sensors.map((sensor) => {
      const latestData = sensorData
        .filter((data) => data.fk_id_sensor === sensor.id_sensor)
        .slice(-1)[0];
      const valor = latestData
        ? formatSensorValue(latestData.valor_medicion, sensor.tipo_sensor)
        : 'Esperando datos...';
      return {
        id: sensor.id_sensor,
        nombre: sensor.nombre_sensor,
        valor,
        icon: icons[sensor.tipo_sensor.toUpperCase()] || icons.default,
      };
    });
    setSensorDisplayData(updatedSensorData);
  }, [sensors, sensorData]);

  // Generar datos para los gráficos
  const groupedData = useMemo(() => {
    if (!sensors?.length || !sensorData?.length) return {};
    const data: { [key: number]: ChartDataPoint[] } = {};
    sensorData.forEach((reading) => {
      const sensor = sensors.find((s) => s.id_sensor === reading.fk_id_sensor);
      if (sensor) {
        if (!data[reading.fk_id_sensor]) data[reading.fk_id_sensor] = [];
        const fechaLegible = new Date(reading.fecha_medicion).toLocaleString();
        data[reading.fk_id_sensor].push({
          fecha: fechaLegible,
          valor: reading.valor_medicion,
          sensor: sensor.nombre_sensor,
        });
      }
    });
    console.log('groupedData:', data);
    return data;
  }, [sensorData, sensors]);

  const getSensorName = (sensorId: number) => {
    const sensor = sensors.find((s) => s.id_sensor === sensorId);
    return sensor ? sensor.nombre_sensor : 'Sensor Desconocido';
  };

  return (
    <div
      className="p-6 min-h-screen"
      style={{
        backgroundImage:
          'url("https://images.unsplash.com/photo-1500595046743-ee5a024c7ac8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {sensorDisplayData.map((sensor) => (
          <Link to={`/historical/${sensor.id}`} key={sensor.id}>
            <Card
              className="cursor-pointer hover:bg-gray-50 transition-colors duration-200 rounded-xl shadow-sm border border-gray-100"
              style={{ backgroundColor: sensorColors[sensor.id] || '#FFFFFF' }}
            >
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{sensor.icon}</span>
                  <div>
                    <CardTitle className="text-sm font-semibold text-gray-900">
                      {sensor.nombre}
                    </CardTitle>
                    <p className="text-lg font-bold text-gray-900">{sensor.valor}</p>
                  </div>
                </div>
                <span className="text-teal-600 text-xs font-semibold px-2 py-1 bg-white rounded-full">
                  Activo
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">📊 Gráficos de Sensores</h2>
        {Object.keys(groupedData).length > 0 ? (
          <Carousel>
            <CarouselContent>
              {Object.keys(groupedData).map((sensorId) => (
                <CarouselItem key={sensorId}>
                  <h3 className="text-lg font-semibold text-center mb-4 text-gray-900">
                    {getSensorName(Number(sensorId))}
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={groupedData[Number(sensorId)] || []}
                      style={{ backgroundColor: '#FFFFFF' }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="fecha" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip content={<CustomTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="valor"
                        stroke={sensorColors[Number(sensorId)] || '#8884d8'}
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        ) : (
          <p className="text-gray-500">No hay datos para mostrar gráficos</p>
        )}
      </div>
    </div>
  );
};

export { HomePage };