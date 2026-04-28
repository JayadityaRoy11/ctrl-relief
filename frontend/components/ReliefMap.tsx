"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";

// 🔥 Custom colored icons
const createIcon = (color: string) =>
  new L.Icon({
    iconUrl: `https://maps.google.com/mapfiles/ms/icons/${color}-dot.png`,
    iconSize: [32, 32],
  });

const redIcon = createIcon("red");
const yellowIcon = createIcon("yellow");
const greenIcon = createIcon("green");
const blueIcon = createIcon("blue");

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

// 📍 Helper: calculate distance (km)
const getDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(2);
};

export default function ReliefMap({
  markers = [],
  height = "400px",
  className = "",
  title = "",
  showLegend = true,
}: ReliefMapProps) {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );

  // 📍 Get user location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
      },
      () => {
        setUserLocation([19.076, 72.8777]); // fallback Mumbai
      }
    );
  }, []);

  if (!userLocation) return null;

  return (
    <div
      className={`relative rounded-lg overflow-hidden border ${className}`}
      style={{ height }}
    >
      <MapContainer
        center={userLocation}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* 🔵 USER LOCATION */}
        <Marker position={userLocation} icon={blueIcon}>
          <Popup>You are here</Popup>
        </Marker>

        {/* 🚨 OTHER MARKERS */}
        {markers.map((m) => {
          let icon = greenIcon;
          if (m.urgency === "High") icon = redIcon;
          else if (m.urgency === "Medium") icon = yellowIcon;

          const distance = getDistance(
            userLocation[0],
            userLocation[1],
            m.lat,
            m.lng
          );

          return (
            <Marker key={m.id} position={[m.lat, m.lng]} icon={icon}>
              <Popup>
                <div>
                  <strong>{m.name}</strong>
                  <br />
                  {m.subtitle}
                  <br />
                  📍 {distance} km away
                  <br />
                  {m.detail}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* 🏷️ TITLE */}
      {title && (
        <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded shadow text-sm font-semibold">
          {title}
        </div>
      )}

      {/* 🧠 LEGEND */}
      {showLegend && (
        <div className="absolute bottom-3 left-3 bg-white px-3 py-2 rounded shadow text-xs space-y-1">
          <div>🔴 High urgency</div>
          <div>🟡 Medium urgency</div>
          <div>🟢 Low urgency</div>
          <div>🔵 You</div>
        </div>
      )}
    </div>
  );
}