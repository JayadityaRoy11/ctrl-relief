"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix marker icons (VERY important for Vercel)
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

export type ReliefMapMarker = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  subtitle?: string;
  detail?: string;
  urgency?: "High" | "Medium" | "Low";
};

type ReliefMapProps = {
  markers?: ReliefMapMarker[];
  height?: string;
  className?: string;
  title?: string;
  showLegend?: boolean;
};

export default function ReliefMap({
  markers = [],
  height = "400px",
  className = "",
  title = "",
  showLegend = true,
}: ReliefMapProps) {
  const defaultCenter: [number, number] =
    markers.length > 0
      ? [markers[0].lat, markers[0].lng]
      : [19.076, 72.8777]; // Mumbai fallback

  return (
    <div
      className={`relative rounded-lg overflow-hidden border ${className}`}
      style={{ height }}
    >
      {/* Map */}
      <MapContainer
        center={defaultCenter}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {markers.map((marker) => (
          <Marker key={marker.id} position={[marker.lat, marker.lng]}>
            <Popup>
              <div>
                <strong>{marker.name}</strong>
                <br />
                {marker.subtitle && <span>{marker.subtitle}</span>}
                <br />
                {marker.detail && <span>{marker.detail}</span>}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Title */}
      {title && (
        <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded shadow text-sm font-semibold">
          {title}
        </div>
      )}

      {/* Legend */}
      {showLegend && markers.length > 0 && (
        <div className="absolute bottom-3 left-3 bg-white px-3 py-2 rounded shadow text-xs">
          {markers.length} locations found
        </div>
      )}
    </div>
  );
}