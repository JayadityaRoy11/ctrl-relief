"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Circle,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";

// 🔥 Icons
const createIcon = (color: string) =>
  new L.Icon({
    iconUrl: `https://maps.google.com/mapfiles/ms/icons/${color}-dot.png`,
    iconSize: [32, 32],
  });

const icons = {
  high: createIcon("red"),
  medium: createIcon("yellow"),
  low: createIcon("green"),
  user: createIcon("blue"),
};

export type ReliefMapMarker = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  subtitle?: string;
  detail?: string;
  urgency?: "High" | "Medium" | "Low";
};

type Props = {
  markers?: ReliefMapMarker[];
  height?: string;
};

const getDistance = (a: number, b: number, c: number, d: number) => {
  const R = 6371;
  const dLat = ((c - a) * Math.PI) / 180;
  const dLon = ((d - b) * Math.PI) / 180;

  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a * Math.PI) / 180) *
      Math.cos((c * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  return (R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x))).toFixed(2);
};

export default function ReliefMap({ markers = [], height = "450px" }: Props) {
  const [user, setUser] = useState<[number, number] | null>(null);
  const [movingMarker, setMovingMarker] = useState<[number, number] | null>(
    null
  );

  // 📍 Get user location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc: [number, number] = [
          pos.coords.latitude,
          pos.coords.longitude,
        ];
        setUser(loc);
        setMovingMarker(loc);
      },
      () => setUser([19.076, 72.8777])
    );
  }, []);

  // 🚗 Fake movement animation (VOLUNTEER EN ROUTE)
  useEffect(() => {
    if (!user || markers.length === 0) return;

    let i = 0;
    const target = markers[0];

    const interval = setInterval(() => {
      setMovingMarker((prev) => {
        if (!prev) return prev;

        const lat = prev[0] + (target.lat - prev[0]) * 0.05;
        const lng = prev[1] + (target.lng - prev[1]) * 0.05;

        return [lat, lng];
      });

      i++;
      if (i > 40) clearInterval(interval);
    }, 500);

    return () => clearInterval(interval);
  }, [user, markers]);

  if (!user) return null;

  return (
    <div style={{ height }} className="rounded-lg overflow-hidden border relative">
      <MapContainer center={user} zoom={12} style={{ height: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* 🔵 USER LOCATION */}
        <Marker position={user} icon={icons.user}>
          <Popup>You are here</Popup>
        </Marker>

        {/* 🔵 Radius */}
        <Circle center={user} radius={2000} pathOptions={{ color: "blue" }} />

        {/* 🚨 MARKERS */}
        {markers.map((m) => {
          const icon =
            m.urgency === "High"
              ? icons.high
              : m.urgency === "Medium"
              ? icons.medium
              : icons.low;

          const dist = getDistance(user[0], user[1], m.lat, m.lng);

          return (
            <Marker key={m.id} position={[m.lat, m.lng]} icon={icon}>
              <Popup>
                <div>
                  <strong>{m.name}</strong>
                  <br />
                  {m.subtitle}
                  <br />
                  📍 {dist} km away
                  <br />
                  🚨 {m.urgency}
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* 🚗 MOVING VOLUNTEER */}
        {movingMarker && markers.length > 0 && (
          <>
            <Marker position={movingMarker} icon={icons.user}>
              <Popup>Volunteer en route 🚗</Popup>
            </Marker>

            {/* 🧭 ROUTE LINE */}
            <Polyline positions={[user, [markers[0].lat, markers[0].lng]]} />
          </>
        )}
      </MapContainer>

      {/* 🧠 LEGEND */}
      <div className="absolute bottom-3 left-3 bg-white p-2 rounded shadow text-xs space-y-1">
        <div>🔴 High urgency</div>
        <div>🟡 Medium</div>
        <div>🟢 Low</div>
        <div>🔵 You / Volunteer</div>
      </div>

      {/* 🔥 LIVE ACTIVITY FEED */}
      <div className="absolute top-3 right-3 bg-white p-2 rounded shadow text-xs w-48">
        <div className="font-semibold mb-1">Live Activity</div>
        <div>✅ Volunteer assigned</div>
        <div>🚗 En route</div>
        <div>📍 Reached nearby</div>
      </div>
    </div>
  );
}