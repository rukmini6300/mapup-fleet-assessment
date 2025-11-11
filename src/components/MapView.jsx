"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Dynamically import react-leaflet components (browser only)
const MapContainer = dynamic(
  () => import("react-leaflet").then(mod => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then(mod => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then(mod => mod.Marker),
  { ssr: false }
);
const Polyline = dynamic(
  () => import("react-leaflet").then(mod => mod.Polyline),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then(mod => mod.Popup),
  { ssr: false }
);

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/marker-icon-2x.png",
  iconUrl: "/marker-icon.png",
  shadowUrl: "/marker-shadow.png",
});

export default function MapView({ trips = [] }) {
  const [positions, setPositions] = useState([]);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (trips.length > 0) {
      const startPositions = trips.map(
        trip => trip.length > 0 ? trip[0].location : null
      );
      setPositions(startPositions);
    }
  }, [trips]);

  useEffect(() => {
    if (trips.length === 0) return;

    let step = 0;
    intervalRef.current = setInterval(() => {
      setPositions(prev =>
        prev.map((pos, i) => {
          const trip = trips[i];
          if (!trip || trip.length === 0) return pos;
          const nextIndex = Math.min(step, trip.length - 1);
          return trip[nextIndex].location;
        })
      );
      step++;
      if (step > Math.max(...trips.map(t => t.length))) {
        clearInterval(intervalRef.current);
      }
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [trips]);

  const defaultCenter = [20.5937, 78.9629];

  // 🧩 Render only on client
  if (typeof window === "undefined") return null;

  return (
    <div className="w-full h-[70vh] rounded-xl overflow-hidden shadow-md mb-8">
      <MapContainer
        center={defaultCenter}
        zoom={4}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {trips.map((trip, i) => (
           <div key={`trip-${i}`}>
            <Polyline
              key={`poly-${i}`}
              positions={trip.map(e => [e.location.lat, e.location.lng])}
              color="blue"
              weight={3}
            />
            {positions[i] && (
              <Marker key={`marker-${i}`} position={[positions[i].lat, positions[i].lng]}>
                <Popup>
                  <div>
                    <strong>Trip {i + 1}</strong><br />
                    Lat: {positions[i].lat.toFixed(2)}, Lng: {positions[i].lng.toFixed(2)}
                  </div>
                </Popup>
              </Marker>
            )}
          </div>
        ))}
      </MapContainer>
    </div>
  );
}
