import { useState, useEffect } from 'react';
import io from 'socket.io-client';

interface Sensor {
  id_sensor: number;
  nombre_sensor: string;
  tipo_sensor: string;
  unidad_medida: string;
  descripcion: string;
  medida_minima: number;
  medida_maxima: number;
}

interface Mide {
  id_mide: number;
  valor_medicion: number;
  fecha_medicion: string;
  fk_id_sensor: number;
  fk_id_era: number;
}

export const useMide = () => {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [sensorData, setSensorData] = useState<Mide[]>([]);

  const getAuthToken = (): string => {
    return localStorage.getItem('token') || '';
  };

  useEffect(() => {
    // Conectar a socket.io
    const socket = io(import.meta.env.VITE_API_URL, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      auth: { token: getAuthToken() },
      withCredentials: true,
    });

    socket.on('connect', () => {
      console.log('✅ Conectado al WebSocket');
    });

    socket.on('connect_error', (err) => {
      console.error('Error de conexión WebSocket:', err.message);
    });

    socket.on('newMide', (newMide: any) => {
      console.log('Nueva medición recibida:', newMide);
      const normalizedMide: Mide = {
        id_mide: newMide.id_mide,
        valor_medicion: newMide.valor_medicion,
        fecha_medicion: newMide.fecha_medicion,
        fk_id_sensor: newMide.fk_id_sensor?.id_sensor || newMide.fk_id_sensor,
        fk_id_era: newMide.fk_id_era?.id || newMide.fk_id_era,
      };
      console.log('Medición normalizada:', normalizedMide);
      setSensorData((prev) => {
        const updatedData = [...prev, normalizedMide].slice(-50);
        console.log('sensorData actualizado:', updatedData);
        return updatedData;
      });
    });

    socket.on('disconnect', () => {
      console.log('⚠ Desconectado del WebSocket');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchSensors = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}sensores`, {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        });
        if (!response.ok) throw new Error(`Error al obtener sensores: ${response.statusText}`);
        const data = await response.json();
        console.log('Sensores obtenidos:', data.sensores);
        setSensors(data.sensores || []);
      } catch (error) {
        console.error('Error al obtener sensores:', error);
      }
    };
    fetchSensors();
  }, []);

  useEffect(() => {
    const fetchMide = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}mide`, {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        });
        if (!response.ok) throw new Error(`Error al obtener mediciones: ${response.statusText}`);
        const data = await response.json();
        const normalizedData = (data.mide || []).map((m: any) => ({
          id_mide: m.id_mide,
          valor_medicion: m.valor_medicion,
          fecha_medicion: m.fecha_medicion,
          fk_id_sensor: m.fk_id_sensor?.id_sensor || m.fk_id_sensor,
          fk_id_era: m.fk_id_era?.id || m.fk_id_era,
        }));
        console.log('Mediciones obtenidas:', normalizedData);
        setSensorData(normalizedData);
      } catch (error) {
        console.error('Error al obtener mediciones:', error);
      }
    };
    fetchMide();
  }, []);

  const createSensor = async (sensor: Omit<Sensor, 'id_sensor'>) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}sensores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(sensor),
      });
      if (!response.ok) throw new Error(`Error al crear sensor: ${response.statusText}`);
      const data = await response.json();
      setSensors((prev) => [...prev, data.sensor]);
    } catch (error) {
      console.error('Error al crear sensor:', error);
      throw error;
    }
  };

  return { sensors, sensorData, createSensor };
};