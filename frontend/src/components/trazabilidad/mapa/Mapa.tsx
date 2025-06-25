import React, { useState, useEffect, Fragment } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";

const apiUrl = import.meta.env.VITE_API_URL;

interface Ubicacion {
  latitud: string;
  longitud: string;
}

interface Lote {
  id: number;
  fk_id_ubicacion: Ubicacion;
  dimension: string;
  nombre_lote: string;
  estado: string;
}

// Componente auxiliar para cambiar el centro dinámicamente
const CambiarCentroMapa: React.FC<{ center: LatLngExpression }> = ({ center }) => {
  const map = useMap();
  map.setView(center); // Actualiza la vista al nuevo centro
  return null;
};

const Mapa: React.FC = () => {
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [center, setCenter] = useState<LatLngExpression>([1.8667, -76.0145]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${apiUrl}lotes/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const data = response.data;

        if (Array.isArray(data.lote)) {
          setLotes(data.lote);

          // Centrar en el primer lote con ubicación válida
          const primerLote = data.lote.find(
            (l: Lote) =>
              l.fk_id_ubicacion &&
              l.fk_id_ubicacion.latitud &&
              l.fk_id_ubicacion.longitud
          );

          if (primerLote) {
            const lat = parseFloat(primerLote.fk_id_ubicacion.latitud);
            const lng = parseFloat(primerLote.fk_id_ubicacion.longitud);
            setCenter([lat, lng]);
          }
        } else {
          console.error("La respuesta de /lotes/ no es un arreglo:", data);
        }
      })
      .catch((error) => {
        console.error("Error al obtener los lotes:", error);
      });
  }, []);

  return (
    <div style={{ height: "700px", width: "100%" }}>
      <MapContainer
        center={center}
        zoom={15}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <Fragment>
          <CambiarCentroMapa center={center} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {lotes.map((lote, index) => {
            const ubicacion = lote.fk_id_ubicacion;
            if (!ubicacion) return null;

            const lat = parseFloat(ubicacion.latitud);
            const lng = parseFloat(ubicacion.longitud);

            return (
              <Marker key={`marker-${lote.id}-${index}`} position={[lat, lng]}>
                <Popup>
                  <div style={{ minWidth: "180px" }}>
                    <h1 className="font-bold text-lg">{lote.nombre_lote || "Sin nombre"}</h1>
                    <p><strong>Dimensión:</strong> {lote.dimension || "No especificada"}</p>
                    <p><strong>Estado:</strong> {lote.estado || "Sin estado"}</p>
                    <p>
                      <strong>Latitud:</strong> {ubicacion.latitud}<br />
                      <strong>Longitud:</strong> {ubicacion.longitud}
                    </p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </Fragment>
      </MapContainer>
    </div>
  );
};

export default Mapa;